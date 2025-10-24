/**
 * Utilitários para manipulação de texto
 */

/**
 * Trunca um texto se ele exceder o limite de caracteres
 * @param text - Texto a ser truncado
 * @param maxLength - Número máximo de caracteres
 * @param suffix - Sufixo a ser adicionado quando truncado (padrão: "...")
 * @returns Texto truncado ou original se não exceder o limite
 */
export function truncateText(text: string, maxLength: number, suffix: string = "..."): string {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * Trunca descrição de CFOP para exibição em tabelas
 * @param descricao - Descrição do CFOP
 * @returns Descrição truncada se necessário
 */
export function truncateCFOPDescription(descricao: string): string {
  return truncateText(descricao, 80)
}

/**
 * Trunca descrição de produto para exibição em listas
 * @param descricao - Descrição do produto
 * @returns Descrição truncada se necessário
 */
export function truncateProductDescription(descricao: string): string {
  return truncateText(descricao, 60)
}

/**
 * Trunca texto para exibição em combobox
 * @param text - Texto a ser truncado
 * @returns Texto truncado se necessário
 */
export function truncateComboboxText(text: string): string {
  return truncateText(text, 40)
}
