/**
 * Barrel Export - Módulo de Produtos
 * Exporta todos os componentes relacionados a produtos
 */

// Componentes principais
export { ProdutoFormDialog } from './produto-form-dialog'
export { ProdutosDataTable } from './produtos-data-table'
export { ProdutosSectionCards } from './produtos-section-cards'

// Seções do formulário
export { ProdutoDadosBasicosSection } from './sections/produto-dados-basicos-section'
export { ProdutoEstoqueSection } from './sections/produto-estoque-section'
export { ProdutoTributacaoSection } from './sections/produto-tributacao-section'
export { ProdutoOutrosSection } from './sections/produto-outros-section'

// Tipos
export type { ProdutoFormValues, ProdutoForm, ProdutoSectionProps } from './types'

