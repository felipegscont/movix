import { UseFormReturn } from "react-hook-form"
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
  ativo: z.boolean().default(true),
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

/**
 * Tipo do formulário React Hook Form
 */
export type ProdutoForm = UseFormReturn<ProdutoFormValues>

/**
 * Props comuns para os componentes de seção
 */
export interface ProdutoSectionProps {
  form: ProdutoForm
}

/**
 * Tipo para seleção de fornecedor
 */
export interface FornecedorSelect {
  id: string
  nome: string
  documento: string
}

/**
 * Tipo para CEST
 */
export interface CEST {
  id: string
  codigo: string
  descricao: string
  ncmId: string
}

/**
 * Opções de origem da mercadoria
 */
export const ORIGEM_OPTIONS = [
  { value: "0", label: "0 - Nacional" },
  { value: "1", label: "1 - Estrangeira - Importação direta" },
  { value: "2", label: "2 - Estrangeira - Adquirida no mercado interno" },
  { value: "3", label: "3 - Nacional com mais de 40% de conteúdo estrangeiro" },
  { value: "4", label: "4 - Nacional produzida através de processos produtivos básicos" },
  { value: "5", label: "5 - Nacional com menos de 40% de conteúdo estrangeiro" },
  { value: "6", label: "6 - Estrangeira - Importação direta sem similar nacional" },
  { value: "7", label: "7 - Estrangeira - Adquirida no mercado interno sem similar nacional" },
  { value: "8", label: "8 - Nacional - Mercadoria ou bem com Conteúdo de Importação superior a 70%" },
] as const

/**
 * Opções de unidade de medida
 */
export const UNIDADE_OPTIONS = [
  { value: "UN", label: "UN - Unidade" },
  { value: "PC", label: "PC - Peça" },
  { value: "KG", label: "KG - Quilograma" },
  { value: "MT", label: "MT - Metro" },
  { value: "LT", label: "LT - Litro" },
  { value: "CX", label: "CX - Caixa" },
  { value: "DZ", label: "DZ - Dúzia" },
  { value: "M2", label: "M2 - Metro Quadrado" },
  { value: "M3", label: "M3 - Metro Cúbico" },
] as const

