import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmitenteService } from '../emitente/emitente.service';
import { MatrizFiscalService } from '../matriz-fiscal/matriz-fiscal.service';
import { NfeIntegrationService } from './nfe-integration.service';
import { FileStorageService } from '../../common/services/file-storage.service';
import { CreateNfeDto } from './dto/create-nfe.dto';
import { UpdateNfeDto } from './dto/update-nfe.dto';

@Injectable()
export class NfeService {
  constructor(
    private prisma: PrismaService,
    private emitenteService: EmitenteService,
    private matrizFiscalService: MatrizFiscalService,
    private nfeIntegrationService: NfeIntegrationService,
    private fileStorageService: FileStorageService,
  ) {}

  async create(createNfeDto: CreateNfeDto) {
    // Buscar emitente ativo (sempre o mesmo para o sistema)
    const emitente = await this.emitenteService.getEmitenteAtivo();

    // Buscar configuração de NFe
    const configNfe = await this.prisma.configuracaoNfe.findUnique({
      where: { emitenteId: emitente.id },
    });

    if (!configNfe) {
      throw new NotFoundException('Configuração de NFe não encontrada. Configure em Configurações > Fiscal > NFe');
    }

    // Verificar se cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createNfeDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Obter próximo número da NFe
    const proximoNumero = await this.emitenteService.getProximoNumeroNfe(emitente.id);

    // Calcular totais
    const totais = await this.calcularTotais(createNfeDto);

    // Usar série do ambiente ativo
    const isHomologacao = configNfe.ambienteAtivo === 2;
    const serieAtiva = isHomologacao ? configNfe.serieHomologacao : configNfe.serieProducao;

    // Criar NFe no banco
    const nfe = await this.prisma.nfe.create({
      data: {
        emitenteId: emitente.id, // Usar emitente ativo
        clienteId: createNfeDto.clienteId,
        numero: proximoNumero,
        serie: createNfeDto.serie || serieAtiva, // Usar série da configuração se não informada
        codigoNumerico: String(Math.floor(Math.random() * 100000000)).padStart(8, '0'),
        naturezaOperacao: createNfeDto.naturezaOperacao,
        tipoOperacao: createNfeDto.tipoOperacao,
        consumidorFinal: createNfeDto.consumidorFinal,
        presencaComprador: createNfeDto.presencaComprador,
        dataEmissao: createNfeDto.dataEmissao ? new Date(createNfeDto.dataEmissao) : new Date(),
        dataSaida: createNfeDto.dataSaida ? new Date(createNfeDto.dataSaida) : null,
        modalidadeFrete: createNfeDto.modalidadeFrete || 9,
        valorProdutos: totais.valorProdutos,
        valorFrete: createNfeDto.valorFrete || 0,
        valorSeguro: createNfeDto.valorSeguro || 0,
        valorDesconto: createNfeDto.valorDesconto || 0,
        valorOutros: createNfeDto.valorOutros || 0,
        valorTotal: totais.valorTotal,
        baseCalculoICMS: totais.baseCalculoICMS,
        valorICMS: totais.valorICMS,
        valorIPI: totais.valorIPI,
        valorPIS: totais.valorPIS,
        valorCOFINS: totais.valorCOFINS,
        // Totalizadores raros (baseado em XMLs reais)
        valorICMSDesonerado: createNfeDto.valorICMSDesonerado || 0,
        valorFCP: createNfeDto.valorFCP || 0,
        valorII: createNfeDto.valorII || 0,
        valorOutrasDespesas: createNfeDto.valorOutrasDespesas || 0,
        informacoesAdicionais: createNfeDto.informacoesAdicionais,
        informacoesFisco: createNfeDto.informacoesFisco,
        status: 'DIGITACAO',
      },
    });

    // Criar itens da NFe
    for (const itemDto of createNfeDto.itens) {
      const produto = await this.prisma.produto.findUnique({
        where: { id: itemDto.produtoId },
        include: { ncm: true },
      });

      if (!produto) {
        throw new NotFoundException(`Produto não encontrado: ${itemDto.produtoId}`);
      }

      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: itemDto.cfopId },
      });

      if (!cfop) {
        throw new NotFoundException(`CFOP não encontrado: ${itemDto.cfopId}`);
      }

      const valorTotal = itemDto.quantidadeComercial * itemDto.valorUnitario;

      const nfeItem = await this.prisma.nfeItem.create({
        data: {
          nfeId: nfe.id,
          numeroItem: itemDto.numeroItem,
          produtoId: itemDto.produtoId,
          codigo: produto.codigo,
          codigoBarras: produto.codigoBarras,
          descricao: produto.descricao,
          ncmId: produto.ncmId,
          cfopId: itemDto.cfopId,
          unidadeComercial: produto.unidade,
          quantidadeComercial: itemDto.quantidadeComercial,
          valorUnitario: itemDto.valorUnitario,
          valorTotal: valorTotal,
          unidadeTributavel: produto.unidadeTributavel || produto.unidade,
          quantidadeTributavel: itemDto.quantidadeComercial,
          valorUnitarioTrib: itemDto.valorUnitario,
          valorFrete: itemDto.valorFrete || 0,
          valorSeguro: itemDto.valorSeguro || 0,
          valorDesconto: itemDto.valorDesconto || 0,
          valorOutros: itemDto.valorOutros || 0,
          origem: produto.origem,
          informacoesAdicionais: itemDto.informacoesAdicionais,
        },
      });

      // Criar tributação ICMS
      if (itemDto.icmsCstId || itemDto.icmsCsosnId) {
        await this.prisma.nfeItemICMS.create({
          data: {
            nfeItemId: nfeItem.id,
            origem: produto.origem,
            cstId: itemDto.icmsCstId,
            csosnId: itemDto.icmsCsosnId,
            baseCalculo: itemDto.icmsBaseCalculo || 0,
            aliquota: itemDto.icmsAliquota || 0,
            valor: itemDto.icmsValor || 0,
          },
        });
      }

      // Criar tributação PIS
      await this.prisma.nfeItemPIS.create({
        data: {
          nfeItemId: nfeItem.id,
          cstId: itemDto.pisCstId,
          baseCalculo: itemDto.pisBaseCalculo || 0,
          aliquota: itemDto.pisAliquota || 0,
          valor: itemDto.pisValor || 0,
        },
      });

      // Criar tributação COFINS
      await this.prisma.nfeItemCOFINS.create({
        data: {
          nfeItemId: nfeItem.id,
          cstId: itemDto.cofinsCstId,
          baseCalculo: itemDto.cofinsBaseCalculo || 0,
          aliquota: itemDto.cofinsAliquota || 0,
          valor: itemDto.cofinsValor || 0,
        },
      });
    }

    // Criar cobrança se fornecida
    if (createNfeDto.cobranca) {
      await this.prisma.nfeCobranca.create({
        data: {
          nfeId: nfe.id,
          numeroFatura: createNfeDto.cobranca.numeroFatura,
          valorOriginal: createNfeDto.cobranca.valorOriginal,
          valorDesconto: createNfeDto.cobranca.valorDesconto || 0,
          valorLiquido: createNfeDto.cobranca.valorLiquido,
        },
      });
    }

    // Criar duplicatas se fornecidas (baseado em XML real)
    // XML: <dup><nDup>001</nDup><dVenc>2025-10-06</dVenc><vDup>7200.00</vDup></dup>
    if (createNfeDto.duplicatas && createNfeDto.duplicatas.length > 0) {
      // Validar soma das duplicatas = valor total da NFe ou valor líquido da cobrança
      const valorReferencia = createNfeDto.cobranca?.valorLiquido || totais.valorTotal;
      const somaDuplicatas = createNfeDto.duplicatas.reduce((sum, dup) => sum + dup.valor, 0);
      if (Math.abs(somaDuplicatas - valorReferencia) > 0.01) {
        throw new BadRequestException(
          `Soma das duplicatas (${somaDuplicatas.toFixed(2)}) deve ser igual ao valor ${createNfeDto.cobranca ? 'líquido da cobrança' : 'total da NFe'} (${valorReferencia.toFixed(2)})`
        );
      }

      for (const duplicataDto of createNfeDto.duplicatas) {
        await this.prisma.nfeDuplicata.create({
          data: {
            nfeId: nfe.id,
            numero: duplicataDto.numero,
            dataVencimento: new Date(duplicataDto.dataVencimento),
            valor: duplicataDto.valor,
          },
        });
      }
    }

    // Criar pagamentos se fornecidos
    if (createNfeDto.pagamentos && createNfeDto.pagamentos.length > 0) {
      // Validar soma dos pagamentos = valor total da NFe
      const somaPagamentos = createNfeDto.pagamentos.reduce((sum, pag) => sum + pag.valor, 0);
      if (Math.abs(somaPagamentos - totais.valorTotal) > 0.01) {
        throw new BadRequestException(
          `Soma dos pagamentos (${somaPagamentos.toFixed(2)}) deve ser igual ao valor total da NFe (${totais.valorTotal.toFixed(2)})`
        );
      }

      for (const pagamentoDto of createNfeDto.pagamentos) {
        // Buscar forma de pagamento
        const formaPagamento = await this.prisma.formaPagamento.findUnique({
          where: { codigo: pagamentoDto.formaPagamento },
        });

        if (!formaPagamento) {
          throw new BadRequestException(`Forma de pagamento ${pagamentoDto.formaPagamento} não encontrada`);
        }

        // Validar campos obrigatórios por forma de pagamento
        if (pagamentoDto.formaPagamento === '99' && !pagamentoDto.descricaoPagamento) {
          throw new BadRequestException('Descrição do pagamento é obrigatória para forma de pagamento "99 - Outros"');
        }

        // Validar grupo <card> para cartões e PIX dinâmico
        if (['03', '04', '17'].includes(pagamentoDto.formaPagamento)) {
          if (!pagamentoDto.tipoIntegracao || !pagamentoDto.cnpjCredenciadora || !pagamentoDto.bandeira || !pagamentoDto.numeroAutorizacao) {
            throw new BadRequestException(
              `Dados de cartão (tipoIntegracao, cnpjCredenciadora, bandeira, numeroAutorizacao) são obrigatórios para forma de pagamento ${pagamentoDto.formaPagamento}`
            );
          }
        }

        await this.prisma.nfePagamento.create({
          data: {
            nfeId: nfe.id,
            indicadorPagamento: pagamentoDto.indicadorPagamento,
            formaPagamentoId: formaPagamento.id,
            descricaoPagamento: pagamentoDto.descricaoPagamento,
            valor: pagamentoDto.valor,
            dataPagamento: pagamentoDto.dataPagamento ? new Date(pagamentoDto.dataPagamento) : null,
            tipoIntegracao: pagamentoDto.tipoIntegracao,
            cnpjCredenciadora: pagamentoDto.cnpjCredenciadora,
            bandeira: pagamentoDto.bandeira,
            numeroAutorizacao: pagamentoDto.numeroAutorizacao,
          },
        });
      }
    }

    return this.findOne(nfe.id);
  }

  async findAll(page: number = 1, limit: number = 10, emitenteId?: string, status?: string) {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Number(limit) || 10);
    const skip = (validPage - 1) * validLimit;

    const where: any = {};
    if (emitenteId) where.emitenteId = emitenteId;
    if (status) where.status = status;

    const [nfes, total] = await Promise.all([
      this.prisma.nfe.findMany({
        where,
        include: {
          emitente: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
            },
          },
          cliente: {
            select: {
              id: true,
              nome: true,
              documento: true,
              tipo: true,
            },
          },
        },
        orderBy: { dataEmissao: 'desc' },
        skip,
        take: validLimit,
      }),
      this.prisma.nfe.count({ where }),
    ]);

    return {
      data: nfes,
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async findOne(id: string) {
    const nfe = await this.prisma.nfe.findUnique({
      where: { id },
      include: {
        emitente: {
          include: {
            municipio: { include: { estado: true } },
            estado: true,
          },
        },
        cliente: {
          include: {
            municipio: { include: { estado: true } },
            estado: true,
          },
        },
        itens: {
          include: {
            produto: { include: { ncm: true } },
            ncm: true,
            cfop: true,
            icms: { include: { cst: true, csosn: true } },
            ipi: { include: { cst: true } },
            pis: { include: { cst: true } },
            cofins: { include: { cst: true } },
          },
          orderBy: { numeroItem: 'asc' },
        },
        cobranca: true,
        duplicatas: {
          orderBy: { numero: 'asc' },
        },
        pagamentos: {
          include: {
            formaPagamento: true,
          },
        },
        eventos: {
          orderBy: { dataEvento: 'desc' },
        },
      },
    });

    if (!nfe) {
      throw new NotFoundException('NFe não encontrada');
    }

    return nfe;
  }

  async update(id: string, updateNfeDto: UpdateNfeDto) {
    // Verificar se a NFe existe
    const nfeExistente = await this.prisma.nfe.findUnique({
      where: { id },
      include: { duplicatas: true },
    });

    if (!nfeExistente) {
      throw new NotFoundException('NFe não encontrada');
    }

    // Verificar se a NFe pode ser editada (apenas em digitação)
    if (nfeExistente.status !== 'DIGITACAO') {
      throw new ConflictException('NFe não pode ser editada após transmissão');
    }

    // Extrair duplicatas do DTO
    const { duplicatas, ...dadosNfe } = updateNfeDto as any;

    // Usar transação para garantir atomicidade
    const nfeAtualizada = await this.prisma.$transaction(async (prisma) => {
      // Atualizar dados da NFe
      const nfe = await prisma.nfe.update({
        where: { id },
        data: dadosNfe,
      });

      // Gerenciar duplicatas se fornecidas
      if (duplicatas !== undefined) {
        // Deletar duplicatas antigas
        await prisma.nfeDuplicata.deleteMany({
          where: { nfeId: id },
        });

        // Criar novas duplicatas
        if (duplicatas && duplicatas.length > 0) {
          // Validar soma das duplicatas
          const somaDuplicatas = duplicatas.reduce((sum, dup) => sum + dup.valor, 0);
          const valorTotal = dadosNfe.valorTotal || nfeExistente.valorTotal;

          if (Math.abs(somaDuplicatas - valorTotal) > 0.01) {
            throw new BadRequestException(
              `Soma das duplicatas (${somaDuplicatas.toFixed(2)}) deve ser igual ao valor total da NFe (${valorTotal.toFixed(2)})`
            );
          }

          for (const duplicataDto of duplicatas) {
            await prisma.nfeDuplicata.create({
              data: {
                nfeId: id,
                numero: duplicataDto.numero,
                dataVencimento: new Date(duplicataDto.dataVencimento),
                valor: duplicataDto.valor,
              },
            });
          }
        }
      }

      // Buscar NFe atualizada com todos os relacionamentos
      return prisma.nfe.findUnique({
        where: { id },
        include: {
          emitente: {
            include: {
              municipio: { include: { estado: true } },
              estado: true,
            },
          },
          cliente: {
            include: {
              municipio: { include: { estado: true } },
              estado: true,
            },
          },
          itens: {
            include: {
              produto: { include: { ncm: true } },
              ncm: true,
              cfop: true,
              icms: { include: { cst: true, csosn: true } },
              ipi: { include: { cst: true } },
              pis: { include: { cst: true } },
              cofins: { include: { cst: true } },
            },
            orderBy: { numeroItem: 'asc' },
          },
          duplicatas: {
            orderBy: { numero: 'asc' },
          },
          pagamentos: true,
          eventos: {
            orderBy: { dataEvento: 'desc' },
          },
        },
      });
    });

    return nfeAtualizada;
  }

  async transmitir(id: string) {
    const nfe = await this.findOne(id);

    if (nfe.status !== 'DIGITACAO') {
      throw new BadRequestException('NFe não está em status de digitação');
    }

    try {
      // Gerar e transmitir NFe usando o microserviço
      const resultado = await this.nfeIntegrationService.generateNfeFromDatabase(id);

      // Salvar XMLs no storage se disponíveis
      if (resultado.data?.chave && resultado.data?.xml) {
        const chave = resultado.data.chave;

        // Salvar XML autorizado (único XML disponível no retorno)
        await this.fileStorageService.saveXml(chave, resultado.data.xml, 'authorized');
      }

      // Atualizar NFe com resultado da transmissão
      const nfeAtualizada = await this.prisma.nfe.update({
        where: { id },
        data: {
          chave: resultado.data?.chave,
          protocolo: resultado.data?.protocolo,
          dataAutorizacao: resultado.data?.dataAutorizacao ? new Date(resultado.data.dataAutorizacao) : null,
          status: resultado.success ? 'AUTORIZADA' : 'REJEITADA',
          motivoStatus: resultado.message,
          xmlAutorizado: resultado.data?.xml,
        },
      });

      return {
        success: resultado.success,
        nfe: nfeAtualizada,
        resultado,
      };
    } catch (error) {
      // Atualizar status para erro
      await this.prisma.nfe.update({
        where: { id },
        data: {
          status: 'ERRO',
          motivoStatus: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * Obter XML da NFe do storage
   */
  async getXmlFile(chave: string, type: 'generated' | 'signed' | 'authorized' = 'authorized'): Promise<string | null> {
    return this.fileStorageService.getXml(chave, type);
  }

  /**
   * Obter PDF da NFe do storage
   */
  async getPdfFile(chave: string): Promise<Buffer | null> {
    return this.fileStorageService.getPdf(chave);
  }

  /**
   * Obter informações dos arquivos da NFe
   */
  async getFileInfo(chave: string) {
    const xmlGenerated = await this.fileStorageService.getFileInfo(chave, 'xml', 'generated');
    const xmlSigned = await this.fileStorageService.getFileInfo(chave, 'xml', 'signed');
    const xmlAuthorized = await this.fileStorageService.getFileInfo(chave, 'xml', 'authorized');
    const pdf = await this.fileStorageService.getFileInfo(chave, 'pdf');

    return {
      chave,
      xml: {
        generated: xmlGenerated,
        signed: xmlSigned,
        authorized: xmlAuthorized,
      },
      pdf,
    };
  }

  /**
   * Salvar PDF da NFe
   */
  async savePdfFile(chave: string, pdf: Buffer) {
    return this.fileStorageService.savePdf(chave, pdf);
  }

  private async calcularTotais(createNfeDto: CreateNfeDto) {
    let valorProdutos = 0;
    let baseCalculoICMS = 0;
    let valorICMS = 0;
    let valorIPI = 0;
    let valorPIS = 0;
    let valorCOFINS = 0;

    for (const item of createNfeDto.itens) {
      const valorTotalItem = item.quantidadeComercial * item.valorUnitario;
      valorProdutos += valorTotalItem;
      
      baseCalculoICMS += item.icmsBaseCalculo || 0;
      valorICMS += item.icmsValor || 0;
      valorPIS += item.pisValor || 0;
      valorCOFINS += item.cofinsValor || 0;
    }

    const valorTotal = valorProdutos + 
                      (createNfeDto.valorFrete || 0) + 
                      (createNfeDto.valorSeguro || 0) + 
                      (createNfeDto.valorOutros || 0) - 
                      (createNfeDto.valorDesconto || 0);

    return {
      valorProdutos,
      valorTotal,
      baseCalculoICMS,
      valorICMS,
      valorIPI,
      valorPIS,
      valorCOFINS,
    };
  }

  /**
   * Buscar matriz fiscal aplicável para um item da NFe
   * Este método será usado pelo frontend ao adicionar itens
   */
  async buscarMatrizFiscalParaItem(params: {
    naturezaOperacaoId: string;
    clienteId: string;
    produtoId: string;
  }) {
    // Buscar emitente ativo
    const emitente = await this.emitenteService.getEmitenteAtivo();

    // Buscar cliente com estado
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: params.clienteId },
      include: { estado: true },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Buscar produto com NCM
    const produto = await this.prisma.produto.findUnique({
      where: { id: params.produtoId },
      include: { ncm: true },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Buscar estado do emitente
    const estadoEmitente = await this.prisma.estado.findUnique({
      where: { id: emitente.estadoId },
    });

    if (!estadoEmitente) {
      throw new NotFoundException('Estado do emitente não encontrado');
    }

    // Determinar tipo de cliente
    let tipoCliente: 'contribuinte' | 'nao_contribuinte' | 'exterior';
    if (cliente.indicadorIE === 1) {
      tipoCliente = 'contribuinte';
    } else if (cliente.indicadorIE === 2 || cliente.indicadorIE === 9) {
      tipoCliente = 'nao_contribuinte';
    } else {
      tipoCliente = 'nao_contribuinte'; // Default
    }

    // Buscar TODAS as matrizes fiscais aplicáveis (ICMS, PIS, COFINS, IPI)
    const matrizes = await this.prisma.matrizFiscal.findMany({
      where: {
        ativo: true,
        AND: [
          // CFOP específico
          { cfopId: { not: null } },
          // Regime: específico OU qualquer
          {
            OR: [
              { regimeTributario: emitente.regimeTributario },
              { regimeTributario: null },
            ],
          },
          // UF Destino: específica OU qualquer
          {
            OR: [{ ufDestino: cliente.estado.uf }, { ufDestino: null }],
          },
          // Tipo Item: específico OU qualquer
          {
            OR: [{ tipoItem: produto.tipoItem }, { tipoItem: null }],
          },
        ],
      },
      include: {
        cfop: true,
        cst: true,
        csosn: true,
        icmsCst: true,
        icmsCsosn: true,
        pisCst: true,
        cofinsCst: true,
        ipiCst: true,
      },
      orderBy: { prioridade: 'desc' },
    });

    if (!matrizes || matrizes.length === 0) {
      throw new BadRequestException(
        `Matriz fiscal não encontrada para o produto ${produto.codigo}. ` +
          `Configure matrizes fiscais (ICMS, PIS, COFINS) para: ` +
          `Regime=${emitente.regimeTributario}, UF Destino=${cliente.estado.uf}, TipoItem=${produto.tipoItem}`,
      );
    }

    // Consolidar dados de todas as matrizes
    const resultado: any = {
      fonte: 'matriz',
      matrizes: matrizes.map((m) => ({
        id: m.id,
        codigo: m.codigo,
        descricao: m.descricao,
      })),
    };

    // Buscar matriz de cada tipo
    const matrizICMS = matrizes.find((m) => m.codigo === 'ICMS');
    const matrizPIS = matrizes.find((m) => m.codigo === 'PIS');
    const matrizCOFINS = matrizes.find((m) => m.codigo === 'COFINS');
    const matrizIPI = matrizes.find((m) => m.codigo === 'IPI');

    // CFOP (pegar da primeira matriz que tiver)
    resultado.cfopId =
      matrizICMS?.cfopId ||
      matrizPIS?.cfopId ||
      matrizCOFINS?.cfopId ||
      matrizIPI?.cfopId;

    // ICMS
    if (matrizICMS) {
      resultado.matrizId = matrizICMS.id;
      resultado.icmsCstId = matrizICMS.cstId || matrizICMS.icmsCstId;
      resultado.icmsCsosnId = matrizICMS.csosnId || matrizICMS.icmsCsosnId;
      resultado.icmsAliquota = matrizICMS.aliquota || matrizICMS.icmsAliquota;
      resultado.icmsReducao = matrizICMS.reducaoBC || matrizICMS.icmsReducao;
      resultado.icmsModalidadeBC = matrizICMS.icmsModalidadeBC;
      resultado.icmsStAliquota = matrizICMS.icmsStAliquota;
      resultado.icmsStReducao = matrizICMS.icmsStReducao;
      resultado.icmsStModalidadeBC = matrizICMS.icmsStModalidadeBC;
      resultado.icmsStMva = matrizICMS.icmsStMva;
    }

    // PIS
    if (matrizPIS) {
      resultado.pisCstId = matrizPIS.cstId || matrizPIS.pisCstId;
      resultado.pisAliquota = matrizPIS.aliquota || matrizPIS.pisAliquota;
    }

    // COFINS
    if (matrizCOFINS) {
      resultado.cofinsCstId = matrizCOFINS.cstId || matrizCOFINS.cofinsCstId;
      resultado.cofinsAliquota =
        matrizCOFINS.aliquota || matrizCOFINS.cofinsAliquota;
    }

    // IPI
    if (matrizIPI) {
      resultado.ipiCstId = matrizIPI.cstId || matrizIPI.ipiCstId;
      resultado.ipiAliquota = matrizIPI.aliquota || matrizIPI.ipiAliquota;
    }

    // Nota: PIS e COFINS serão validados apenas na emissão da NFe
    // Aqui apenas retornamos os dados disponíveis da matriz fiscal

    return resultado;
  }

  /**
   * Aplicar matriz fiscal em todos os itens da NFe
   */
  async aplicarMatrizFiscal(
    nfeId: string,
    params: {
      naturezaOperacaoId: string;
      naturezaOperacao: string;
      cfopId: string;
    },
  ) {
    // Buscar NFe com itens
    const nfe = await this.prisma.nfe.findUnique({
      where: { id: nfeId },
      include: {
        itens: {
          include: {
            produto: {
              include: {
                ncm: true,
              },
            },
            icms: true,
            pis: true,
            cofins: true,
            ipi: true,
          },
        },
        cliente: {
          include: {
            estado: true,
          },
        },
        emitente: {
          include: {
            estado: true,
          },
        },
      },
    });

    if (!nfe) {
      throw new NotFoundException('NFe não encontrada');
    }

    const erros: string[] = [];
    const itensAtualizados: any[] = [];

    // Aplicar matriz fiscal para cada item
    for (const item of nfe.itens) {
      try {
        if (!item.produtoId) {
          erros.push(`Item ${item.codigo}: Produto não informado`);
          continue;
        }

        // Buscar matriz fiscal para o item
        const matriz = await this.buscarMatrizFiscalParaItem({
          naturezaOperacaoId: params.naturezaOperacaoId,
          clienteId: nfe.clienteId,
          produtoId: item.produtoId,
        });

        // Atualizar CFOP do item
        await this.prisma.nfeItem.update({
          where: { id: item.id },
          data: {
            cfopId: params.cfopId,
          },
        });

        // Atualizar ou criar ICMS
        if (item.icms?.id) {
          await this.prisma.nfeItemICMS.update({
            where: { id: item.icms.id },
            data: {
              cstId: matriz.icmsCstId || null,
              csosnId: matriz.icmsCsosnId || null,
              aliquota: matriz.icmsAliquota || null,
              percentualReducao: matriz.icmsReducao || null,
              modalidadeBC: matriz.icmsModalidadeBC || null,
              aliquotaST: matriz.icmsStAliquota || null,
              percentualReducaoST: matriz.icmsStReducao || null,
              modalidadeBCST: matriz.icmsStModalidadeBC || null,
              percentualMVAST: matriz.icmsStMva || null,
            },
          });
        }

        // Atualizar ou criar PIS
        if (item.pis?.id) {
          await this.prisma.nfeItemPIS.update({
            where: { id: item.pis.id },
            data: {
              cstId: matriz.pisCstId || null,
              aliquota: matriz.pisAliquota || null,
            },
          });
        }

        // Atualizar ou criar COFINS
        if (item.cofins?.id) {
          await this.prisma.nfeItemCOFINS.update({
            where: { id: item.cofins.id },
            data: {
              cstId: matriz.cofinsCstId || null,
              aliquota: matriz.cofinsAliquota || null,
            },
          });
        }

        // Atualizar ou criar IPI (se houver)
        if (matriz.ipiCstId && item.ipi?.id) {
          await this.prisma.nfeItemIPI.update({
            where: { id: item.ipi.id },
            data: {
              cstId: matriz.ipiCstId || null,
              aliquota: matriz.ipiAliquota || null,
            },
          });
        }

        itensAtualizados.push(item);
      } catch (error) {
        erros.push(
          `Item ${item.codigo}: ${error.message || 'Erro ao aplicar matriz fiscal'}`,
        );
      }
    }

    // Atualizar natureza de operação na NFe
    await this.prisma.nfe.update({
      where: { id: nfeId },
      data: {
        naturezaOperacao: params.naturezaOperacao,
      },
    });

    return {
      sucesso: erros.length === 0,
      itensAtualizados: itensAtualizados.length,
      totalItens: nfe.itens.length,
      erros,
    };
  }

  /**
   * Emitir NFe para SEFAZ
   */
  async emitir(nfeId: string) {
    // Buscar NFe
    const nfe = await this.findOne(nfeId);

    if (nfe.status !== 'DIGITACAO') {
      throw new BadRequestException(
        'Apenas NFes em digitação podem ser emitidas',
      );
    }

    // Validar campos obrigatórios
    if (!nfe.naturezaOperacao) {
      throw new BadRequestException('Natureza de operação é obrigatória');
    }

    // Validar itens
    for (const item of nfe.itens) {
      if (!item.cfopId) {
        throw new BadRequestException(
          `Item ${item.codigo}: CFOP é obrigatório`,
        );
      }
      if (!item.pis || !item.pis.cstId) {
        throw new BadRequestException(
          `Item ${item.codigo}: CST do PIS é obrigatório`,
        );
      }
      if (!item.cofins || !item.cofins.cstId) {
        throw new BadRequestException(
          `Item ${item.codigo}: CST do COFINS é obrigatório`,
        );
      }
    }

    // Emitir para SEFAZ (usando o método transmitir existente)
    const resultado = await this.transmitir(nfeId);

    return resultado;
  }
}
