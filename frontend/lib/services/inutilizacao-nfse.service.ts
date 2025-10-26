const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface InutilizacaoNfseData {
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

export interface InutilizacaoNfse extends InutilizacaoNfseData {
  id: string
  emitenteId: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export class InutilizacaoNfseService {
  /**
   * Buscar inutilização de NFSe por emitente
   */
  static async getByEmitente(emitenteId: string): Promise<{ success: boolean; data?: InutilizacaoNfse; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-nfse/${emitenteId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Inutilização não encontrada' }
        }
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar inutilização de NFSe',
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar inutilização de NFSe',
      }
    }
  }

  /**
   * Criar ou atualizar inutilização de NFSe
   */
  static async upsert(emitenteId: string, data: InutilizacaoNfseData): Promise<{ success: boolean; data?: InutilizacaoNfse; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-nfse/${emitenteId}`, {
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
          error: errorData.message || 'Erro ao salvar inutilização de NFSe',
        }
      }

      const responseData = await response.json()
      return { success: true, data: responseData }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao salvar inutilização de NFSe',
      }
    }
  }

  /**
   * Remover inutilização
   */
  static async remove(emitenteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/inutilizacoes-nfse/${emitenteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || 'Erro ao remover inutilização de NFSe',
        }
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao remover inutilização de NFSe',
      }
    }
  }
}

