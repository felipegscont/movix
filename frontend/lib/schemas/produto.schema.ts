import { z } from "zod"

/**
 * Schema de validação do formulário de produto
 * Tributação será definida pela Matriz Fiscal (Natureza de Operação + Tipo de Item)
 */
export const produtoFormSchema = z.object({
  // Dados Básicos
  codigo: z.string().min(1, "Código é obrigatório"),
  codigoBarras: z.string().optional().or(z.literal('')).nullable(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  descricaoComplementar: z.string().optional().or(z.literal('')).nullable(),

  // Classificação Fiscal
  ncmId: z.string().min(1, "NCM é obrigatório"),
  cestId: z.string().optional().or(z.literal('')).nullable(),
  origem: z.string().min(1, "Origem da mercadoria é obrigatória"),
  tipoItem: z.string().min(1, "Tipo de item é obrigatório"),

  // Unidades
  unidade: z.string().min(1, "Unidade é obrigatória"),
  unidadeTributavel: z.string().optional().or(z.literal('')).nullable(),

  // Valores e Estoque (coerce converte string para number automaticamente)
  valorUnitario: z.coerce.number().min(0, "Valor deve ser positivo"),
  valorCusto: z.coerce.number().min(0, "Valor deve ser positivo").optional().or(z.literal('')),
  margemLucro: z.coerce.number().min(0, "Margem deve ser positiva").optional().or(z.literal('')),
  estoqueAtual: z.coerce.number().min(0, "Estoque deve ser positivo").optional().or(z.literal('')),
  estoqueMinimo: z.coerce.number().min(0, "Estoque deve ser positivo").optional().or(z.literal('')),
  estoqueMaximo: z.coerce.number().min(0, "Estoque deve ser positivo").optional().or(z.literal('')),

  // Outros
  fornecedorId: z.string().optional().or(z.literal('')).nullable(),
  ativo: z.boolean().default(true),
})

/**
 * Tipo inferido do schema de validação
 */
export type ProdutoFormValues = z.infer<typeof produtoFormSchema>

