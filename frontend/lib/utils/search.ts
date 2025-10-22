/**
 * Normaliza string removendo acentos e convertendo para minúsculas
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Verifica se o termo de busca está contido no texto
 * Suporta busca por múltiplas palavras
 */
export function searchMatch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true
  
  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)
  
  // Busca por múltiplas palavras (AND)
  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean)
  
  return searchWords.every(word => normalizedText.includes(word))
}

/**
 * Filtra array de objetos por múltiplos campos
 */
export function searchInFields<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  if (!searchTerm) return items
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return searchMatch(value, searchTerm)
      }
      return false
    })
  })
}

/**
 * Destaca o termo de busca no texto
 */
export function highlightMatch(text: string, searchTerm: string): string {
  if (!searchTerm) return text
  
  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)
  
  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean)
  let result = text
  
  searchWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi')
    result = result.replace(regex, '<mark>$1</mark>')
  })
  
  return result
}

