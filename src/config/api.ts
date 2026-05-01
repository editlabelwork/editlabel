// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_ME: '/api/auth/me',
  AUTH_2FA_ENABLE: '/api/auth/2fa/enable',
  AUTH_2FA_VERIFY: '/api/auth/2fa/verify',
  
  // Labels
  LABELS: '/api/labels',
  LABEL_BY_ID: (id: string) => `/api/labels/${id}`,
  LABELS_VALIDATE: '/api/labels/validate',
  LABELS_EXPORT: (id: string) => `/api/labels/${id}/export`,
  
  // Compliance
  COMPLIANCE_RDCS: '/api/compliance/rdcs',
  COMPLIANCE_VALIDATE: '/api/compliance/validate',
  COMPLIANCE_CHECK_REGISTRATION: '/api/compliance/check-registration',
  
  // LGPD
  LGPD_PRIVACY_POLICY: '/api/lgpd/privacy-policy',
  LGPD_MY_DATA: '/api/lgpd/my-data',
  LGPD_REQUEST_DELETION: '/api/lgpd/request-deletion',
  LGPD_CONSENT: '/api/lgpd/consent',
};

// API Client
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
