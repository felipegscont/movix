const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface CFOP {
  id: string
  codigo: string
  descricao: string
}

export interface NaturezaOperacaoCFOP {
  id: string
  naturezaOperacaoId: string
  cfopId: string
  padrao: boolean
  cfop: CFOP
  createdAt: string
  updatedAt: string
}

export interface ProdutoExcecao {
  cfopId: string
  descricaoCfop: string
  produtoId: string
  descricaoProduto: string
  padrao: boolean
}

export interface NaturezaOperacao {
  id: string
  codigo: string
  nome: string
  tipo: number // 0=Entrada, 1=Saída
  ativa: boolean
  dentroEstado: boolean
  propria: boolean
  produtosExcecao?: ProdutoExcecao[]
  informacoesAdicionais?: string
  createdAt: string
  updatedAt: string
  cfops?: NaturezaOperacaoCFOP[]
}

export interface CreateNaturezaOperacaoData {
  codigo: string
  nome: string
  tipo: number
  ativa?: boolean
  dentroEstado?: boolean
  propria?: boolean
  produtosExcecao?: ProdutoExcecao[]
  informacoesAdicionais?: string
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

  // Métodos para gerenciar CFOPs
  static async addCFOP(naturezaId: string, cfopId: string, padrao: boolean = false): Promise<NaturezaOperacaoCFOP> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${naturezaId}/cfops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cfopId, padrao }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao adicionar CFOP')
      }

      return response.json()
    } catch (error: any) {
      console.error('Erro ao adicionar CFOP:', error)
      throw error
    }
  }

  static async removeCFOP(naturezaId: string, cfopId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${naturezaId}/cfops/${cfopId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao remover CFOP')
      }
    } catch (error: any) {
      console.error('Erro ao remover CFOP:', error)
      throw error
    }
  }

  static async updateCFOPPadrao(naturezaId: string, cfopId: string, padrao: boolean): Promise<NaturezaOperacaoCFOP> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${naturezaId}/cfops/${cfopId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ padrao }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao atualizar CFOP padrão')
      }

      return response.json()
    } catch (error: any) {
      console.error('Erro ao atualizar CFOP padrão:', error)
      throw error
    }
  }

  static async getCFOPs(naturezaId: string): Promise<NaturezaOperacaoCFOP[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.BASE_PATH}/${naturezaId}/cfops`)
      if (!response.ok) {
        throw new Error('Erro ao buscar CFOPs da natureza de operação')
      }
      return response.json()
    } catch (error: any) {
      console.error('Erro ao buscar CFOPs:', error)
      throw error
    }
  }
}

