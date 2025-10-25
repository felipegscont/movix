/**
 * Barrel Export - Módulo de Emitente
 * Exporta todos os componentes relacionados a emitente
 */

// Componentes principais
export { EmitenteForm } from './emitente-form'
export { EmitenteFormRefactored } from './emitente-form-refactored'
export { EmitentesDataTable } from './emitentes-data-table'

// Seções do formulário
export { DadosBasicosSection } from './sections/dados-basicos-section'
export { EnderecoSection } from './sections/endereco-section'
export { ContatoSection } from './sections/contato-section'
export { NfeSection } from './sections/nfe-section'
export { CertificadoSection } from './sections/certificado-section'

// Tipos
export type { EmitenteFormData, CertificadoInfo, CertificadoState } from './types'

