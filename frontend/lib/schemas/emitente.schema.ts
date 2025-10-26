import * as z from "zod"

/**
 * Schema de validação do Emitente
 * Usado para validação de formulários de emitente
 *
 * NOTA: Os campos de configuração de NFe (ambienteNfe, serieNfe, proximoNumeroNfe)
 * foram migrados para a tabela ConfiguracaoNfe e são configurados em /configuracoes/fiscal/nfe
 */
export const emitenteSchema = z.object({
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(14),
  razaoSocial: z.string().min(3, "Razão social é obrigatória"),
  nomeFantasia: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  cnae: z.string().optional(),
  regimeTributario: z.number().min(1).max(3),
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(8),
  municipioId: z.string().min(1, "Município é obrigatório"),
  estadoId: z.string().min(1, "Estado é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  site: z.string().optional(),
  ativo: z.boolean().optional(),
})

export type EmitenteFormData = z.infer<typeof emitenteSchema>

