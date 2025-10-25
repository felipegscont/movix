import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNaturezaOperacaoDto } from './dto/create-natureza-operacao.dto';
import { UpdateNaturezaOperacaoDto } from './dto/update-natureza-operacao.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NaturezaOperacaoService {
  constructor(private prisma: PrismaService) {}

  async create(createNaturezaOperacaoDto: CreateNaturezaOperacaoDto) {
    // Verificar se código já existe
    const existing = await this.prisma.naturezaOperacao.findUnique({
      where: { codigo: createNaturezaOperacaoDto.codigo },
    });

    if (existing) {
      throw new ConflictException('Código da natureza de operação já cadastrado');
    }

    return this.prisma.naturezaOperacao.create({
      data: {
        codigo: createNaturezaOperacaoDto.codigo,
        nome: createNaturezaOperacaoDto.nome,
        tipo: createNaturezaOperacaoDto.tipo ?? 1,
        ativa: createNaturezaOperacaoDto.ativa ?? true,
        dentroEstado: createNaturezaOperacaoDto.dentroEstado ?? false,
        propria: createNaturezaOperacaoDto.propria ?? false,
        produtosExcecao: createNaturezaOperacaoDto.produtosExcecao ? JSON.parse(JSON.stringify(createNaturezaOperacaoDto.produtosExcecao)) : null,
        informacoesAdicionais: createNaturezaOperacaoDto.informacoesAdicionais,
      },
      include: {
        cfops: {
          include: {
            cfop: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Number(limit) || 10);
    const skip = (validPage - 1) * validLimit;

    const where = search ? {
      AND: [
        { ativa: true },
        {
          OR: [
            { codigo: { contains: search, mode: 'insensitive' as const } },
            { nome: { contains: search, mode: 'insensitive' as const } },
          ],
        },
      ],
    } : { ativa: true };

    const [naturezas, total] = await Promise.all([
      this.prisma.naturezaOperacao.findMany({
        where,
        include: {
          cfops: {
            include: {
              cfop: true,
            },
          },
        },
        orderBy: { nome: 'asc' },
        skip,
        take: validLimit,
      }),
      this.prisma.naturezaOperacao.count({ where }),
    ]);

    return {
      data: naturezas,
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async findOne(id: string) {
    const natureza = await this.prisma.naturezaOperacao.findUnique({
      where: { id },
      include: {
        cfops: {
          include: {
            cfop: true,
          },
        },
      },
    });

    if (!natureza) {
      throw new NotFoundException('Natureza de operação não encontrada');
    }

    return natureza;
  }

  async update(id: string, updateNaturezaOperacaoDto: UpdateNaturezaOperacaoDto) {
    // Verificar se existe
    await this.findOne(id);

    // Se está alterando o código, verificar se não existe outro com o mesmo código
    if (updateNaturezaOperacaoDto.codigo) {
      const existing = await this.prisma.naturezaOperacao.findUnique({
        where: { codigo: updateNaturezaOperacaoDto.codigo },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Código da natureza de operação já cadastrado');
      }
    }

    const updateData: any = { ...updateNaturezaOperacaoDto };

    return this.prisma.naturezaOperacao.update({
      where: { id },
      data: updateData,
      include: {
        cfops: {
          include: {
            cfop: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Verificar se existe
    await this.findOne(id);

    // Soft delete
    return this.prisma.naturezaOperacao.update({
      where: { id },
      data: { ativa: false },
    });
  }

  async getAtivas() {
    return this.prisma.naturezaOperacao.findMany({
      where: { ativa: true },
      include: {
        cfops: {
          include: {
            cfop: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  // Métodos para gerenciar CFOPs
  async addCFOP(naturezaId: string, cfopId: string, padrao: boolean = false) {
    // Verificar se a natureza existe
    await this.findOne(naturezaId);

    // Verificar se o CFOP existe
    const cfop = await this.prisma.cFOP.findUnique({
      where: { id: cfopId },
    });

    if (!cfop) {
      throw new NotFoundException('CFOP não encontrado');
    }

    // Verificar se já está vinculado
    const existing = await this.prisma.naturezaOperacaoCFOP.findUnique({
      where: {
        naturezaOperacaoId_cfopId: {
          naturezaOperacaoId: naturezaId,
          cfopId: cfopId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('CFOP já está vinculado a esta natureza de operação');
    }

    // Se for padrão, desmarcar outros
    if (padrao) {
      await this.prisma.naturezaOperacaoCFOP.updateMany({
        where: { naturezaOperacaoId: naturezaId },
        data: { padrao: false },
      });
    }

    return this.prisma.naturezaOperacaoCFOP.create({
      data: {
        naturezaOperacaoId: naturezaId,
        cfopId: cfopId,
        padrao: padrao,
      },
      include: {
        cfop: true,
      },
    });
  }

  async removeCFOP(naturezaId: string, cfopId: string) {
    const existing = await this.prisma.naturezaOperacaoCFOP.findUnique({
      where: {
        naturezaOperacaoId_cfopId: {
          naturezaOperacaoId: naturezaId,
          cfopId: cfopId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('CFOP não está vinculado a esta natureza de operação');
    }

    return this.prisma.naturezaOperacaoCFOP.delete({
      where: {
        naturezaOperacaoId_cfopId: {
          naturezaOperacaoId: naturezaId,
          cfopId: cfopId,
        },
      },
    });
  }

  async updateCFOPPadrao(naturezaId: string, cfopId: string, padrao: boolean) {
    const existing = await this.prisma.naturezaOperacaoCFOP.findUnique({
      where: {
        naturezaOperacaoId_cfopId: {
          naturezaOperacaoId: naturezaId,
          cfopId: cfopId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('CFOP não está vinculado a esta natureza de operação');
    }

    // Se for padrão, desmarcar outros
    if (padrao) {
      await this.prisma.naturezaOperacaoCFOP.updateMany({
        where: {
          naturezaOperacaoId: naturezaId,
          id: { not: existing.id },
        },
        data: { padrao: false },
      });
    }

    return this.prisma.naturezaOperacaoCFOP.update({
      where: {
        naturezaOperacaoId_cfopId: {
          naturezaOperacaoId: naturezaId,
          cfopId: cfopId,
        },
      },
      data: { padrao: padrao },
      include: {
        cfop: true,
      },
    });
  }

  async getCFOPs(naturezaId: string) {
    return this.prisma.naturezaOperacaoCFOP.findMany({
      where: { naturezaOperacaoId: naturezaId },
      include: {
        cfop: true,
      },
      orderBy: [
        { padrao: 'desc' },
        { cfop: { codigo: 'asc' } },
      ],
    });
  }
}

