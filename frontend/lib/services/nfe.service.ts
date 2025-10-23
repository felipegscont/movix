const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface NfeItem {
  id: string;
  numeroItem: number;
  produtoId: string;
  cfopId: string;
  quantidadeComercial: number;
  valorUnitario: number;
  valorDesconto?: number;
  valorFrete?: number;
  valorSeguro?: number;
  valorTotal: number;
  produto?: {
    id: string;
    codigo: string;
    descricao: string;
    ncmId: string;
  };
  cfop?: {
    id: string;
    codigo: string;
    descricao: string;
  };
}

export interface NfeDuplicata {
  id?: string;
  numero: string;
  dataVencimento: string;
  valor: number;
}

export interface FormaPagamento {
  id: string;
  codigo: string;
  descricao: string;
  requerCard: boolean;
  vigenciaInicio?: string;
  observacoes?: string;
  ativo: boolean;
}

export interface NfeCobranca {
  id: string;
  numeroFatura?: string;
  valorOriginal: number;
  valorDesconto: number;
  valorLiquido: number;
}

export interface NfePagamento {
  id: string;
  indicadorPagamento: number;
  formaPagamentoId: string;
  descricaoPagamento?: string;
  valor: number;
  dataPagamento?: string;
  tipoIntegracao?: number;
  cnpjCredenciadora?: string;
  bandeira?: string;
  numeroAutorizacao?: string;
  formaPagamento?: FormaPagamento;
}

export interface Nfe {
  id: string;
  emitenteId: string;
  clienteId: string;
  numero: number;
  serie: number;
  chave?: string;
  naturezaOperacao: string;
  tipoOperacao: number;
  consumidorFinal: number;
  presencaComprador: number;
  dataEmissao: string;
  dataSaida?: string;
  modalidadeFrete?: number;
  valorFrete?: number;
  valorSeguro?: number;
  valorDesconto?: number;
  valorOutros?: number;
  valorTotal: number;
  valorTotalProdutos: number;
  valorTotalTributos: number;
  // Totalizadores raros (baseado em XMLs reais)
  valorICMSDesonerado?: number;
  valorFCP?: number;
  valorII?: number;
  valorOutrasDespesas?: number;
  informacoesAdicionais?: string;
  informacoesFisco?: string;
  status: 'DIGITACAO' | 'AUTORIZADA' | 'CANCELADA' | 'REJEITADA';
  protocolo?: string;
  dataAutorizacao?: string;
  motivoStatus?: string;
  xmlAutorizado?: string;
  createdAt: string;
  updatedAt: string;
  emitente?: {
    id: string;
    razaoSocial: string;
    cnpj: string;
  };
  cliente?: {
    id: string;
    nome: string;
    documento: string;
    tipo: string;
  };
  itens?: NfeItem[];
  duplicatas?: NfeDuplicata[];
  pagamentos?: NfePagamento[];
}

export interface CreateNfeItemData {
  produtoId: string;
  numeroItem: number;
  cfopId: string;
  quantidadeComercial: number;
  valorUnitario: number;
  valorDesconto?: number;
  valorFrete?: number;
  valorSeguro?: number;
}

export interface CreateNfeDuplicataData {
  numero: string;
  dataVencimento: string;
  valor: number;
}

export interface CreateNfeCobrancaData {
  numeroFatura?: string;
  valorOriginal: number;
  valorDesconto?: number;
  valorLiquido: number;
}

export interface CreateNfePagamentoData {
  indicadorPagamento: number;
  formaPagamento: string;
  descricaoPagamento?: string;
  valor: number;
  dataPagamento?: string;
  tipoIntegracao?: number;
  cnpjCredenciadora?: string;
  bandeira?: string;
  numeroAutorizacao?: string;
}

export interface CreateNfeData {
  emitenteId: string;
  clienteId: string;
  serie: number;
  naturezaOperacao: string;
  tipoOperacao: number;
  consumidorFinal: number;
  presencaComprador: number;
  dataEmissao?: string;
  dataSaida?: string;
  modalidadeFrete?: number;
  valorFrete?: number;
  valorSeguro?: number;
  valorDesconto?: number;
  valorOutros?: number;
  // Totalizadores raros (baseado em XMLs reais)
  valorICMSDesonerado?: number;
  valorFCP?: number;
  valorII?: number;
  valorOutrasDespesas?: number;
  informacoesAdicionais?: string;
  informacoesFisco?: string;
  itens: CreateNfeItemData[];
  cobranca?: CreateNfeCobrancaData;
  duplicatas?: CreateNfeDuplicataData[];
  pagamentos?: CreateNfePagamentoData[];
}

export interface NfesResponse {
  data: Nfe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class NfeService {
  static async getFormasPagamento(): Promise<FormaPagamento[]> {
    const response = await fetch(`${API_BASE_URL}/formas-pagamento`);
    if (!response.ok) {
      throw new Error('Erro ao buscar formas de pagamento');
    }
    return response.json();
  }

  static async getAll(params?: { page?: number; limit?: number; search?: string; emitenteId?: string; status?: string } | number, limit?: number, emitenteId?: string, status?: string): Promise<NfesResponse> {
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

      if (params.emitenteId) {
        queryParams.append('emitenteId', params.emitenteId);
      }

      if (params.status) {
        queryParams.append('status', params.status);
      }
    } else {
      queryParams = new URLSearchParams({
        page: (params || 1).toString(),
        limit: (limit || 10).toString(),
      });

      if (emitenteId) {
        queryParams.append('emitenteId', emitenteId);
      }

      if (status) {
        queryParams.append('status', status);
      }
    }

    const response = await fetch(`${API_BASE_URL}/nfes?${queryParams}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar NFes');
    }
    return response.json();
  }

  static async getById(id: string): Promise<Nfe> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar NFe');
    }
    return response.json();
  }

  static async create(data: CreateNfeData): Promise<Nfe> {
    const response = await fetch(`${API_BASE_URL}/nfes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar NFe');
    }
    
    return response.json();
  }

  static async update(id: string, data: Partial<CreateNfeData>): Promise<Nfe> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar NFe');
    }
    
    return response.json();
  }

  static async transmitir(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/transmitir`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao transmitir NFe');
    }
    
    return response.json();
  }

  static async consultar(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/consultar`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao consultar NFe');
    }
    
    return response.json();
  }

  static async cancelar(id: string, justificativa: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/cancelar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ justificativa }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cancelar NFe');
    }
    
    return response.json();
  }

  static async cartaCorrecao(id: string, correcao: string, sequencia = 1): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/carta-correcao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correcao, sequencia }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao enviar carta de correção');
    }
    
    return response.json();
  }

  static async downloadXml(id: string, type: 'generated' | 'signed' | 'authorized' = 'authorized'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/xml?type=${type}`);
    
    if (!response.ok) {
      throw new Error('Erro ao baixar XML');
    }
    
    return response.blob();
  }

  static async downloadPdf(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/pdf`);
    
    if (!response.ok) {
      throw new Error('Erro ao baixar PDF');
    }
    
    return response.blob();
  }

  static async getFileInfo(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}/files/info`);
    
    if (!response.ok) {
      throw new Error('Erro ao obter informações dos arquivos');
    }
    
    return response.json();
  }

  static async checkHealth(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/health`);
    
    if (!response.ok) {
      throw new Error('Erro ao verificar saúde do serviço');
    }
    
    return response.json();
  }

  static async checkSefazStatus(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/sefaz-status`);
    
    if (!response.ok) {
      throw new Error('Erro ao verificar status da SEFAZ');
    }
    
    return response.json();
  }
}
