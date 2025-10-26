const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface InutilizacaoMdfeData {
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

export interface InutilizacaoMdfe extends InutilizacaoMdfeData {
  id: string
  emitenteId: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class InutilizacaoMdfeService {
  /**
   * Buscar inutilização de MDF-e por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: InutilizacaoMdfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-mdfe/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Inutilização não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar inutilização de MDF-e',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar inutilização de MDF-e',
      }
    }
  }

  /**
   * Criar ou atualizar inutilização de MDF-e
   */
  static async upsert(emitenteId: string, data: InutilizacaoMdfeData): Promise<{ success: boolean; data?: InutilizacaoMdfe; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-mdfe/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar inutilização de MDF-e',
        }
      }

      const responseData = await response.json()
      return { success: true, data: responseData }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao salvar inutilização de MDF-e',
      }
    }
  }

  /**
   * Remover inutilização
   */
  static async remove(emitenteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-mdfe/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao remover inutilização de MDF-e',
        }
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao remover inutilização de MDF-e',
      }
    }
  }
}

