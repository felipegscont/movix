/**
 * Tipos de API e Responses
 * Tipos para comunicação com a API e respostas padronizadas
 */

// ============================================
// TIPOS GENÉRICOS DE API
// ============================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
  details?: Record<string, any>
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ============================================
// PARÂMETROS DE CONSULTA
// ============================================

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams extends PaginationParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams extends SearchParams {
  [key: string]: any
}

// ============================================
// TIPOS DE CONSULTA EXTERNA (APIs)
// ============================================

export interface CnpjConsultaResponse {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  inscricaoEstadual?: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  municipio: string
  uf: string
  telefone?: string
  email?: string
  situacao: string
  dataSituacao: string
  cnae?: string
}

export interface CepConsultaResponse {
  cep: string
  logradouro: string
  complemento?: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  erro?: boolean
}

// ============================================
// TIPOS DE ESTATÍSTICAS
// ============================================

export interface ClienteStats {
  totalClientes: number
  clientesAtivos: number
  clientesNovos: number
  crescimentoMes: number
}

export interface FornecedorStats {
  totalFornecedores: number
  fornecedoresAtivos: number
  fornecedoresNovos: number
  crescimentoMes: number
}

export interface ProdutoStats {
  totalProdutos: number
  produtosAtivos: number
  produtosNovos: number
  valorTotalEstoque: number
}

export interface NfeStats {
  totalNfes: number
  nfesAutorizadas: number
  nfesEmDigitacao: number
  valorTotalMes: number
}

// ============================================
// TIPOS DE FORMULÁRIOS
// ============================================

export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, string>
}

export interface DialogState {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  entityId?: string
}

// ============================================
// TIPOS DE TABELA
// ============================================

export interface TableColumn<T> {
  id: string
  label: string
  accessor: (row: T) => any
  sortable?: boolean
  filterable?: boolean
  width?: string
}

export interface TableState {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters: Record<string, any>
}

// ============================================
// TIPOS DE CERTIFICADO DIGITAL
// ============================================

export interface CertificadoInfo {
  cnpj?: string
  cnpjFormatado?: string
  razaoSocial?: string
  titular?: string
  validFrom: string
  validTo: string
  daysUntilExpiration: number
  expired: boolean
  issuer?: string
  nearExpiration: boolean
}

export interface CertificadoUploadResponse {
  success: boolean
  message: string
  certificado?: CertificadoInfo
}

export interface CertificadoState {
  file: File | null
  password: string
  info: CertificadoInfo | null
  valid: boolean | null
  uploading: boolean
  validating: boolean
}

// ============================================
// TIPOS DE SELEÇÃO (Combobox/Select)
// ============================================

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectGroup {
  label: string
  options: SelectOption[]
}

// ============================================
// TIPOS DE VALIDAÇÃO
// ============================================

export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

