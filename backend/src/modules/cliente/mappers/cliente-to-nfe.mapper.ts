import { Cliente, Municipio, Estado } from '@prisma/client';

/**
 * Interface para o endereço do destinatário da NFe (tag <enderDest>)
 * Baseado nos XMLs reais de produção
 */
export interface NFeEnderecoDest {
  xLgr: string; // Logradouro
  nro: string; // Número
  xCpl?: string; // Complemento (opcional)
  xBairro: string; // Bairro
  cMun: string; // Código IBGE do município (7 dígitos)
  xMun: string; // Nome do município
  UF: string; // Sigla do estado (2 caracteres)
  CEP: string; // CEP (8 dígitos sem formatação)
  cPais: string; // Código do país (1058 = Brasil)
  xPais: string; // Nome do país (BRASIL)
}

/**
 * Interface para o destinatário da NFe (tag <dest>)
 * Baseado nos XMLs reais de produção
 */
export interface NFeDestinatario {
  CNPJ?: string; // CNPJ (14 dígitos) - usado para PJ
  CPF?: string; // CPF (11 dígitos) - usado para PF
  xNome: string; // Nome ou Razão Social
  enderDest: NFeEnderecoDest; // Endereço completo
  indIEDest: number; // 1=Contribuinte ICMS, 2=Isento, 9=Não contribuinte
  IE?: string; // Inscrição Estadual (obrigatório se indIEDest=1)
}

/**
 * Tipo Cliente com relacionamentos carregados
 */
export type ClienteComRelacionamentos = Cliente & {
  municipio: Municipio;
  estado: Estado;
};

/**
 * Mapper para converter Cliente do banco de dados para formato NFe
 * Baseado nos XMLs reais de produção analisados
 */
export class ClienteToNFeMapper {
  /**
   * Converte um Cliente para o formato de Destinatário da NFe
   * @param cliente Cliente com relacionamentos (municipio e estado)
   * @returns Objeto no formato esperado pela NFe
   * @throws Error se dados obrigatórios estiverem faltando ou inválidos
   */
  static toDestinatario(cliente: ClienteComRelacionamentos): NFeDestinatario {
    // Validações
    this.validateCliente(cliente);

    const isPJ = cliente.documento.length === 14;

    const destinatario: NFeDestinatario = {
      // Documento (CPF ou CNPJ)
      // XML PJ: <CNPJ>22468303000176</CNPJ>
      // XML PF: <CPF>57168067320</CPF>
      ...(isPJ ? { CNPJ: cliente.documento } : { CPF: cliente.documento }),

      // Nome
      // XML: <xNome>UPPER DOG COMERCIAL LTDA</xNome>
      xNome: cliente.nome,

      // Endereço
      enderDest: {
        // XML: <xLgr>RUA RONALDO PRADO</xLgr>
        xLgr: cliente.logradouro,

        // XML: <nro>s/n</nro> ou <nro>144</nro>
        nro: cliente.numero,

        // XML: <xCpl>: FAZ. CHAPADA GRANDE</xCpl> (opcional)
        ...(cliente.complemento && { xCpl: cliente.complemento }),

        // XML: <xBairro>ZONA RURAL</xBairro>
        xBairro: cliente.bairro,

        // XML: <cMun>2104552</cMun> (código IBGE 7 dígitos)
        cMun: cliente.municipio.codigo,

        // XML: <xMun>GOVERNADOR EDISON LOBAO</xMun>
        xMun: cliente.municipio.nome,

        // XML: <UF>MA</UF>
        UF: cliente.estado.uf,

        // XML: <CEP>65928000</CEP> (8 dígitos sem formatação)
        CEP: cliente.cep,

        // XML: <cPais>1058</cPais> (fixo para Brasil)
        cPais: '1058',

        // XML: <xPais>BRASIL</xPais> (fixo)
        xPais: 'BRASIL',
      },

      // Indicador de IE
      // XML PJ Contribuinte: <indIEDest>1</indIEDest>
      // XML PF: <indIEDest>9</indIEDest>
      indIEDest: cliente.indicadorIE,

      // Inscrição Estadual (apenas se contribuinte)
      // XML: <IE>124652794</IE>
      ...(cliente.indicadorIE === 1 &&
        cliente.inscricaoEstadual && {
          IE: cliente.inscricaoEstadual,
        }),
    };

    return destinatario;
  }

