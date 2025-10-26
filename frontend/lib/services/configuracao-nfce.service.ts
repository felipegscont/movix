const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface ConfiguracaoNfceData {
  ambienteAtivo?: number
  serieProducao?: number
  proximoNumeroProducao?: number
  tipoFreteProducao?: number
  indicadorPresencaProducao?: number
  orientacaoImpressaoProducao?: number
  ieSubstitutoProducao?: string
  observacoesProducao?: string
  documentosAutorizadosProducao?: string
  serieHomologacao?: number
  proximoNumeroHomologacao?: number
  tipoFreteHomologacao?: number
  indicadorPresencaHomologacao?: number
  orientacaoImpressaoHomologacao?: number
  ieSubstitutoHomologacao?: string
  observacoesHomologacao?: string
  documentosAutorizadosHomologacao?: string
  modeloNfce?: string
}

export interface ConfiguracaoNfce extends ConfiguracaoNfceData {
  id: string
  emitenteId: string
  modeloNfce: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class ConfiguracaoNfceService {
  /**
   * Buscar configuração de NFC-e por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfce; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfce/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Configuração não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar configuração de NFC-e',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('Erro ao buscar configuração de NFC-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao buscar configuração de NFC-e',
      }
    }
  }

  /**
   * Criar ou atualizar configuração de NFC-e
   */
  static async upsert(emitenteId: string, data: ConfiguracaoNfceData): Promise<{ success: boolean; data?: ConfiguracaoNfce; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfce/${emitenteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao salvar configuração de NFC-e',
        }
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error: any) {
      console.error('Erro ao salvar configuração de NFC-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao salvar configuração de NFC-e',
      }
    }
  }

  /**
   * Incrementar próximo número
   */
  static async incrementarNumero(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfce; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfce/${emitenteId}/incrementar`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao incrementar número',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('Erro ao incrementar número:', error)
      return {
        success: false,
        error: error.message || 'Erro ao incrementar número',
      }
    }
  }

  /**
   * Deletar configuração
   */
  static async delete(emitenteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfce/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao deletar configuração de NFC-e',
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao deletar configuração de NFC-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao deletar configuração de NFC-e',
      }
    }
  }
}

