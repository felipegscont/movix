const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface MatrizFiscal {
  id: string
  codigo: string
  descricao: string
  
  // Condições
  naturezaOperacaoId?: string
  ufOrigem?: string
  ufDestino?: string
  tipoCliente?: 'contribuinte' | 'nao_contribuinte' | 'exterior'
  ncmId?: string
  regimeTributario?: number
  
  // Resultado
  cfopId: string
  
  // ICMS
  icmsCstId?: string
  icmsCsosnId?: string
  icmsAliquota?: number
  icmsReducao?: number
  icmsModalidadeBC?: number
  
  // ICMS ST
  icmsStAliquota?: number
  icmsStReducao?: number
  icmsStModalidadeBC?: number
  icmsStMva?: number
  
  // IPI
  ipiCstId?: string
  ipiAliquota?: number
  
  // PIS
  pisCstId?: string
  pisAliquota?: number
  
  // COFINS
  cofinsCstId?: string
  cofinsAliquota?: number
  
  // Controle
  prioridade: number
  ativo: boolean
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  naturezaOperacao?: any
  cfop?: any
  ncm?: any
  icmsCst?: any
  icmsCsosn?: any
  ipiCst?: any
  pisCst?: any
  cofinsCst?: any
}

export interface MatrizFiscalListResponse {
  data: MatrizFiscal[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateMatrizFiscalDto {
  codigo: string
  descricao: string
  naturezaOperacaoId?: string
  ufOrigem?: string
  ufDestino?: string
  tipoCliente?: 'contribuinte' | 'nao_contribuinte' | 'exterior'
  ncmId?: string
  regimeTributario?: number
  cfopId: string
  icmsCstId?: string
  icmsCsosnId?: string
  icmsAliquota?: number
  icmsReducao?: number
  icmsModalidadeBC?: number
  icmsStAliquota?: number
  icmsStReducao?: number
  icmsStModalidadeBC?: number
  icmsStMva?: number
  ipiCstId?: string
  ipiAliquota?: number
  pisCstId?: string
  pisAliquota?: number
  cofinsCstId?: string
  cofinsAliquota?: number
  prioridade?: number
  ativo?: boolean
}

export interface BuscarMatrizAplicavelParams {
  naturezaOperacaoId: string
  ufOrigem: string
  ufDestino: string
  tipoCliente: 'contribuinte' | 'nao_contribuinte' | 'exterior'
  ncmId: string
  regimeTributario: number
}

export const MatrizFiscalService = {
  /**
   * Listar matrizes fiscais com filtros e paginação
   */
  async getAll(params?: {
    page?: number
    limit?: number
    naturezaOperacaoId?: string
    ufOrigem?: string
    ufDestino?: string
    tipoCliente?: string
    ativo?: boolean
  }): Promise<MatrizFiscalListResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.naturezaOperacaoId) queryParams.append('naturezaOperacaoId', params.naturezaOperacaoId)
    if (params?.ufOrigem) queryParams.append('ufOrigem', params.ufOrigem)
    if (params?.ufDestino) queryParams.append('ufDestino', params.ufDestino)
    if (params?.tipoCliente) queryParams.append('tipoCliente', params.tipoCliente)
    if (params?.ativo !== undefined) queryParams.append('ativo', params.ativo.toString())

    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais?${queryParams.toString()}`)
    if (!response.ok) {
      const error = await response.text()
      console.error('Erro ao buscar matrizes fiscais:', response.status, error)
      throw new Error(`Erro ao buscar matrizes fiscais: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Listar apenas matrizes ativas
   */
  async getActive(params?: {
    page?: number
    limit?: number
  }): Promise<MatrizFiscalListResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/ativas?${queryParams.toString()}`)
    if (!response.ok) throw new Error('Erro ao buscar matrizes ativas')
    return response.json()
  },

  /**
   * Buscar matriz fiscal por ID
   */
  async getById(id: string): Promise<MatrizFiscal> {
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/${id}`)
    if (!response.ok) throw new Error('Erro ao buscar matriz fiscal')
    return response.json()
  },

  /**
   * Criar nova matriz fiscal
   */
  async create(data: CreateMatrizFiscalDto): Promise<MatrizFiscal> {
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Erro ao criar matriz fiscal')
    return response.json()
  },

  /**
   * Atualizar matriz fiscal
   */
  async update(id: string, data: Partial<CreateMatrizFiscalDto>): Promise<MatrizFiscal> {
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Erro ao atualizar matriz fiscal')
    return response.json()
  },

  /**
   * Remover matriz fiscal
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Erro ao remover matriz fiscal')
  },

  /**
   * Buscar matriz fiscal aplicável
   * Este método será usado ao adicionar itens na NFe
   */
  async buscarAplicavel(params: BuscarMatrizAplicavelParams): Promise<MatrizFiscal | null> {
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/buscar-aplicavel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!response.ok) throw new Error('Erro ao buscar matriz aplicável')
    return response.json()
  },
}

