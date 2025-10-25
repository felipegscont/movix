import { z } from "zod"

/**
 * Schema de validação do formulário de produto
 * Tributação será definida pela Matriz Fiscal (Natureza de Operação + Tipo de Item)
 */
export const produtoFormSchema = z.object({
  // Dados Básicos
  codigo: z.string().min(1, "Código é obrigatório"),
  codigoBarras: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  descricaoComplementar: z.string().optional(),

  // Classificação Fiscal
  ncmId: z.string().min(1, "NCM é obrigatório"),
  cestId: z.string().optional(),
  origem: z.string().min(1, "Origem da mercadoria é obrigatória"),
  tipoItem: z.string().min(1, "Tipo de item é obrigatório"),

  // Unidades
  unidade: z.string().min(1, "Unidade é obrigatória"),
  unidadeTributavel: z.string().optional(),

  // Valores e Estoque
  valorUnitario: z.number().min(0, "Valor deve ser positivo"),
  valorCusto: z.number().min(0, "Valor deve ser positivo").optional(),
  margemLucro: z.number().min(0, "Margem deve ser positiva").optional(),
  estoqueAtual: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMinimo: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMaximo: z.number().min(0, "Estoque deve ser positivo").optional(),

  // Outros
  fornecedorId: z.string().optional(),
  ativo: z.boolean().default(true),
})

/**
 * Tipo inferido do schema de validação
 */
export type ProdutoFormValues = z.infer<typeof produtoFormSchema>

