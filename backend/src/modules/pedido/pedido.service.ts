import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Converter data string para DateTime ISO
   */
  private convertToDateTime(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;

    // Se já é uma data ISO completa, retorna
    if (dateString.includes('T')) {
      return new Date(dateString);
    }

    // Se é apenas data (YYYY-MM-DD), adiciona hora
    return new Date(`${dateString}T00:00:00.000Z`);
  }

  /**
   * Criar novo pedido
   */
  async create(createPedidoDto: CreatePedidoDto) {
    // Verificar se cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createPedidoDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar se número já existe
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { numero: createPedidoDto.numero },
    });

    if (pedidoExistente) {
      throw new BadRequestException('Já existe um pedido com este número');
    }

    // Criar pedido com itens e pagamentos
    const { itens, pagamentos, ...pedidoData } = createPedidoDto;

    // Validar e converter datas de pagamento para DateTime
    const pagamentosFormatados = pagamentos?.map(pag => {
      const dataVencimento = this.convertToDateTime(pag.dataVencimento as any);
      if (!dataVencimento) {
        throw new BadRequestException('Data de vencimento inválida');
      }
      return {
        parcela: pag.parcela,
        formaPagamentoId: pag.formaPagamentoId,
        dataVencimento,
        valor: pag.valor,
        observacoes: pag.observacoes,
      };
    });

    // Validar se todas as formas de pagamento existem
    if (pagamentosFormatados && pagamentosFormatados.length > 0) {
      const formasPagamentoIds = pagamentosFormatados.map(p => p.formaPagamentoId);
      const formasPagamento = await this.prisma.formaPagamento.findMany({
        where: { id: { in: formasPagamentoIds } },
      });

      if (formasPagamento.length !== formasPagamentoIds.length) {
        const idsEncontrados = formasPagamento.map(f => f.id);
        const idsNaoEncontrados = formasPagamentoIds.filter(id => !idsEncontrados.includes(id));
        throw new BadRequestException(
          `Forma(s) de pagamento não encontrada(s): ${idsNaoEncontrados.join(', ')}`
        );
      }
    }

    return this.prisma.pedido.create({
        data: {
          ...pedidoData,
          dataEmissao: this.convertToDateTime(pedidoData.dataEmissao as any) || new Date(),
          dataEntrega: pedidoData.dataEntrega
            ? this.convertToDateTime(pedidoData.dataEntrega as any)
            : undefined,
          itens: {
            create: itens,
          },
          pagamentos: pagamentosFormatados
            ? {
                create: pagamentosFormatados,
              }
            : undefined,
        },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            documento: true,
            email: true,
            telefone: true,
          },
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                codigo: true,
                descricao: true,
                unidade: true,
                valorUnitario: true,
              },
            },
          },
          orderBy: {
            numeroItem: 'asc',
          },
        },
        pagamentos: {
          include: {
            formaPagamento: {
              select: {
                id: true,
                codigo: true,
                descricao: true,
              },
            },
          },
          orderBy: {
            parcela: 'asc',
          },
        },
      },
    });
  }

  /**
   * Listar pedidos com paginação
   */
  async findAll(page = 1, limit = 20, clienteId?: string, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (clienteId) {
      where.clienteId = clienteId;
    }

    if (status) {
      where.status = status;
    }

    const [pedidos, total] = await Promise.all([
      this.prisma.pedido.findMany({
        where,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              documento: true,
            },
          },
          itens: {
            select: {
              id: true,
              numeroItem: true,
              quantidade: true,
              valorTotal: true,
            },
          },
          _count: {
            select: {
              itens: true,
              pagamentos: true,
              nfes: true,
            },
          },
        },
        orderBy: {
          dataEmissao: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return {
      data: pedidos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar pedido por ID
   */
  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                codigo: true,
                descricao: true,
                unidade: true,
                valorUnitario: true,
                ncmId: true,
                origem: true,
                tipoItem: true,
              },
            },
          },
          orderBy: {
            numeroItem: 'asc',
          },
        },
        pagamentos: {
          include: {
            formaPagamento: true,
          },
          orderBy: {
            parcela: 'asc',
          },
        },
        nfes: {
          select: {
            id: true,
            numero: true,
            serie: true,
            chave: true,
            status: true,
            dataEmissao: true,
            valorTotal: true,
          },
          orderBy: {
            dataEmissao: 'desc',
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return pedido;
  }

  /**
   * Atualizar pedido
   */
  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    // Verificar se pedido existe
    await this.findOne(id);

    const { itens, pagamentos, ...pedidoData } = updatePedidoDto;

    // Validar e converter datas de pagamento para DateTime
    const pagamentosFormatados = pagamentos?.map(pag => {
      const dataVencimento = this.convertToDateTime(pag.dataVencimento as any);
      if (!dataVencimento) {
        throw new BadRequestException('Data de vencimento inválida');
      }
      return {
        parcela: pag.parcela,
        formaPagamentoId: pag.formaPagamentoId,
        dataVencimento,
        valor: pag.valor,
        observacoes: pag.observacoes,
      };
    });

    // Validar se todas as formas de pagamento existem
    if (pagamentosFormatados && pagamentosFormatados.length > 0) {
      const formasPagamentoIds = pagamentosFormatados.map(p => p.formaPagamentoId);
      const formasPagamento = await this.prisma.formaPagamento.findMany({
        where: { id: { in: formasPagamentoIds } },
      });

      if (formasPagamento.length !== formasPagamentoIds.length) {
        const idsEncontrados = formasPagamento.map(f => f.id);
        const idsNaoEncontrados = formasPagamentoIds.filter(id => !idsEncontrados.includes(id));
        throw new BadRequestException(
          `Forma(s) de pagamento não encontrada(s): ${idsNaoEncontrados.join(', ')}`
        );
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};

    // Adicionar campos simples
    if (pedidoData.status !== undefined) updateData.status = pedidoData.status;
    if (pedidoData.vendedorNome !== undefined) updateData.vendedorNome = pedidoData.vendedorNome;
    if (pedidoData.enderecoEntrega !== undefined) updateData.enderecoEntrega = pedidoData.enderecoEntrega;
    if (pedidoData.subtotal !== undefined) updateData.subtotal = pedidoData.subtotal;
    if (pedidoData.valorDesconto !== undefined) updateData.valorDesconto = pedidoData.valorDesconto;
    if (pedidoData.valorFrete !== undefined) updateData.valorFrete = pedidoData.valorFrete;
    if (pedidoData.valorOutros !== undefined) updateData.valorOutros = pedidoData.valorOutros;
    if (pedidoData.valorTotal !== undefined) updateData.valorTotal = pedidoData.valorTotal;
    if (pedidoData.observacoes !== undefined) updateData.observacoes = pedidoData.observacoes;

    // Converter datas
    if (pedidoData.dataEmissao) {
      updateData.dataEmissao = this.convertToDateTime(pedidoData.dataEmissao as any);
    }
    if (pedidoData.dataEntrega) {
      updateData.dataEntrega = this.convertToDateTime(pedidoData.dataEntrega as any);
    }

    // Se tiver itens, deletar os antigos e criar novos
    if (itens) {
      updateData.itens = {
        deleteMany: {},
        create: itens,
      };
    }

    // Se tiver pagamentos, deletar os antigos e criar novos
    if (pagamentosFormatados) {
      updateData.pagamentos = {
        deleteMany: {},
        create: pagamentosFormatados,
      };
    }

    // Atualizar pedido
    return this.prisma.pedido.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
          orderBy: {
            numeroItem: 'asc',
          },
        },
        pagamentos: {
          include: {
            formaPagamento: true,
          },
          orderBy: {
            parcela: 'asc',
          },
        },
      },
    });
  }

  /**
   * Remover pedido
   */
  async remove(id: string) {
    // Verificar se pedido existe
    await this.findOne(id);

    // Verificar se já tem NFe gerada
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        nfes: true,
      },
    });

    if (pedido && pedido.nfes && pedido.nfes.length > 0) {
      throw new BadRequestException('Não é possível excluir pedido que já possui NFe gerada');
    }

    return this.prisma.pedido.delete({
      where: { id },
    });
  }

  /**
   * Gerar próximo número de pedido
   */
  async getProximoNumero(): Promise<number> {
    const ultimoPedido = await this.prisma.pedido.findFirst({
      orderBy: {
        numero: 'desc',
      },
      select: {
        numero: true,
      },
    });

    return ultimoPedido ? ultimoPedido.numero + 1 : 1;
  }
}

