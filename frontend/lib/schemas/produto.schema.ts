import { z } from "zod"

/**
 * Schema de validação do formulário de produto
 */
export const produtoFormSchema = z.object({
  // Dados Básicos
  codigo: z.string().min(1, "Código é obrigatório"),
  codigoBarras: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  descricaoComplementar: z.string().optional(),
  ncmId: z.string().min(1, "NCM é obrigatório"),
  cestId: z.string().optional(),
  cfopId: z.string().optional(),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  unidadeTributavel: z.string().optional(),
  
  // Valores e Estoque
  valorUnitario: z.number().min(0, "Valor deve ser positivo"),
  valorCusto: z.number().min(0, "Valor deve ser positivo").optional(),
  margemLucro: z.number().min(0, "Margem deve ser positiva").optional(),
  estoqueAtual: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMinimo: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMaximo: z.number().min(0, "Estoque deve ser positivo").optional(),
  
  // Tributação
  origem: z.string().min(1, "Origem é obrigatória"),
  // ICMS
  icmsCstId: z.string().optional(),
  icmsCsosnId: z.string().optional(),
  icmsAliquota: z.number().min(0).max(100).optional(),
  icmsReducao: z.number().min(0).max(100).optional(),
  // PIS
  pisCstId: z.string().optional(),
  pisAliquota: z.number().min(0).max(100).optional(),
  // COFINS
  cofinsCstId: z.string().optional(),
  cofinsAliquota: z.number().min(0).max(100).optional(),
  // IPI
  ipiCstId: z.string().optional(),
  ipiAliquota: z.number().min(0).max(100).optional(),
  
  // Outros
  fornecedorId: z.string().optional(),
  ativo: z.boolean().optional().default(true),
}).refine((data) => {
  // Validar que pelo menos um entre icmsCstId ou icmsCsosnId deve estar preenchido
  return data.icmsCstId || data.icmsCsosnId
}, {
  message: "Selecione CST ou CSOSN para ICMS",
  path: ["icmsCstId"],
})

/**
 * Tipo inferido do schema de validação
 */
export type ProdutoFormValues = z.infer<typeof produtoFormSchema>

