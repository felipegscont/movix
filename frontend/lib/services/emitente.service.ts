const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Emitente {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  cnae?: string;
  regimeTributario: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  municipioId: string;
  estadoId: string;
  telefone?: string;
  email?: string;
  site?: string;
  certificadoPath?: string;
  certificadoPassword?: string;
  enviarNotasPorEmail?: boolean;
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

export interface CreateEmitenteData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  cnae?: string;
  regimeTributario: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  municipioId: string;
  estadoId: string;
  telefone?: string;
  email?: string;
  site?: string;
  certificadoPath?: string;
  certificadoPassword?: string;
  ambienteNfe?: number;
  proximoNumeroNfe?: number;
  serieNfe?: number;
  ativo?: boolean;
}

export class EmitenteService {
  static async getAll(): Promise<Emitente[]> {
    const response = await fetch(`${API_BASE_URL}/emitentes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar emitentes');
    }
    const data = await response.json();
    return data.data || data;
  }

  static async getEmitenteAtivo(): Promise<Emitente | null> {
    console.log("🔵 [EmitenteService] Buscando emitente ativo...")
    const response = await fetch(`${API_BASE_URL}/emitentes/ativo/principal`);
    if (!response.ok) {
      // Se for 404, retorna null (emitente não existe ainda)
      if (response.status === 404) {
        console.warn("⚠️ [EmitenteService] Nenhum emitente ativo encontrado (404)")
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao buscar emitente ativo');
    }
    const data = await response.json();
    console.log("📦 [EmitenteService] Emitente recebido da API:", data)
    console.log("📧 [EmitenteService] enviarNotasPorEmail:", data.enviarNotasPorEmail)
    console.log("📧 [EmitenteService] Tipo:", typeof data.enviarNotasPorEmail)
    return data;
  }

  static async getById(id: string): Promise<Emitente> {
    const response = await fetch(`${API_BASE_URL}/emitentes/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar emitente');
    }
    return response.json();
  }

  static async getByCnpj(cnpj: string): Promise<Emitente> {
    const response = await fetch(`${API_BASE_URL}/emitentes/cnpj/${cnpj}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar emitente por CNPJ');
    }
    return response.json();
  }

  static async create(data: CreateEmitenteData): Promise<Emitente> {
    const response = await fetch(`${API_BASE_URL}/emitentes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar emitente');
    }

    return response.json();
  }

  static async update(id: string, data: Partial<CreateEmitenteData>): Promise<Emitente> {
    console.log("🔵 [EmitenteService.update] Atualizando emitente...")
    console.log("🆔 [EmitenteService.update] ID:", id)
    console.log("📝 [EmitenteService.update] Dados enviados:", data)
    console.log("📧 [EmitenteService.update] enviarNotasPorEmail:", data.enviarNotasPorEmail)

    const response = await fetch(`${API_BASE_URL}/emitentes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ [EmitenteService.update] Erro:", error)
      throw new Error(error.message || 'Erro ao atualizar emitente');
    }

    const result = await response.json();
    console.log("✅ [EmitenteService.update] Resposta do backend:", result)
    console.log("📧 [EmitenteService.update] enviarNotasPorEmail salvo:", result.enviarNotasPorEmail)

    return result;
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/emitentes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir emitente');
    }
  }

  static async getProximoNumeroNfe(id: string): Promise<{ proximoNumero: number }> {
    const response = await fetch(`${API_BASE_URL}/emitentes/${id}/proximo-numero-nfe`);
    if (!response.ok) {
      throw new Error('Erro ao buscar próximo número de NFe');
    }
    return response.json();
  }

  static async getCertificadoAtivo(emitenteId: string): Promise<any | null> {
    const response = await fetch(`${API_BASE_URL}/emitentes/${emitenteId}/certificado`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Certificado não encontrado
      }
      throw new Error('Erro ao buscar certificado');
    }

    const data = await response.json();
    console.log('EmitenteService.getCertificadoAtivo - resposta:', data);
    return data;
  }
}
