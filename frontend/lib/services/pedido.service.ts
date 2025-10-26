const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Pedido {
  id: string;
  numero: number;
  dataEmissao: string;
  dataEntrega?: string;
  status: 'ABERTO' | 'FATURADO' | 'CANCELADO';
  clienteId: string;
  vendedorNome?: string;
  enderecoEntrega?: string;
  subtotal: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutros: number;
  valorTotal: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: any;
  itens?: PedidoItem[];
  pagamentos?: PedidoPagamento[];
  nfes?: any[];
  _count?: {
    itens: number;
    pagamentos: number;
    nfes: number;
  };
}

export interface PedidoItem {
  id: string;
  pedidoId: string;
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

export interface PedidoPagamento {
  id: string;
  pedidoId: string;
  parcela: number;
  formaPagamentoId: string;
  dataVencimento: string;
  valor: number;
  observacoes?: string;
  formaPagamento?: any;
}

export interface CreatePedidoDto {
  numero: number;
  dataEmissao: string;
  dataEntrega?: string;
  status?: 'ABERTO' | 'FATURADO' | 'CANCELADO';
  clienteId: string;
  vendedorNome?: string;
  enderecoEntrega?: string;
  subtotal: number;
  valorDesconto?: number;
  valorFrete?: number;
  valorOutros?: number;
  valorTotal: number;
  observacoes?: string;
  itens: Omit<PedidoItem, 'id' | 'pedidoId'>[];
  pagamentos?: Omit<PedidoPagamento, 'id' | 'pedidoId'>[];
}

export interface PedidosResponse {
  data: Pedido[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PedidoService {
  /**
   * Listar pedidos com paginação
   */
  static async getAll(params?: {
    page?: number;
    limit?: number;
    clienteId?: string;
    status?: string;
  }): Promise<PedidosResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.clienteId) queryParams.append('clienteId', params.clienteId);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/pedidos?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }
    
    return response.json();
  }

  /**
   * Buscar pedido por ID
   */
  static async getById(id: string): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar pedido');
    }
    
    return response.json();
  }

  /**
   * Criar novo pedido
   */
  static async create(data: CreatePedidoDto): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar pedido');
    }

    return response.json();
  }

  /**
   * Atualizar pedido
   */
  static async update(id: string, data: Partial<CreatePedidoDto>): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar pedido');
    }
    
    return response.json();
  }

  /**
   * Remover pedido
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao remover pedido');
    }
  }

  /**
   * Obter próximo número de pedido
   */
  static async getProximoNumero(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/pedidos/proximo-numero`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar próximo número');
    }
    
    return response.json();
  }

  /**
   * Gerar NFe a partir do pedido
   */
  static async gerarNFe(pedidoId: string, naturezaOperacaoId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/gerar-nfe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ naturezaOperacaoId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao gerar NFe');
    }
    
    return response.json();
  }
}

