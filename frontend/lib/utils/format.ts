/**
 * Utilitários para formatação de dados
 */

/**
 * Formata CPF ou CNPJ baseado no tamanho
 * @param documento - CPF (11 dígitos) ou CNPJ (14 dígitos)
 * @returns Documento formatado
 */
export function formatCPFCNPJ(documento: string): string {
  if (!documento) return ''
  
  const numbers = documento.replace(/\D/g, '')
  
  if (numbers.length === 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  } else if (numbers.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }
  
  return documento
}

/**
 * Formata CEP
 * @param cep - CEP com 8 dígitos
 * @returns CEP formatado (00000-000)
 */
export function formatCEP(cep: string): string {
  if (!cep) return ''
  
  const numbers = cep.replace(/\D/g, '')
  return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

/**
 * Formata telefone (fixo ou celular)
 * @param telefone - Telefone com 10 ou 11 dígitos
 * @returns Telefone formatado
 */
export function formatTelefone(telefone: string): string {
  if (!telefone) return ''
  
  const numbers = telefone.replace(/\D/g, '')
  
  if (numbers.length === 10) {
    // Fixo: (00) 0000-0000
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  } else if (numbers.length === 11) {
    // Celular: (00) 00000-0000
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  
  return telefone
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 * @param date - Data em formato ISO ou Date
 * @returns Data formatada
 */
export function formatDate(date: string | Date): string {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

/**
 * Formata data e hora para exibição (DD/MM/YYYY HH:mm)
 * @param date - Data em formato ISO ou Date
 * @returns Data e hora formatadas
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formata valor monetário
 * @param value - Valor numérico
 * @returns Valor formatado em R$
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return 'R$ 0,00'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}

/**
 * Formata número com casas decimais
 * @param value - Valor numérico
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Número formatado
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return '0,00'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue)
}

