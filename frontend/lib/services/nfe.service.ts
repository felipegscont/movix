const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - O servidor demorou muito para responder');
    }
    throw error;
  }
};

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
  naturezaOperacaoId?: string;
  tipoOperacao: number;
  finalidade?: number;
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
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/formas-pagamento`);
      if (!response.ok) {
        throw new Error('Erro ao buscar formas de pagamento');
      }
      return response.json();
    } catch (error: any) {
      console.error('❌ Erro ao buscar formas de pagamento:', error);
      throw new Error(error.message || 'Erro ao buscar formas de pagamento');
    }
  }

  static async getAll(params?: { page?: number; limit?: number; search?: string; emitenteId?: string; status?: string } | number, limit?: number, emitenteId?: string, status?: string): Promise<NfesResponse> {
    try {
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

      const url = `${API_BASE_URL}/nfes?${queryParams}`;
      console.log('🔍 Fetching NFes from:', url);

      const response = await fetchWithTimeout(url, {}, 15000); // 15 second timeout

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('❌ Error response:', errorText);
        throw new Error(`Erro ao buscar NFes: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ NFes loaded:', data.meta?.total || 0, 'total');
      return data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar NFes:', error);

      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        throw new Error('Timeout: O servidor demorou muito para responder. Verifique se o backend está rodando.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando em ' + API_BASE_URL);
      }

      throw error;
    }
  }

  static async getById(id: string): Promise<Nfe> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/nfes/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar NFe');
      }
      return response.json();
    } catch (error: any) {
      console.error('❌ Erro ao buscar NFe:', error);
      throw new Error(error.message || 'Erro ao buscar NFe');
    }
  }

  static async create(data: CreateNfeData): Promise<Nfe> {
    console.log('📤 Enviando para backend:', JSON.stringify(data, null, 2))

    const response = await fetch(`${API_BASE_URL}/nfes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Internal server error' }));
      console.error('❌ Erro do backend:', error)
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

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/nfes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir NFe');
    }
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

  /**
   * Buscar matriz fiscal aplicável para um item da NFe
   */
  static async buscarMatrizFiscal(params: {
    naturezaOperacaoId: string;
    clienteId: string;
    produtoId: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/buscar-matriz-fiscal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao buscar matriz fiscal');
    }

    return response.json();
  }

  /**
   * Aplicar matriz fiscal em todos os itens da NFe
   */
  static async aplicarMatrizFiscal(nfeId: string, params: {
    naturezaOperacaoId: string;
    naturezaOperacao: string;
    cfopId: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${nfeId}/aplicar-matriz-fiscal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao aplicar matriz fiscal');
    }

    return response.json();
  }

  /**
   * Emitir NFe para SEFAZ
   */
  static async emitir(nfeId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nfes/${nfeId}/emitir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao emitir NFe');
    }

    return response.json();
  }
}
