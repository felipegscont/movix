import { z } from "zod"

// Schema para item do orçamento
export const orcamentoItemFormSchema = z.object({
  numeroItem: z.number().int().min(1),
  produtoId: z.string().min(1, "Produto é obrigatório"),
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  quantidade: z.coerce.number().min(0.0001, "Quantidade deve ser maior que zero"),
  valorUnitario: z.coerce.number().min(0, "Valor unitário deve ser positivo"),
  valorDesconto: z.coerce.number().min(0, "Desconto deve ser positivo").optional().or(z.literal('')),
  valorTotal: z.coerce.number().min(0, "Valor total deve ser positivo"),
  observacoes: z.string().optional().or(z.literal('')).nullable(),
})

export type OrcamentoItemFormData = z.infer<typeof orcamentoItemFormSchema>

// Schema para o orçamento completo
export const orcamentoFormSchema = z.object({
  numero: z.coerce.number().int().min(1, "Número é obrigatório"),
  dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
  dataValidade: z.string().min(1, "Data de validade é obrigatória"),
  status: z.enum(['EM_ABERTO', 'APROVADO', 'CANCELADO']).default('EM_ABERTO'),
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  vendedorNome: z.string().optional().or(z.literal('')).nullable(),
  
  // Valores
  subtotal: z.coerce.number().min(0, "Subtotal deve ser positivo"),
  valorDesconto: z.coerce.number().min(0, "Desconto deve ser positivo").optional().or(z.literal('')),
  valorFrete: z.coerce.number().min(0, "Frete deve ser positivo").optional().or(z.literal('')),
  valorOutros: z.coerce.number().min(0, "Outros valores devem ser positivos").optional().or(z.literal('')),
  valorTotal: z.coerce.number().min(0, "Valor total deve ser positivo"),
  
  observacoes: z.string().optional().or(z.literal('')).nullable(),
  
  // Itens
  itens: z.array(orcamentoItemFormSchema).min(1, "Adicione pelo menos um item"),
})

export type OrcamentoFormData = z.infer<typeof orcamentoFormSchema>

// Schema para validação de conversão
export const converterOrcamentoSchema = z.object({
  orcamentoId: z.string().min(1, "ID do orçamento é obrigatório"),
})

export type ConverterOrcamentoData = z.infer<typeof converterOrcamentoSchema>

