import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoDto } from './dto/update-orcamento.dto';
import { PedidoService } from '../pedido/pedido.service';

@Injectable()
export class OrcamentoService {
  constructor(
    private prisma: PrismaService,
    private pedidoService: PedidoService,
  ) {}

  /**
   * Criar novo orçamento
   */
  async create(createOrcamentoDto: CreateOrcamentoDto) {
    // Verificar se cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createOrcamentoDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar se número já existe
    const orcamentoExistente = await this.prisma.orcamento.findUnique({
      where: { numero: createOrcamentoDto.numero },
    });

    if (orcamentoExistente) {
      throw new BadRequestException('Já existe um orçamento com este número');
    }

    // Criar orçamento com itens
    const { itens, ...orcamentoData } = createOrcamentoDto;

    return this.prisma.orcamento.create({
      data: {
        ...orcamentoData,
        itens: {
          create: itens,
        },
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
      },
    });
  }

  /**
   * Listar orçamentos com paginação
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

    const [orcamentos, total] = await Promise.all([
      this.prisma.orcamento.findMany({
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
          pedido: {
            select: {
              id: true,
              numero: true,
              status: true,
            },
          },
          _count: {
            select: {
              itens: true,
            },
          },
        },
        orderBy: {
          dataEmissao: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.orcamento.count({ where }),
    ]);

    return {
      data: orcamentos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar orçamento por ID
   */
  async findOne(id: string) {
    const orcamento = await this.prisma.orcamento.findUnique({
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
        pedido: {
          select: {
            id: true,
            numero: true,
            status: true,
            dataEmissao: true,
            valorTotal: true,
          },
        },
      },
    });

    if (!orcamento) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return orcamento;
  }

  /**
   * Atualizar orçamento
   */
  async update(id: string, updateOrcamentoDto: UpdateOrcamentoDto) {
    // Verificar se orçamento existe
    const orcamentoExistente = await this.findOne(id);

    // Não permitir editar orçamento já convertido
    if (orcamentoExistente.status === 'APROVADO' && orcamentoExistente.pedidoId) {
      throw new BadRequestException('Não é possível editar orçamento já convertido em pedido');
    }

    const { itens, ...orcamentoData } = updateOrcamentoDto;

    // Atualizar orçamento
    return this.prisma.orcamento.update({
      where: { id },
      data: {
        ...orcamentoData,
        // Se tiver itens, deletar os antigos e criar novos
        ...(itens && {
          itens: {
            deleteMany: {},
            create: itens,
          },
        }),
      },
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
      },
    });
  }

  /**
   * Remover orçamento
   */
  async remove(id: string) {
    // Verificar se orçamento existe
    const orcamento = await this.findOne(id);

    // Não permitir excluir orçamento já convertido
    if (orcamento.status === 'APROVADO' && orcamento.pedidoId) {
      throw new BadRequestException('Não é possível excluir orçamento já convertido em pedido');
    }

    return this.prisma.orcamento.delete({
      where: { id },
    });
  }

  /**
   * Cancelar orçamento
   */
  async cancelar(id: string) {
    const orcamento = await this.findOne(id);

    if (orcamento.status === 'CANCELADO') {
      throw new BadRequestException('Orçamento já está cancelado');
    }

    if (orcamento.status === 'APROVADO' && orcamento.pedidoId) {
      throw new BadRequestException('Não é possível cancelar orçamento já convertido em pedido');
    }

    return this.prisma.orcamento.update({
      where: { id },
      data: {
        status: 'CANCELADO',
      },
      include: {
        cliente: true,
        itens: true,
      },
    });
  }

  /**
   * Gerar próximo número de orçamento
   */
  async getProximoNumero(): Promise<number> {
    const ultimoOrcamento = await this.prisma.orcamento.findFirst({
      orderBy: {
        numero: 'desc',
      },
      select: {
        numero: true,
      },
    });

    return ultimoOrcamento ? ultimoOrcamento.numero + 1 : 1;
  }

  /**
   * Converter orçamento em pedido
   */
  async converterEmPedido(id: string) {
    // Buscar orçamento completo
    const orcamento = await this.findOne(id);

    // Validações
    if (orcamento.status === 'CANCELADO') {
      throw new BadRequestException('Não é possível converter orçamento cancelado');
    }

    if (orcamento.status === 'APROVADO' && orcamento.pedidoId) {
      throw new BadRequestException('Orçamento já foi convertido em pedido');
    }

    // Verificar se orçamento está vencido
    const hoje = new Date();
    const dataValidade = new Date(orcamento.dataValidade);
    if (dataValidade < hoje) {
      throw new BadRequestException('Orçamento vencido. Atualize a data de validade antes de converter.');
    }

    // Obter próximo número de pedido
    const numeroPedido = await this.pedidoService.getProximoNumero();

    // Criar pedido a partir do orçamento
    const pedido = await this.pedidoService.create({
      numero: numeroPedido,
      dataEmissao: new Date().toISOString(),
      dataEntrega: new Date(orcamento.dataValidade).toISOString(), // Usar data de validade como entrega
      status: 'ABERTO',
      clienteId: orcamento.clienteId,
      vendedorNome: orcamento.vendedorNome || undefined,
      subtotal: Number(orcamento.subtotal),
      valorDesconto: Number(orcamento.valorDesconto),
      valorFrete: Number(orcamento.valorFrete),
      valorOutros: Number(orcamento.valorOutros),
      valorTotal: Number(orcamento.valorTotal),
      observacoes: `Convertido do Orçamento #${orcamento.numero}${orcamento.observacoes ? '\n\n' + orcamento.observacoes : ''}`,
      itens: orcamento.itens.map((item) => ({
        numeroItem: item.numeroItem,
        produtoId: item.produtoId,
        codigo: item.codigo,
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        valorDesconto: Number(item.valorDesconto),
        valorTotal: Number(item.valorTotal),
        observacoes: item.observacoes || undefined,
      })),
      pagamentos: [], // Pagamentos serão definidos no pedido
    });

    // Atualizar orçamento com status APROVADO e vincular ao pedido
    await this.prisma.orcamento.update({
      where: { id },
      data: {
        status: 'APROVADO',
        pedidoId: pedido.id,
        dataConversao: new Date(),
      },
    });

    return {
      orcamento: await this.findOne(id),
      pedido,
    };
  }
}

