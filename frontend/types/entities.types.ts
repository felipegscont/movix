/**
 * Tipos de Entidades do Sistema
 * Tipos centralizados para todas as entidades de negócio
 */

// ============================================
// TIPOS AUXILIARES
// ============================================

export interface Estado {
  id: string
  nome: string
  uf: string
  codigoIbge: string
}

export interface Municipio {
  id: string
  nome: string
  codigoIbge: string
  estadoId: string
  estado?: Estado
}

// ============================================
// CLIENTE
// ============================================

export interface Cliente {
  id: string
  tipo: 'FISICA' | 'JURIDICA'
  documento: string
  nome: string
  nomeFantasia?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  inscricaoSuframa?: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  municipioId: string
  estadoId: string
  telefone?: string
  celular?: string
  email?: string
  indicadorIE?: number
  ativo: boolean
  createdAt: string
  updatedAt: string
  municipio?: Municipio
  estado?: Estado
}

// ============================================
// FORNECEDOR
// ============================================

export interface Fornecedor {
  id: string
  tipo: 'FISICA' | 'JURIDICA'
  documento: string
  nome: string
  nomeFantasia?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  inscricaoSuframa?: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  municipioId: string
  estadoId: string
  telefone?: string
  celular?: string
  email?: string
  indicadorIE?: number
  ativo: boolean
  createdAt: string
  updatedAt: string
  municipio?: Municipio
  estado?: Estado
}

// ============================================
// PRODUTO
// ============================================

export interface Produto {
  id: string
  codigo: string
  codigoBarras?: string
  descricao: string
  descricaoComplementar?: string
  ncmId: string
  cestId?: string
  cfopId?: string
  unidade: string
  unidadeTributavel?: string
  valorUnitario: number
  valorUnitarioTributavel?: number
  estoqueAtual: number
  estoqueMinimo?: number
  estoqueMaximo?: number
  icmsCstId?: string
  icmsCsosnId?: string
  icmsAliquota?: number
  icmsReducaoBC?: number
  ipiCstId?: string
  ipiAliquota?: number
  pisCstId?: string
  pisAliquota?: number
  cofinsCstId?: string
  cofinsAliquota?: number
  fornecedorId?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
  ncm?: {
    id: string
    codigo: string
    descricao: string
  }
  cest?: {
    id: string
    codigo: string
    descricao: string
  }
  cfop?: {
    id: string
    codigo: string
    descricao: string
  }
  fornecedor?: Fornecedor
}

// ============================================
// EMITENTE
// ============================================

export interface Emitente {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  cnae?: string
  regimeTributario: number
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  municipioId: string
  estadoId: string
  telefone?: string
  email?: string
  site?: string
  ambienteNfe: number
  serieNfe: number
  proximoNumeroNfe: number
  ativo: boolean
  createdAt: string
  updatedAt: string
  municipio?: Municipio
  estado?: Estado
}

// ============================================
// NATUREZA DE OPERAÇÃO
// ============================================

export interface CFOP {
  id: string
  codigo: string
  descricao: string
  tipo?: 'ENTRADA' | 'SAIDA'
}

export interface NaturezaOperacaoCFOP {
  id: string
  naturezaOperacaoId: string
  cfopId: string
  padrao: boolean
  cfop: CFOP
  createdAt: string
  updatedAt: string
}

export interface ProdutoExcecao {
  cfopId: string
  descricaoCfop: string
  produtoId: string
  descricaoProduto: string
  padrao: boolean
}

export interface NaturezaOperacao {
  id: string
  codigo: string
  nome: string
  tipo: number // 0=Entrada, 1=Saída
  ativa: boolean
  dentroEstado: boolean
  propria: boolean
  produtosExcecao?: ProdutoExcecao[]
  informacoesAdicionais?: string
  createdAt: string
  updatedAt: string
  cfops?: NaturezaOperacaoCFOP[]
}

// ============================================
// MATRIZ FISCAL
// ============================================

export interface MatrizFiscal {
  id: string
  codigo: string
  descricao: string
  seAplicaA?: string
  modeloNF?: string
  regimeTributario?: number
  dataInicio?: string
  dataFim?: string
  ufDestino?: string
  produtoId?: string
  cfopId?: string
  tipoItem?: string
  ncmId?: string
  cstId?: string
  csosnId?: string
  aliquota?: number
  reducaoBC?: number
  fcp?: number
  prioridade: number
  ativo: boolean
  createdAt: string
  updatedAt: string
}

// ============================================
// NFE (Nota Fiscal Eletrônica)
// ============================================

export interface NfeItem {
  id: string
  nfeId: string
  numeroItem: number
  produtoId: string
  codigo: string
  descricao: string
  ncm: string
  cfop: string
  unidade: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  valorDesconto?: number
  valorFrete?: number
  valorSeguro?: number
  valorOutros?: number
  // Impostos
  icmsCst?: string
  icmsCsosn?: string
  icmsAliquota?: number
  icmsValor?: number
  ipiCst?: string
  ipiAliquota?: number
  ipiValor?: number
  pisCst?: string
  pisAliquota?: number
  pisValor?: number
  cofinsCst?: string
  cofinsAliquota?: number
  cofinsValor?: number
  produto?: Produto
}

export type NfeStatus = 'DIGITACAO' | 'VALIDADA' | 'TRANSMITIDA' | 'AUTORIZADA' | 'CANCELADA' | 'REJEITADA'

export interface Nfe {
  id: string
  numero?: number
  serie: number
  chaveAcesso?: string
  status: NfeStatus
  emitenteId: string
  clienteId: string
  naturezaOperacao: string
  naturezaOperacaoId?: string
  tipoOperacao: number
  finalidade: number
  consumidorFinal: number
  presencaComprador: number
  dataEmissao: string
  dataSaida?: string
  modalidadeFrete: number
  valorProdutos: number
  valorFrete: number
  valorSeguro: number
  valorDesconto: number
  valorOutros: number
  valorTotal: number
  valorTotalTributos?: number
  informacoesAdicionais?: string
  informacoesFisco?: string
  protocoloAutorizacao?: string
  dataAutorizacao?: string
  motivoRejeicao?: string
  createdAt: string
  updatedAt: string
  emitente?: Emitente
  cliente?: Cliente
  itens?: NfeItem[]
}