  /**
   * Valida se o cliente possui todos os dados necessários para NFe
   * @param cliente Cliente a ser validado
   * @throws Error se alguma validação falhar
   */
  private static validateCliente(cliente: ClienteComRelacionamentos): void {
    // Validação de documento
    if (!cliente.documento) {
      throw new Error('Cliente sem documento (CPF/CNPJ)');
    }

    const isPF = cliente.tipo === 'FISICA';
    const isPJ = cliente.tipo === 'JURIDICA';

    // Validação de tamanho do documento
    if (isPF && cliente.documento.length !== 11) {
      throw new Error(
        `CPF inválido: deve ter 11 dígitos (atual: ${cliente.documento.length})`,
      );
    }

    if (isPJ && cliente.documento.length !== 14) {
      throw new Error(
        `CNPJ inválido: deve ter 14 dígitos (atual: ${cliente.documento.length})`,
      );
    }

    // Validação de nome
    if (!cliente.nome || cliente.nome.trim().length === 0) {
      throw new Error('Cliente sem nome/razão social');
    }

    // Validação de endereço
    if (!cliente.logradouro || cliente.logradouro.trim().length === 0) {
      throw new Error('Cliente sem logradouro');
    }

    if (!cliente.numero || cliente.numero.trim().length === 0) {
      throw new Error('Cliente sem número do endereço');
    }

    if (!cliente.bairro || cliente.bairro.trim().length === 0) {
      throw new Error('Cliente sem bairro');
    }

    // Validação de CEP
    if (!cliente.cep || cliente.cep.length !== 8) {
      throw new Error(
        `CEP inválido: deve ter 8 dígitos (atual: ${cliente.cep?.length || 0})`,
      );
    }

    // Validação de município
    if (!cliente.municipio) {
      throw new Error('Cliente sem município relacionado');
    }

    if (!cliente.municipio.codigo || cliente.municipio.codigo.length !== 7) {
      throw new Error(
        `Código IBGE do município inválido: deve ter 7 dígitos (atual: ${cliente.municipio.codigo?.length || 0})`,
      );
    }

    if (!cliente.municipio.nome || cliente.municipio.nome.trim().length === 0) {
      throw new Error('Município sem nome');
    }

    // Validação de estado
    if (!cliente.estado) {
      throw new Error('Cliente sem estado relacionado');
    }

    if (!cliente.estado.uf || cliente.estado.uf.length !== 2) {
      throw new Error(
        `UF inválida: deve ter 2 caracteres (atual: ${cliente.estado.uf?.length || 0})`,
      );
    }

    // Validação de indicador de IE
    if (![1, 2, 9].includes(cliente.indicadorIE)) {
      throw new Error(
        `Indicador de IE inválido: deve ser 1, 2 ou 9 (atual: ${cliente.indicadorIE})`,
      );
    }

    // Validação de IE para contribuintes
    if (cliente.indicadorIE === 1) {
      if (
        !cliente.inscricaoEstadual ||
        cliente.inscricaoEstadual.trim().length === 0
      ) {
        throw new Error(
          'Inscrição Estadual obrigatória para clientes contribuintes do ICMS (indicadorIE = 1)',
        );
      }
    }

    // Validação: Pessoa Física não pode ser contribuinte ICMS
    if (isPF && cliente.indicadorIE === 1) {
      throw new Error(
        'Pessoa Física não pode ser contribuinte do ICMS (indicadorIE deve ser 9)',
      );
    }
  }

  /**
   * Valida se um cliente está apto para ser usado em uma NFe
   * Retorna array de erros encontrados (vazio se válido)
   * @param cliente Cliente a ser validado
   * @returns Array de mensagens de erro (vazio se válido)
   */
  static validateForNFe(cliente: ClienteComRelacionamentos): string[] {
    const errors: string[] = [];

    try {
      this.validateCliente(cliente);
    } catch (error) {
      errors.push(error.message);
    }

    return errors;
  }

  /**
   * Verifica se um cliente está apto para ser usado em uma NFe
   * @param cliente Cliente a ser validado
   * @returns true se válido, false caso contrário
   */
  static isValidForNFe(cliente: ClienteComRelacionamentos): boolean {
    return this.validateForNFe(cliente).length === 0;
  }
}

