export type LabelStatus = 'em_andamento' | 'enviado_industria' | 'alteracao' | 'aprovado' | 'finalizado';

export interface Industry {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    nome: string;
    email: string;
    telefone: string;
    whatsapp: string;
  };
  site: string;
  observacoes: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface NutrientRow {
  id: string;
  nutriente: string;
  por100g: string;
  porPorcao: string;
  vd: string;
}

export interface LabelAttachment {
  id: string;
  name: string;
  type: 'rotulo_cru' | 'rotulo_designer' | 'rotulo_corrigido';
  url: string;
  uploadedAt: string;
  notes?: string;
}

export interface LabelRevision {
  id: string;
  fromStatus: LabelStatus;
  toStatus: LabelStatus;
  changedFields: string[];
  notes: string;
  createdAt: string;
}

export interface LabelContent {
  ingredientes: string;
  sugestaoUso: string;
  advertencias: string[];
  conservacao: string;
  grupoPopulacional: string;
  dispensadoRegistro: boolean;
  textoDispensado: string;
  contemGluten: boolean | null;
  aromatizante: string;
  fabricante: {
    nome: string;
    cnpj: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    site: string;
    sac: string;
    email: string;
  };
  distribuidor: { nome: string; cnpj: string } | null;
  tabelaNutricional: NutrientRow[];
}

export interface Label {
  id: string;
  industryId: string;
  nomeProduto: string;
  sabor: string;
  apresentacao: string;
  tipoSuplemento: 'capsulas' | 'po' | 'liquido' | 'sache' | 'outro';
  qtdPorcoes: number;
  pesoPorcao: number;
  unidadePeso: 'g' | 'ml' | 'mg';
  pesoLiquido: number;
  unidadePesoLiquido: 'g' | 'ml';
  status: LabelStatus;
  prazo: string | null;
  designerEmail: string;
  codigoBarras: string;
  content: LabelContent;
  attachments: LabelAttachment[];
  revisions: LabelRevision[];
  changedFields: string[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<LabelStatus, { label: string; bgClass: string; textClass: string; icon: string }> = {
  em_andamento: { label: 'Em Andamento', bgClass: 'bg-status-progress-bg', textClass: 'text-status-progress-text', icon: '🔵' },
  enviado_industria: { label: 'Enviado p/ Indústria', bgClass: 'bg-status-sent-bg', textClass: 'text-status-sent-text', icon: '📤' },
  alteracao: { label: 'Solicitação de Alteração', bgClass: 'bg-status-change-bg', textClass: 'text-status-change-text', icon: '🔄' },
  aprovado: { label: 'Aprovado', bgClass: 'bg-status-approved-bg', textClass: 'text-status-approved-text', icon: '✅' },
  finalizado: { label: 'Finalizado', bgClass: 'bg-status-done-bg', textClass: 'text-status-done-text', icon: '🏁' },
};

export const STATUS_ORDER: LabelStatus[] = ['em_andamento', 'enviado_industria', 'alteracao', 'aprovado', 'finalizado'];
