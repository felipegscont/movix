const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Produto {
  id: string;
  codigo: string;
  codigoBarras?: string;
  descricao: string;
  descricaoComplementar?: string;
  ncmId: string;
  cestId?: string;
  cfopId?: string;
  unidade: string;
  unidadeTributavel?: string;
  valorUnitario: number;
  valorCusto?: number;
  margemLucro?: number;
  estoqueAtual: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  origem: string;
  // Impostos ICMS
  icmsCstId?: string;
  icmsCsosnId?: string;
  icmsAliquota?: number;
  icmsReducao?: number;
  // Impostos PIS
  pisCstId?: string;
  pisAliquota?: number;
  // Impostos COFINS
  cofinsCstId?: string;
  cofinsAliquota?: number;
  // Impostos IPI
  ipiCstId?: string;
  ipiAliquota?: number;
  fornecedorId?: string;
  observacoes?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  ncm?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  cest?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  fornecedor?: {
    id: string;
    nome: string;
    documento: string;
  };
  icmsCst?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  icmsCsosn?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  pisCst?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  cofinsCst?: {
    id: string;
    codigo: string;
    descricao: string;
  };
  ipiCst?: {
    id: string;
    codigo: string;
    descricao: string;
  };
}

export interface CreateProdutoData {
  codigo: string;
  codigoBarras?: string;
  descricao: string;
  descricaoComplementar?: string;
  ncmId: string;
  cestId?: string;
  cfopId?: string;
  unidade: string;
  unidadeTributavel?: string;
  valorUnitario: number;
  valorCusto?: number;
  margemLucro?: number;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  origem: string;
  // Impostos ICMS
  icmsCstId?: string;
  icmsCsosnId?: string;
  icmsAliquota?: number;
  icmsReducao?: number;
  // Impostos PIS
  pisCstId?: string;
  pisAliquota?: number;
  // Impostos COFINS
  cofinsCstId?: string;
  cofinsAliquota?: number;
  // Impostos IPI
  ipiCstId?: string;
  ipiAliquota?: number;
  fornecedorId?: string;
  observacoes?: string;
  ativo?: boolean;
}

export interface ProdutosResponse {
  data: Produto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ProdutoService {
  static async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<ProdutosResponse> {
    const queryParams = new URLSearchParams({
      page: (params?.page || 1).toString(),
      limit: (params?.limit || 10).toString(),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const response = await fetch(`${API_BASE_URL}/produtos?${queryParams}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    return response.json();
  }

  static async getById(id: string): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produto');
    }
    return response.json();
  }

  static async getByCodigo(codigo: string): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/codigo/${codigo}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produto por código');
    }
    return response.json();
  }



  static async create(data: CreateProdutoData): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar produto');
    }
    
    return response.json();
  }

  static async update(id: string, data: Partial<CreateProdutoData>): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar produto');
    }
    
    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir produto');
    }
  }

  static async getForSelect(): Promise<{ id: string; codigo: string; descricao: string; valorUnitario: number; unidade: string; estoqueAtual: number }[]> {
    const response = await fetch(`${API_BASE_URL}/produtos/select`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos para seleção');
    }
    const data = await response.json();
    return data.data || data;
  }

  static async updateEstoque(id: string, quantidade: number, operacao: 'ENTRADA' | 'SAIDA'): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}/estoque`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantidade, operacao }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar estoque');
    }

    return response.json();
  }
}
