const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Estado {
  id: string;
  nome: string;
  uf: string;
  codigoIbge: string;
}

export interface Municipio {
  id: string;
  nome: string;
  codigoIbge: string;
  estadoId: string;
  estado?: Estado;
}

export interface NCM {
  id: string;
  codigo: string;
  descricao: string;
}

export interface CEST {
  id: string;
  codigo: string;
  descricao: string;
}

export interface CFOP {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'ENTRADA' | 'SAIDA';
}

export interface CST {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'ICMS' | 'IPI' | 'PIS' | 'COFINS';
}

export interface CSOSN {
  id: string;
  codigo: string;
  descricao: string;
}

export class AuxiliarService {
  static async getEstados(search?: string): Promise<Estado[]> {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/estados?${params}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar estados');
    }
    const data = await response.json();
    return data.data;
  }

  static async getMunicipios(estadoId?: string, search?: string): Promise<Municipio[]> {
    const params = new URLSearchParams();
    if (estadoId) {
      params.append('estadoId', estadoId);
    }
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/municipios?${params}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar municípios');
    }
    const data = await response.json();
    return data.data;
  }

  /**
   * Busca municípios por estado (alias para getMunicipios com estadoId)
   * O backend popula automaticamente os municípios se não existirem
   */
  static async getMunicipiosByEstado(estadoId: string): Promise<Municipio[]> {
    return this.getMunicipios(estadoId);
  }

  static async getNcms(search?: string): Promise<NCM[]> {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/ncms?${params}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar NCMs');
    }
    const data = await response.json();
    return data.data;
  }

  // Alias para compatibilidade
  static async getNCMs(search?: string): Promise<NCM[]> {
    return this.getNcms(search);
  }

  static async getCfops(search?: string, tipo?: string): Promise<CFOP[]> {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }
    if (tipo) {
      params.append('tipo', tipo);
    }

    const response = await fetch(`${API_BASE_URL}/cfops?${params}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar CFOPs');
    }
    const data = await response.json();
    return data.data;
  }

  // Alias para compatibilidade
  static async getCFOPs(search?: string, tipo?: string): Promise<CFOP[]> {
    return this.getCfops(search, tipo);
  }

  static async getCSTs(tipo?: string): Promise<CST[]> {
    const params = new URLSearchParams();
    if (tipo) {
      params.append('tipo', tipo);
    }

    const response = await fetch(`${API_BASE_URL}/csts?${params}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar CSTs');
    }
    const data = await response.json();
    return data.data;
  }

  static async getCESTs(): Promise<CEST[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cests`);
      if (!response.ok) {
        console.warn('Endpoint /cests não encontrado, retornando lista vazia');
        return [];
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Erro ao buscar CESTs, retornando lista vazia:', error);
      return [];
    }
  }

  static async getCSOSNs(): Promise<CSOSN[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/csosns`);
      if (!response.ok) {
        console.warn('Endpoint /csosns não encontrado, retornando lista vazia');
        return [];
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Erro ao buscar CSOSNs, retornando lista vazia:', error);
      return [];
    }
  }
}
