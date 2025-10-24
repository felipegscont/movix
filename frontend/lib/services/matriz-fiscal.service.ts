const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface MatrizFiscal {
  id: string

  // Identificação
  codigo: string // ICMS, PIS, COFINS, IPI, ISSQN
  descricao: string
  seAplicaA?: string // produtos, servicos
  modeloNF?: string // nfe, nfce, cte, nfse
  regimeTributario?: number // 1=Simples, 2=Presumido, 3=Real

  // Condições/Filtros
  ufDestino?: string
  produtoId?: string
  cfopId?: string
  tipoItem?: string // produto, servico
  ncmId?: string

  // Campos legados (compatibilidade)
  naturezaOperacaoId?: string
  ufOrigem?: string
  tipoCliente?: 'contribuinte' | 'nao_contribuinte' | 'exterior'

  // Definições Fiscais (novos campos unificados)
  cstId?: string // CST genérico
  csosnId?: string // CSOSN (Simples Nacional)
  aliquota?: number
  reducaoBC?: number
  fcp?: number

  // Campos legados ICMS
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
  dataInicio?: string
  dataFim?: string
  ativo: boolean
  createdAt: string
  updatedAt: string

  // Relacionamentos
  produto?: any
  cfop?: any
  ncm?: any
  cst?: any
  csosn?: any
  naturezaOperacao?: any
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
    console.log('Enviando dados para criar matriz fiscal:', JSON.stringify(data, null, 2))
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = `Erro ${response.status}: ${response.statusText}`

      if (contentType?.includes('application/json')) {
        const error = await response.json().catch(() => ({}))
        console.error('Erro ao criar matriz fiscal (JSON):', error)
        errorMessage = error.message || error.error || errorMessage
      } else {
        const text = await response.text().catch(() => '')
        console.error('Erro ao criar matriz fiscal (Text):', text)
        if (text) errorMessage = text
      }

      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * Atualizar matriz fiscal
   */
  async update(id: string, data: Partial<CreateMatrizFiscalDto>): Promise<MatrizFiscal> {
    console.log('Enviando dados para atualizar matriz fiscal:', data)
    const response = await fetch(`${API_BASE_URL}/matrizes-fiscais/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorMessage = `Erro ${response.status}: ${response.statusText}`

      if (contentType?.includes('application/json')) {
        const error = await response.json().catch(() => ({}))
        console.error('Erro ao atualizar matriz fiscal (JSON):', error)
        errorMessage = error.message || error.error || errorMessage
      } else {
        const text = await response.text().catch(() => '')
        console.error('Erro ao atualizar matriz fiscal (Text):', text)
        if (text) errorMessage = text
      }

      throw new Error(errorMessage)
    }

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

