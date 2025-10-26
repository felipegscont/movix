const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface ConfiguracaoMdfeData {
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
  modeloMdfe?: string
}

export interface ConfiguracaoMdfe extends ConfiguracaoMdfeData {
  id: string
  emitenteId: string
  modeloMdfe: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class ConfiguracaoMdfeService {
  /**
   * Buscar configuração de MDF-e por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoMdfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-mdfe/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Configuração não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar configuração de MDF-e',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('Erro ao buscar configuração de MDF-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao buscar configuração de MDF-e',
      }
    }
  }

  /**
   * Criar ou atualizar configuração de MDF-e
   */
  static async upsert(emitenteId: string, data: ConfiguracaoMdfeData): Promise<{ success: boolean; data?: ConfiguracaoMdfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-mdfe/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar configuração de MDF-e',
        }
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error: any) {
      console.error('Erro ao salvar configuração de MDF-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao salvar configuração de MDF-e',
      }
    }
  }

  /**
   * Incrementar próximo número
   */
  static async incrementarNumero(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoMdfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-mdfe/${emitenteId}/incrementar`, {
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
      const response = await fetch(`${API_BASE_URL}/configuracoes-mdfe/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao deletar configuração de MDF-e',
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao deletar configuração de MDF-e:', error)
      return {
        success: false,
        error: error.message || 'Erro ao deletar configuração de MDF-e',
      }
    }
  }
}

