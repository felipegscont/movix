// Tipos para o módulo NFe - seguindo padrões do projeto

// Interface principal do formulário NFe
export interface NfeFormData {
  // Dados Gerais
  emitenteId?: string
  clienteId: string
  serie?: number
  naturezaOperacao: string
  tipoOperacao: number
  consumidorFinal: number
  presencaComprador: number
  dataEmissao?: string
  dataSaida?: string
  modalidadeFrete?: number
  
  // Valores
  valorFrete?: number
  valorSeguro?: number
  valorDesconto?: number
  valorOutros?: number
  valorICMSDesonerado?: number
  valorFCP?: number
  valorII?: number
  valorOutrasDespesas?: number
  
  // Informações Adicionais
  informacoesAdicionais?: string
  informacoesFisco?: string
  
  // Itens
  itens: NfeItemFormData[]
  
  // Cobrança
  cobranca?: NfeCobrancaFormData
  duplicatas?: NfeDuplicataFormData[]
  pagamentos?: NfePagamentoFormData[]
}

// Interface para itens da NFe
export interface NfeItemFormData {
  produtoId: string
  codigo: string
  descricao: string
  ncmId: string
  cfopId: string
  unidadeComercial: string
  quantidadeComercial: number
  valorUnitario: number
  valorDesconto: number
  valorTotal: number
  origem: string
  
  // Impostos ICMS
  icmsCstId?: string
  icmsCsosnId?: string
  icmsBaseCalculo?: number
  icmsAliquota?: number
  icmsValor?: number
  
  // Impostos PIS
  pisCstId?: string
  pisBaseCalculo?: number
  pisAliquota?: number
  pisValor?: number
  
  // Impostos COFINS
  cofinsCstId?: string
  cofinsBaseCalculo?: number
  cofinsAliquota?: number
  cofinsValor?: number
}

// Interfaces para cobrança
export interface NfeCobrancaFormData {
  numeroFatura?: string
  valorOriginal: number
  valorDesconto?: number
  valorLiquido: number
}

export interface NfeDuplicataFormData {
  numero: string
  dataVencimento: string
  valor: number
}

export interface NfePagamentoFormData {
  formaPagamentoId: string
  valor: number
  dataVencimento?: string
}

// Wizard - Estados e navegação
export type WizardStep = 'geral' | 'itens' | 'cobranca' | 'revisao'

export interface WizardState {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  canProceed: boolean
  errors: Record<string, string[]>
}

// Status da NFe
export type NfeStatus = 
  | 'DIGITACAO'
  | 'VALIDADA'
  | 'TRANSMITIDA'
  | 'AUTORIZADA'
  | 'CANCELADA'
  | 'REJEITADA'

export interface NfeStatusInfo {
  status: NfeStatus
  canEdit: boolean
  canTransmit: boolean
  canCancel: boolean
  canPrint: boolean
  nextActions: string[]
  statusColor: 'default' | 'secondary' | 'destructive' | 'success' | 'warning'
}

// Props para componentes
export interface NfeWizardProps {
  nfeId?: string
  onSuccess?: () => void
}

export interface NfeItemDialogProps {
  item?: NfeItemFormData
  isOpen: boolean
  onClose: () => void
  onSave: (item: NfeItemFormData) => void
}

export interface NfePreviewProps {
  formData: NfeFormData
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

// Validação
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

// Constantes do wizard
export const WIZARD_STEPS: { key: WizardStep; label: string; description: string }[] = [
  { key: 'geral', label: 'Dados Gerais', description: 'Informações básicas da NFe' },
  { key: 'itens', label: 'Itens', description: 'Produtos e serviços' },
  { key: 'cobranca', label: 'Cobrança', description: 'Duplicatas e pagamentos' },
  { key: 'revisao', label: 'Revisão', description: 'Conferir dados antes de salvar' }
]
