import { z } from "zod"

// Schema para item do pedido
export const pedidoItemFormSchema = z.object({
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

export type PedidoItemFormData = z.infer<typeof pedidoItemFormSchema>

// Alias para compatibilidade
export const itemFormSchema = pedidoItemFormSchema
export type ItemFormData = PedidoItemFormData

// Schema para pagamento do pedido
export const pedidoPagamentoFormSchema = z.object({
  parcela: z.number().int().min(1),
  formaPagamentoId: z.string().min(1, "Forma de pagamento é obrigatória"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  observacoes: z.string().optional().or(z.literal('')).nullable(),
})

export type PedidoPagamentoFormData = z.infer<typeof pedidoPagamentoFormSchema>

// Schema para o pedido completo
export const pedidoFormSchema = z.object({
  numero: z.coerce.number().int().min(1, "Número é obrigatório"),
  dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
  dataEntrega: z.string().optional().or(z.literal('')).nullable(),
  horaEntrega: z.string().optional().or(z.literal('')).nullable(),
  usarHoraEntrega: z.boolean().default(false),
  status: z.enum(['ABERTO', 'FATURADO', 'CANCELADO']).default('ABERTO'),
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  vendedorNome: z.string().optional().or(z.literal('')).nullable(),
  enderecoEntrega: z.string().optional().or(z.literal('')).nullable(),

  // Valores
  subtotal: z.coerce.number().min(0, "Subtotal deve ser positivo"),
  valorDesconto: z.coerce.number().min(0, "Desconto deve ser positivo").optional().or(z.literal('')),
  valorFrete: z.coerce.number().min(0, "Frete deve ser positivo").optional().or(z.literal('')),
  valorOutros: z.coerce.number().min(0, "Outros valores devem ser positivos").optional().or(z.literal('')),
  valorTotal: z.coerce.number().min(0, "Valor total deve ser positivo"),

  observacoes: z.string().optional().or(z.literal('')).nullable(),

  // Itens
  itens: z.array(pedidoItemFormSchema).min(1, "Adicione pelo menos um item"),

  // Pagamentos (opcional)
  pagamentos: z.array(pedidoPagamentoFormSchema).optional(),
})

export type PedidoFormData = z.infer<typeof pedidoFormSchema>

// Schema para gerar NFe a partir do pedido
export const gerarNFeSchema = z.object({
  pedidoId: z.string().min(1, "ID do pedido é obrigatório"),
  naturezaOperacaoId: z.string().min(1, "Natureza de operação é obrigatória"),
})

export type GerarNFeData = z.infer<typeof gerarNFeSchema>

