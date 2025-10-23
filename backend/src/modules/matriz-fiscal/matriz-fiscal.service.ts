import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatrizFiscalDto } from './dto/create-matriz-fiscal.dto';
import { UpdateMatrizFiscalDto } from './dto/update-matriz-fiscal.dto';

@Injectable()
export class MatrizFiscalService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova matriz fiscal
   */
  async create(createMatrizFiscalDto: CreateMatrizFiscalDto) {
    // Verificar se código já existe
    const existente = await this.prisma.matrizFiscal.findUnique({
      where: { codigo: createMatrizFiscalDto.codigo },
    });

    if (existente) {
      throw new BadRequestException('Código de matriz fiscal já existe');
    }

    // Verificar CFOP
    const cfop = await this.prisma.cFOP.findUnique({
      where: { id: createMatrizFiscalDto.cfopId },
    });

    if (!cfop) {
      throw new NotFoundException('CFOP não encontrado');
    }

    // Verificar Natureza de Operação se fornecida
    if (createMatrizFiscalDto.naturezaOperacaoId) {
      const natureza = await this.prisma.naturezaOperacao.findUnique({
        where: { id: createMatrizFiscalDto.naturezaOperacaoId },
      });

      if (!natureza) {
        throw new NotFoundException('Natureza de Operação não encontrada');
      }
    }

    // Verificar NCM se fornecido
    if (createMatrizFiscalDto.ncmId) {
      const ncm = await this.prisma.nCM.findUnique({
        where: { id: createMatrizFiscalDto.ncmId },
      });

      if (!ncm) {
        throw new NotFoundException('NCM não encontrado');
      }
    }

    // Criar matriz fiscal
    return this.prisma.matrizFiscal.create({
      data: createMatrizFiscalDto,
      include: {
        naturezaOperacao: true,
        cfop: true,
        ncm: true,
        icmsCst: true,
        icmsCsosn: true,
        ipiCst: true,
        pisCst: true,
        cofinsCst: true,
      },
    });
  }

  /**
   * Listar todas as matrizes fiscais com filtros
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    naturezaOperacaoId?: string;
    ufOrigem?: string;
    ufDestino?: string;
    tipoCliente?: string;
    ativo?: boolean;
  }) {
    const { skip = 0, take = 50, ...filters } = params || {};

    const where: any = {};

    if (filters.naturezaOperacaoId) {
      where.naturezaOperacaoId = filters.naturezaOperacaoId;
    }

    if (filters.ufOrigem) {
      where.ufOrigem = filters.ufOrigem;
    }

    if (filters.ufDestino) {
      where.ufDestino = filters.ufDestino;
    }

    if (filters.tipoCliente) {
      where.tipoCliente = filters.tipoCliente;
    }

    if (filters.ativo !== undefined) {
      where.ativo = filters.ativo;
    }

    const [matrizes, total] = await Promise.all([
      this.prisma.matrizFiscal.findMany({
        where,
        skip,
        take,
        include: {
          naturezaOperacao: true,
          cfop: true,
          ncm: true,
          icmsCst: true,
          icmsCsosn: true,
          ipiCst: true,
          pisCst: true,
          cofinsCst: true,
        },
        orderBy: { prioridade: 'desc' },
      }),
      this.prisma.matrizFiscal.count({ where }),
    ]);

    return {
      data: matrizes,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  /**
   * Buscar matriz fiscal por ID
   */
  async findOne(id: string) {
    const matriz = await this.prisma.matrizFiscal.findUnique({
      where: { id },
      include: {
        naturezaOperacao: true,
        cfop: true,
        ncm: true,
        icmsCst: true,
        icmsCsosn: true,
        ipiCst: true,
        pisCst: true,
        cofinsCst: true,
      },
    });

    if (!matriz) {
      throw new NotFoundException('Matriz fiscal não encontrada');
    }

    return matriz;
  }

  /**
   * Atualizar matriz fiscal
   */
  async update(id: string, updateMatrizFiscalDto: UpdateMatrizFiscalDto) {
    // Verificar se existe
    await this.findOne(id);

    // Verificar código duplicado se estiver sendo alterado
    if (updateMatrizFiscalDto.codigo) {
      const existente = await this.prisma.matrizFiscal.findFirst({
        where: {
          codigo: updateMatrizFiscalDto.codigo,
          id: { not: id },
        },
      });

      if (existente) {
        throw new BadRequestException('Código de matriz fiscal já existe');
      }
    }

    // Atualizar
    return this.prisma.matrizFiscal.update({
      where: { id },
      data: updateMatrizFiscalDto,
      include: {
        naturezaOperacao: true,
        cfop: true,
        ncm: true,
        icmsCst: true,
        icmsCsosn: true,
        ipiCst: true,
        pisCst: true,
        cofinsCst: true,
      },
    });
  }

  /**
   * Remover matriz fiscal
   */
  async remove(id: string) {
    // Verificar se existe
    await this.findOne(id);

    // Remover
    return this.prisma.matrizFiscal.delete({
      where: { id },
    });
  }

  /**
   * Buscar matriz fiscal aplicável baseado em condições
   * Este é o método principal que será usado ao adicionar itens na NFe
   */
  async buscarMatrizAplicavel(params: {
    naturezaOperacaoId: string;
    ufOrigem: string;
    ufDestino: string;
    tipoCliente: 'contribuinte' | 'nao_contribuinte' | 'exterior';
    ncmId: string;
    regimeTributario: number;
  }) {
    const matrizes = await this.prisma.matrizFiscal.findMany({
      where: {
        ativo: true,
        AND: [
          // Natureza: específica OU qualquer
          {
            OR: [
              { naturezaOperacaoId: params.naturezaOperacaoId },
              { naturezaOperacaoId: null },
            ],
          },
          // UF Origem: específica OU qualquer
          {
            OR: [{ ufOrigem: params.ufOrigem }, { ufOrigem: null }],
          },
          // UF Destino: específica OU qualquer
          {
            OR: [{ ufDestino: params.ufDestino }, { ufDestino: null }],
          },
          // Tipo Cliente: específico OU qualquer
          {
            OR: [{ tipoCliente: params.tipoCliente }, { tipoCliente: null }],
          },
          // NCM: específico OU qualquer
          {
            OR: [{ ncmId: params.ncmId }, { ncmId: null }],
          },
          // Regime: específico OU qualquer
          {
            OR: [
              { regimeTributario: params.regimeTributario },
              { regimeTributario: null },
            ],
          },
        ],
      },
      include: {
        cfop: true,
        icmsCst: true,
        icmsCsosn: true,
        pisCst: true,
        cofinsCst: true,
        ipiCst: true,
      },
      orderBy: { prioridade: 'desc' }, // Mais específica primeiro
    });

    // Retornar a primeira (mais específica)
    return matrizes[0] || null;
  }
}

