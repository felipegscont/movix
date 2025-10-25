/**
 * Barrel Export - Módulo de Emitente
 * Exporta todos os componentes relacionados a emitente
 */

// Componentes principais
export { EmitenteForm } from './emitente-form'
export { EmitentesDataTable } from './emitentes-data-table'

// Seções do formulário
export { DadosBasicosSection } from './sections/dados-basicos-section'
export { EnderecoSection } from './sections/endereco-section'
export { ContatoSection } from './sections/contato-section'
export { NfeSection } from './sections/nfe-section'
export { CertificadoSection } from './sections/certificado-section'

// Tipos e Schemas (re-export para conveniência)
export { emitenteSchema, type EmitenteFormData } from '@/lib/schemas/emitente.schema'
export type { CertificadoInfo, CertificadoState } from '@/types'

