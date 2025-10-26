const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface ConfiguracaoNfseData {
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
  modeloNfse?: string
}

export interface ConfiguracaoNfse extends ConfiguracaoNfseData {
  id: string
  emitenteId: string
  modeloNfse: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class ConfiguracaoNfseService {
  /**
   * Buscar configuração de NFS-e por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfse; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfse/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Configuração não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar configuração de NFS-e',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('Erro ao buscar configuração de NFS-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao buscar configuração de NFS-e',
      }
    }
  }

  /**
   * Criar ou atualizar configuração de NFS-e
   */
  static async upsert(emitenteId: string, data: ConfiguracaoNfseData): Promise<{ success: boolean; data?: ConfiguracaoNfse; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfse/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar configuração de NFS-e',
        }
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error: any) {
      console.error('Erro ao salvar configuração de NFS-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao salvar configuração de NFS-e',
      }
    }
  }

  /**
   * Incrementar próximo número
   */
  static async incrementarNumero(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfse; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfse/${emitenteId}/incrementar`, {
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
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfse/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao deletar configuração de NFS-e',
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao deletar configuração de NFS-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao deletar configuração de NFS-e',
      }
    }
  }
}

