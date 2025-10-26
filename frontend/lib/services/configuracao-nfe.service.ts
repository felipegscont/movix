import { api } from './api'

export interface ConfiguracaoNfeData {
  ambiente?: number
  serie?: number
  proximoNumero?: number
  tipoFrete?: number
  indicadorPresenca?: number
  orientacaoImpressao?: number
  ieSubstitutoTributario?: string
  observacoesPadrao?: string
  documentosAutorizados?: string
}

export interface ConfiguracaoNfe extends ConfiguracaoNfeData {
  id: string
  emitenteId: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class ConfiguracaoNfeService {
  /**
   * Buscar configuração de NFe por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfe; error?: string }> {
    try {
      const response = await api.get(`/configuracoes-nfe/${emitenteId}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar configuração de NFe:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar configuração de NFe',
      }
    }
  }

  /**
   * Criar ou atualizar configuração de NFe
   */
  static async upsert(emitenteId: string, data: ConfiguracaoNfeData): Promise<{ success: boolean; data?: ConfiguracaoNfe; error?: string }> {
    try {
      const response = await api.post(`/configuracoes-nfe/${emitenteId}`, data)
      return response.data
    } catch (error: any) {
      console.error('Erro ao salvar configuração de NFe:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao salvar configuração de NFe',
      }
    }
  }

  /**
   * Incrementar próximo número
   */
  static async incrementarNumero(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfe; error?: string }> {
    try {
      const response = await api.post(`/configuracoes-nfe/${emitenteId}/incrementar`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao incrementar número:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao incrementar número',
      }
    }
  }

  /**
   * Deletar configuração
   */
  static async delete(emitenteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.delete(`/configuracoes-nfe/${emitenteId}`)
      return response.data
    } catch (error: any) {
      console.error('Erro ao deletar configuração de NFe:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao deletar configuração de NFe',
      }
    }
  }
}

