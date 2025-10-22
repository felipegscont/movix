import * as z from "zod"

// Schema de validação do emitente
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
  ambienteNfe: z.number().min(1).max(2),
  serieNfe: z.number().min(1).max(999),
  proximoNumeroNfe: z.number().min(1),
  ativo: z.boolean().default(true),
})

export type EmitenteFormData = z.infer<typeof emitenteSchema>

// Tipos para certificado
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

export interface CertificadoState {
  file: File | null
  password: string
  info: CertificadoInfo | null
  valid: boolean | null
  uploading: boolean
  validating: boolean
}

// Tipos para estados e municípios
export interface Estado {
  id: string
  codigo: string
  uf: string
  nome: string
  regiao: string
  ativo: boolean
}

export interface Municipio {
  id: string
  codigo: string
  nome: string
  estadoId: string
  ativo: boolean
}

