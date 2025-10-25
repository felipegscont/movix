const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Orcamento {
  id: string;
  numero: number;
  dataEmissao: string;
  dataValidade: string;
  status: 'EM_ABERTO' | 'APROVADO' | 'CANCELADO';
  clienteId: string;
  vendedorNome?: string;
  subtotal: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutros: number;
  valorTotal: number;
  observacoes?: string;
  pedidoId?: string;
  dataConversao?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: any;
  itens?: OrcamentoItem[];
  pedido?: any;
  _count?: {
    itens: number;
  };
}

export interface OrcamentoItem {
  id: string;
  orcamentoId: string;
  numeroItem: number;
  produtoId: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorDesconto: number;
  valorTotal: number;
  observacoes?: string;
  produto?: any;
}

export interface CreateOrcamentoDto {
  numero: number;
  dataEmissao: string;
  dataValidade: string;
  status?: 'EM_ABERTO' | 'APROVADO' | 'CANCELADO';
  clienteId: string;
  vendedorNome?: string;
  subtotal: number;
  valorDesconto?: number;
  valorFrete?: number;
  valorOutros?: number;
  valorTotal: number;
  observacoes?: string;
  itens: Omit<OrcamentoItem, 'id' | 'orcamentoId'>[];
}

export interface OrcamentosResponse {
  data: Orcamento[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class OrcamentoService {
  /**
   * Listar orçamentos com paginação
   */
  static async getAll(params?: {
    page?: number;
    limit?: number;
    clienteId?: string;
    status?: string;
  }): Promise<OrcamentosResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.clienteId) queryParams.append('clienteId', params.clienteId);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/orcamentos?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar orçamentos');
    }
    
    return response.json();
  }

  /**
   * Buscar orçamento por ID
   */
  static async getById(id: string): Promise<Orcamento> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar orçamento');
    }
    
    return response.json();
  }

  /**
   * Criar novo orçamento
   */
  static async create(data: CreateOrcamentoDto): Promise<Orcamento> {
    const response = await fetch(`${API_BASE_URL}/orcamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar orçamento');
    }
    
    return response.json();
  }

  /**
   * Atualizar orçamento
   */
  static async update(id: string, data: Partial<CreateOrcamentoDto>): Promise<Orcamento> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar orçamento');
    }
    
    return response.json();
  }

  /**
   * Remover orçamento
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao remover orçamento');
    }
  }

  /**
   * Cancelar orçamento
   */
  static async cancelar(id: string): Promise<Orcamento> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/${id}/cancelar`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cancelar orçamento');
    }
    
    return response.json();
  }

  /**
   * Converter orçamento em pedido
   */
  static async converterEmPedido(id: string): Promise<{ orcamento: Orcamento; pedido: any }> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/${id}/converter-em-pedido`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao converter orçamento');
    }
    
    return response.json();
  }

  /**
   * Obter próximo número de orçamento
   */
  static async getProximoNumero(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/orcamentos/proximo-numero`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar próximo número');
    }
    
    return response.json();
  }
}

