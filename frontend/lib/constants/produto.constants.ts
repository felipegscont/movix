/**
 * Constantes relacionadas a Produtos
 */

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

