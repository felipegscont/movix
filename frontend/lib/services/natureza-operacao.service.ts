const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface NaturezaOperacao {
  id: string
  codigo: string
  descricao: string
  cfopDentroEstadoId?: string
  cfopForaEstadoId?: string
  cfopExteriorId?: string
  tipoOperacao: number // 0=Entrada, 1=Saída
  finalidade: number // 1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução
  consumidorFinal: number // 0=Não, 1=Sim
  presencaComprador: number // 0=Não se aplica, 1=Presencial, etc
  informacoesAdicionaisPadrao?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
  cfopDentroEstado?: {
    id: string
    codigo: string
    descricao: string
  }
  cfopForaEstado?: {
    id: string
    codigo: string
    descricao: string
  }
  cfopExterior?: {
    id: string
    codigo: string
    descricao: string
  }
}

export interface CreateNaturezaOperacaoData {
  codigo: string
  descricao: string
  cfopDentroEstadoId?: string
  cfopForaEstadoId?: string
  cfopExteriorId?: string
  tipoOperacao: number
  finalidade: number
  consumidorFinal: number
  presencaComprador: number
  informacoesAdicionaisPadrao?: string
  ativo?: boolean
}

export interface UpdateNaturezaOperacaoData extends Partial<CreateNaturezaOperacaoData> {}

export interface NaturezaOperacaoListResponse {
  data: NaturezaOperacao[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface NaturezaOperacaoQueryParams {
  page?: number
  limit?: number
  search?: string
}

export class NaturezaOperacaoService {
  private static readonly BASE_PATH = '/naturezas-operacao'

  static async getAll(params?: NaturezaOperacaoQueryParams): Promise<NaturezaOperacaoListResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = `${API_BASE_URL}${this.BASE_PATH}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao buscar naturezas de operação: ${response.status}`)
      }
      return response.json()
    } catch (error: any) {
      console.error('Erro ao buscar naturezas de operação:', error)
      throw error
    }
  }

  static async getAtivas(): Promise<NaturezaOperacao[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/ativas`)
      if (!response.ok) {
        throw new Error('Erro ao buscar naturezas de operação ativas')
      }
      return response.json()
    } catch (error: any) {
      console.error('Erro ao buscar naturezas de operação ativas:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<NaturezaOperacao> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${id}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar natureza de operação')
      }
      return response.json()
    } catch (error: any) {
      console.error('Erro ao buscar natureza de operação:', error)
      throw error
    }
  }

  static async create(data: CreateNaturezaOperacaoData): Promise<NaturezaOperacao> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao criar natureza de operação')
      }

      return response.json()
    } catch (error: any) {
      console.error('Erro ao criar natureza de operação:', error)
      throw error
    }
  }

  static async update(id: string, data: UpdateNaturezaOperacaoData): Promise<NaturezaOperacao> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao atualizar natureza de operação')
      }

      return response.json()
    } catch (error: any) {
      console.error('Erro ao atualizar natureza de operação:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao excluir natureza de operação')
      }
    } catch (error: any) {
      console.error('Erro ao excluir natureza de operação:', error)
      throw error
    }
  }
}

