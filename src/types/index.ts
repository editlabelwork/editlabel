export type LabelStatus = 'rascunho' | 'enviado' | 'em_analise' | 'alteracao' | 'aprovado';

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
  createdAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<LabelStatus, { label: string; bgClass: string; textClass: string }> = {
  rascunho: { label: 'Rascunho', bgClass: 'bg-status-draft-bg', textClass: 'text-status-draft-text' },
  enviado: { label: 'Enviado ao Designer', bgClass: 'bg-status-sent-bg', textClass: 'text-status-sent-text' },
  em_analise: { label: 'Em Análise', bgClass: 'bg-status-review-bg', textClass: 'text-status-review-text' },
  alteracao: { label: 'Alteração Solicitada', bgClass: 'bg-status-change-bg', textClass: 'text-status-change-text' },
  aprovado: { label: 'Aprovado', bgClass: 'bg-status-approved-bg', textClass: 'text-status-approved-text' },
};
