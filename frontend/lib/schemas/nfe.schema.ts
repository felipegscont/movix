import * as z from "zod"

// ================================
// SCHEMAS DE IMPOSTOS
// ================================

// Schema para ICMS
export const nfeItemICMSSchema = z.object({
  origem: z.string().optional().nullable(),
  cstId: z.string().optional().nullable(),
  csosnId: z.string().optional().nullable(),
  modalidadeBC: z.string().optional().nullable(),
  baseCalculo: z.coerce.number().min(0).default(0),
  aliquota: z.coerce.number().min(0).max(100).default(0),
  valor: z.coerce.number().min(0).default(0),
  percentualReducaoBC: z.coerce.number().min(0).max(100).optional().nullable(),

  // ICMS ST
  modalidadeBCST: z.string().optional().nullable(),
  percentualMVAST: z.coerce.number().min(0).optional().nullable(),
  percentualReducaoBCST: z.coerce.number().min(0).max(100).optional().nullable(),
  baseCalculoST: z.coerce.number().min(0).optional().nullable(),
  aliquotaST: z.coerce.number().min(0).max(100).optional().nullable(),
  valorST: z.coerce.number().min(0).optional().nullable(),

  // Desoneração
  valorDesonerado: z.coerce.number().min(0).optional().nullable(),
  motivoDesoneracao: z.string().optional().nullable(),

  // Diferimento
  percentualDiferimento: z.coerce.number().min(0).max(100).optional().nullable(),
  valorDiferido: z.coerce.number().min(0).optional().nullable(),
  valorICMSOperacao: z.coerce.number().min(0).optional().nullable(),

  // FCP (Fundo de Combate à Pobreza)
  valorFCP: z.coerce.number().min(0).optional().nullable(),
  valorFCPST: z.coerce.number().min(0).optional().nullable(),
  valorFCPSTRetido: z.coerce.number().min(0).optional().nullable(),
})

// Schema para IPI (opcional - só valida se fornecido)
export const nfeItemIPISchema = z.object({
  cstId: z.string().optional().nullable(),
  baseCalculo: z.coerce.number().min(0).default(0),
  aliquota: z.coerce.number().min(0).max(100).default(0),
  valor: z.coerce.number().min(0).default(0),
  classeEnquadramento: z.string().optional().nullable(),
  cnpjProdutor: z.string().optional().nullable(),
  codigoSeloControle: z.string().optional().nullable(),
  quantidadeSeloControle: z.coerce.number().int().optional().nullable(),
})

// Schema para PIS (opcional - será validado na emissão)
export const nfeItemPISSchema = z.object({
  cstId: z.string().optional().nullable(),
  baseCalculo: z.coerce.number().min(0).default(0),
  aliquota: z.coerce.number().min(0).max(100).default(0),
  valor: z.coerce.number().min(0).default(0),
  quantidadeVendida: z.coerce.number().min(0).optional().nullable(),
  aliquotaReais: z.coerce.number().min(0).optional().nullable(),
})

// Schema para COFINS (opcional - será validado na emissão)
export const nfeItemCOFINSSchema = z.object({
  cstId: z.string().optional().nullable(),
  baseCalculo: z.coerce.number().min(0).default(0),
  aliquota: z.coerce.number().min(0).max(100).default(0),
  valor: z.coerce.number().min(0).default(0),
  quantidadeVendida: z.coerce.number().min(0).optional().nullable(),
  aliquotaReais: z.coerce.number().min(0).optional().nullable(),
})

// ================================
// SCHEMA DE ITEM DA NFE
// ================================

export const nfeItemSchema = z.object({
  // Produto
  produtoId: z.string().min(1, "Produto é obrigatório"),
  codigo: z.string().min(1, "Código é obrigatório"),
  codigoBarras: z.string().optional().nullable(),
  descricao: z.string().min(1, "Descrição é obrigatória"),

  // Classificação Fiscal
  ncmId: z.string().min(1, "NCM é obrigatório"),
  cfopId: z.string().optional().nullable(), // Será definido na emissão

  // Matriz Fiscal Aplicada (rastreabilidade)
  matrizFiscalId: z.string().optional().nullable(),

  // Unidades e Quantidades Comerciais
  unidadeComercial: z.string().min(1, "Unidade comercial é obrigatória"),
  quantidadeComercial: z.coerce.number().min(0.0001, "Quantidade deve ser maior que zero"),
  valorUnitario: z.coerce.number().min(0.01, "Valor unitário deve ser maior que zero"),
  valorTotal: z.coerce.number().min(0),

  // Unidades e Quantidades Tributáveis
  unidadeTributavel: z.string().optional().nullable(),
  quantidadeTributavel: z.coerce.number().min(0).optional().nullable(),
  valorUnitarioTrib: z.coerce.number().min(0).optional().nullable(),

  // Valores Adicionais
  valorFrete: z.coerce.number().min(0).default(0),
  valorSeguro: z.coerce.number().min(0).default(0),
  valorDesconto: z.coerce.number().min(0).default(0),
  valorOutros: z.coerce.number().min(0).default(0),

  // Tributação
  origem: z.string().min(1, "Origem é obrigatória"),
  incluiTotal: z.boolean().default(true),

  // Informações Adicionais
  informacoesAdicionais: z.string().optional().nullable(),
  
  // Impostos
  icms: nfeItemICMSSchema.optional(),
  ipi: nfeItemIPISchema.optional(),
  pis: nfeItemPISSchema,
  cofins: nfeItemCOFINSSchema,
})

// ================================
// SCHEMAS DE COBRANÇA E PAGAMENTO
// ================================

