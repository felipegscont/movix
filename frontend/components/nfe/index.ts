/**
 * Barrel Export - Módulo de NFe
 * Exporta todos os componentes relacionados a Notas Fiscais Eletrônicas
 */

// Componentes principais
export { NfeWizard } from './nfe-wizard'
export { NfeWizardBreadcrumb } from './nfe-wizard-breadcrumb'
export { NfeDataTable } from './nfe-data-table'
export { NfeSectionCards } from './nfe-section-cards'
export { NfeDetails } from './nfe-details'
export { NfeStatusBadge } from './nfe-status-badge'
export { NfeBreadcrumb } from './nfe-breadcrumb'
export { NfeAddItemQuick } from './nfe-add-item-quick'
export { NfeEditItemDialog } from './nfe-edit-item-dialog'

// Steps do Wizard
export { NfeStepGeral } from './steps/nfe-step-geral'
export { NfeStepItens } from './steps/nfe-step-itens'
export { NfeStepCobranca } from './steps/nfe-step-cobranca'
export { NfeStepRevisao } from './steps/nfe-step-revisao'

// Tipos
export type { NfeStatus, NfeStatusInfo } from './types'

