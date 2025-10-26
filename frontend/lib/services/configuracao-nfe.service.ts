const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface ConfiguracaoNfeData {
  ambienteAtivo?: number
  serieProducao?: number
  proximoNumeroProducao?: number
  tipoFreteProducao?: number
  indicadorPresencaProducao?: number
  orientacaoImpressaoProducao?: number
  ieSubstitutoProducao?: string
  observacoesProducao?: string
  documentosAutorizadosProducao?: string
  numeroInicialInutilizarProducao?: number
  numeroFinalInutilizarProducao?: number
  serieInutilizarProducao?: number
  anoInutilizarProducao?: number
  justificativaInutilizarProducao?: string
  serieHomologacao?: number
  proximoNumeroHomologacao?: number
  tipoFreteHomologacao?: number
  indicadorPresencaHomologacao?: number
  orientacaoImpressaoHomologacao?: number
  ieSubstitutoHomologacao?: string
  observacoesHomologacao?: string
  documentosAutorizadosHomologacao?: string
  numeroInicialInutilizarHomologacao?: number
  numeroFinalInutilizarHomologacao?: number
  serieInutilizarHomologacao?: number
  anoInutilizarHomologacao?: number
  justificativaInutilizarHomologacao?: string
  modeloNfe?: string
}

export interface ConfiguracaoNfe extends ConfiguracaoNfeData {
  id: string
  emitenteId: string
  modeloNfe: string
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
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfe/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Configuração não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar configuração de NFe',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('Erro ao buscar configuração de NFe:', error)
      return {
        success: false,
        error: error.message || 'Erro ao buscar configuração de NFe',
      }
    }
  }

  /**
   * Criar ou atualizar configuração de NFe
   */
  static async upsert(emitenteId: string, data: ConfiguracaoNfeData): Promise<{ success: boolean; data?: ConfiguracaoNfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfe/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar configuração de NFe',
        }
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error: any) {
      console.error('Erro ao salvar configuração de NFe:', error)
      return {
        success: false,
        error: error.message || 'Erro ao salvar configuração de NFe',
      }
    }
  }

  /**
   * Incrementar próximo número
   */
  static async incrementarNumero(emitenteId: string): Promise<{ success: boolean; data?: ConfiguracaoNfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfe/${emitenteId}/incrementar`, {
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
      const response = await fetch(`${API_BASE_URL}/configuracoes-nfe/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao deletar configuração de NFe',
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao deletar configuração de NFe:', error)
      return {
        success: false,
        error: error.message || 'Erro ao deletar configuração de NFe',
      }
    }
  }
}

