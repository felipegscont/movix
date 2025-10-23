/**
 * Interface para dados de NCM
 * Usada exclusivamente para carregar da tabela oficial do Siscomex
 * Apenas NCMs completos de 8 dígitos
 */

export interface NCMData {
  codigo: string;      // 8 dígitos (ex: 85011010)
  descricao: string;   // Descrição oficial (sem tags HTML)
  unidade?: string;    // Unidade de medida (opcional)
}

