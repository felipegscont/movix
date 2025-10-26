const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface InutilizacaoCteData {
  numeroInicialInutilizarProducao?: number
  numeroFinalInutilizarProducao?: number
  serieInutilizarProducao?: number
  anoInutilizarProducao?: number
  justificativaInutilizarProducao?: string
  numeroInicialInutilizarHomologacao?: number
  numeroFinalInutilizarHomologacao?: number
  serieInutilizarHomologacao?: number
  anoInutilizarHomologacao?: number
  justificativaInutilizarHomologacao?: string
}

export interface InutilizacaoCte extends InutilizacaoCteData {
  id: string
  emitenteId: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class InutilizacaoCteService {
  /**
   * Buscar inutilização de CT-e por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: InutilizacaoCte; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-cte/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Inutilização não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar inutilização de CT-e',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar inutilização de CT-e',
      }
    }
  }

  /**
   * Criar ou atualizar inutilização de CT-e
   */
  static async upsert(emitenteId: string, data: InutilizacaoCteData): Promise<{ success: boolean; data?: InutilizacaoCte; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-cte/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar inutilização de CT-e',
        }
      }

      const responseData = await response.json()
      return { success: true, data: responseData }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao salvar inutilização de CT-e',
      }
    }
  }

  /**
   * Remover inutilização
   */
  static async remove(emitenteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-cte/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao remover inutilização de CT-e',
        }
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao remover inutilização de CT-e',
      }
    }
  }
}

