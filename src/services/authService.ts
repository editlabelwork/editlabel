/**
 * Serviço de Autenticação
 * Gerencia login, registro e tokens JWT
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nome: string;
  crf: string;
  estado: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: string;
    ativo: boolean;
    twoFactorEnabled: boolean;
    consentimentoLGPD: boolean;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  /**
   * Fazer login
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    const result: AuthResponse = await response.json();
    
    // Salvar tokens
    this.setTokens(result.accessToken, result.refreshToken);
    
    return result;
  }

  /**
   * Registrar novo usuário
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao registrar');
    }

    const result: AuthResponse = await response.json();
    
    // Salvar tokens
    this.setTokens(result.accessToken, result.refreshToken);
    
    return result;
  }

  /**
   * Fazer logout
   */
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Obter usuário atual
   */
  static async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_ME}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Sessão expirada');
      }
      throw new Error('Erro ao obter usuário');
    }

    return response.json();
  }

  /**
   * Renovar token
   */
  static async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Erro ao renovar token');
    }

    const result = await response.json();
    this.setToken(result.accessToken);
    
    return result.accessToken;
  }

  /**
   * Obter token de acesso
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obter refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verificar se está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Salvar tokens
   */
  private static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Salvar token de acesso
   */
  private static setToken(accessToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
  }

  /**
   * Fazer requisição autenticada
   */
  static async authenticatedFetch(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Não autenticado');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Se receber 401, tentar renovar token
    if (response.status === 401) {
      try {
        const newToken = await this.refreshToken();
        headers['Authorization'] = `Bearer ${newToken}`;
        
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (error) {
        this.logout();
        throw error;
      }
    }

    return response;
  }
}

export default AuthService;