export const nfeCobrancaSchema = z.object({
  numeroFatura: z.string().optional().nullable(),
  valorOriginal: z.coerce.number().min(0),
  valorDesconto: z.coerce.number().min(0).default(0),
  valorLiquido: z.coerce.number().min(0),
})

export const nfeDuplicataSchema = z.object({
  numero: z.string().min(1, "Número da duplicata é obrigatório"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
})

export const nfePagamentoSchema = z.object({
  indicadorPagamento: z.coerce.number().int().min(0).max(1).default(0), // 0=À vista, 1=A prazo
  formaPagamentoId: z.string().min(1, "Forma de pagamento é obrigatória"),
  descricaoPagamento: z.string().optional().nullable(),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  dataPagamento: z.string().optional().nullable(),

  // Dados de Cartão (se aplicável)
  tipoIntegracao: z.coerce.number().int().optional().nullable(), // 1=Integrado, 2=Não integrado
  cnpjCredenciadora: z.string().optional().nullable(),
  bandeira: z.string().optional().nullable(),
  numeroAutorizacao: z.string().optional().nullable(),
})

// ================================
// SCHEMA PRINCIPAL DA NFE
// ================================

export const nfeFormSchema = z.object({
  // Identificação
  emitenteId: z.string().optional().nullable(), // Será preenchido automaticamente no backend
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  serie: z.coerce.number().int().min(1).default(1),

  // Natureza da Operação (pode ser ID da natureza cadastrada ou texto livre)
  naturezaOperacao: z.string().min(3, "Natureza da operação é obrigatória (mínimo 3 caracteres)"),
  naturezaOperacaoId: z.string().optional().nullable(), // ID da natureza selecionada (se houver)

  // Tipo de Operação
  tipoOperacao: z.coerce.number().int().min(0).max(1).default(1), // 0=Entrada, 1=Saída
  finalidade: z.coerce.number().int().min(0).max(4).default(0), // 0=Normal, 1=Complementar, 2=Ajuste, 3=Devolução, 4=Devolução de mercadoria
  consumidorFinal: z.coerce.number().int().min(0).max(1).default(1), // 0=Não, 1=Sim
  presencaComprador: z.coerce.number().int().min(0).max(9).default(1), // 0=Não se aplica, 1=Presencial, etc

  // Datas
  dataEmissao: z.string().optional().nullable(),
  dataSaida: z.string().optional().nullable(),

  // Frete
  modalidadeFrete: z.coerce.number().int().min(0).max(9).default(9), // 0=Por conta do emitente, 1=Por conta do destinatário, 9=Sem frete

  // Valores Totais
  valorFrete: z.coerce.number().min(0).default(0),
  valorSeguro: z.coerce.number().min(0).default(0),
  valorDesconto: z.coerce.number().min(0).default(0),
  valorOutros: z.coerce.number().min(0).default(0),
  valorICMSDesonerado: z.coerce.number().min(0).default(0),
  valorFCP: z.coerce.number().min(0).default(0),
  valorII: z.coerce.number().min(0).default(0),
  valorOutrasDespesas: z.coerce.number().min(0).default(0),

  // Informações Adicionais
  informacoesAdicionais: z.string().optional().nullable(),
  informacoesFisco: z.string().optional().nullable(),
  
  // Itens
  itens: z.array(nfeItemSchema).min(1, "Adicione pelo menos um item"),
  
  // Cobrança
  cobranca: nfeCobrancaSchema.optional(),
  duplicatas: z.array(nfeDuplicataSchema).optional(),
  pagamentos: z.array(nfePagamentoSchema).optional(),
})

// Tipos TypeScript derivados dos schemas
export type NfeFormData = z.infer<typeof nfeFormSchema>
export type NfeItemFormData = z.infer<typeof nfeItemSchema>
export type NfeItemICMSFormData = z.infer<typeof nfeItemICMSSchema>
export type NfeItemIPIFormData = z.infer<typeof nfeItemIPISchema>
export type NfeItemPISFormData = z.infer<typeof nfeItemPISSchema>
export type NfeItemCOFINSFormData = z.infer<typeof nfeItemCOFINSSchema>
export type NfeCobrancaFormData = z.infer<typeof nfeCobrancaSchema>
export type NfeDuplicataFormData = z.infer<typeof nfeDuplicataSchema>
export type NfePagamentoFormData = z.infer<typeof nfePagamentoSchema>

// Valores padrão para novo item
export const defaultNfeItem: Partial<NfeItemFormData> = {
  quantidadeComercial: 1,
  valorUnitario: 0,
  valorTotal: 0,
  valorFrete: 0,
  valorSeguro: 0,
  valorDesconto: 0,
  valorOutros: 0,
  origem: "0", // 0=Nacional
  incluiTotal: true,
  pis: {
    cstId: "",
    baseCalculo: 0,
    aliquota: 0,
    valor: 0,
  },
  cofins: {
    cstId: "",
    baseCalculo: 0,
    aliquota: 0,
    valor: 0,
  },
}

// Valores padrão para nova NFe
export const defaultNfeFormData: Partial<NfeFormData> = {
  serie: 1,
  tipoOperacao: 1,
  finalidade: 0,
  consumidorFinal: 1,
  presencaComprador: 1,
  modalidadeFrete: 9,
  valorFrete: 0,
  valorSeguro: 0,
  valorDesconto: 0,
  valorOutros: 0,
  valorICMSDesonerado: 0,
  valorFCP: 0,
  valorII: 0,
  valorOutrasDespesas: 0,
  itens: [],
  duplicatas: [],
  pagamentos: [],
}

