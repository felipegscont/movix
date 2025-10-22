const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Cliente {
  id: string;
  tipo: 'FISICA' | 'JURIDICA';
  documento: string;
  nome: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  inscricaoSuframa?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  municipioId: string;
  estadoId: string;
  telefone?: string;
  celular?: string;
  email?: string;
  indicadorIE?: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  municipio?: {
    id: string;
    nome: string;
    estado: {
      id: string;
      nome: string;
      uf: string;
    };
  };
  estado?: {
    id: string;
    nome: string;
    uf: string;
  };
}

export interface CreateClienteData {
  tipo: 'FISICA' | 'JURIDICA';
  documento: string;
  nome: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  inscricaoSuframa?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  municipioId: string;
  estadoId: string;
  telefone?: string;
  celular?: string;
  email?: string;
  indicadorIE?: number;
  ativo?: boolean;
}

export interface ClientesResponse {
  data: Cliente[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ClienteService {
  static async getAll(params?: { page?: number; limit?: number; search?: string } | number, limit?: number, search?: string): Promise<ClientesResponse> {
    // Suportar ambas as assinaturas para compatibilidade
    let queryParams: URLSearchParams;

    if (typeof params === 'object' && params !== null) {
      queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      });
      if (params.search) {
        queryParams.append('search', params.search);
      }
    } else {
      queryParams = new URLSearchParams({
        page: (params || 1).toString(),
        limit: (limit || 10).toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clientes?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao buscar clientes: ${response.status}`);
      }
      return response.json();
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar cliente');
    }
    return response.json();
  }

  static async getByDocumento(documento: string): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/documento/${documento}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar cliente por documento');
    }
    return response.json();
  }

  static async getForSelect(): Promise<{ id: string; nome: string; documento: string }[]> {
    const response = await fetch(`${API_BASE_URL}/clientes/select`);
    if (!response.ok) {
      throw new Error('Erro ao buscar clientes para seleção');
    }
    const data = await response.json();
    return data.data;
  }

  static async create(data: CreateClienteData): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar cliente');
    }

    return response.json();
  }

  static async update(id: string, data: Partial<CreateClienteData>): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar cliente');
    }

    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir cliente');
    }
  }
}