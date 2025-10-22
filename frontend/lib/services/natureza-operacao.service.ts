import { api } from './api'

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

    const url = `${this.BASE_PATH}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get(url)
    return response.data
  }

  static async getAtivas(): Promise<NaturezaOperacao[]> {
    const response = await api.get(`${this.BASE_PATH}/ativas`)
    return response.data
  }

  static async getById(id: string): Promise<NaturezaOperacao> {
    const response = await api.get(`${this.BASE_PATH}/${id}`)
    return response.data
  }

  static async create(data: CreateNaturezaOperacaoData): Promise<NaturezaOperacao> {
    const response = await api.post(this.BASE_PATH, data)
    return response.data
  }

  static async update(id: string, data: UpdateNaturezaOperacaoData): Promise<NaturezaOperacao> {
    const response = await api.patch(`${this.BASE_PATH}/${id}`, data)
    return response.data
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`)
  }
}

