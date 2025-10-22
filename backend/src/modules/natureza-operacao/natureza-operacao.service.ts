import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNaturezaOperacaoDto } from './dto/create-natureza-operacao.dto';
import { UpdateNaturezaOperacaoDto } from './dto/update-natureza-operacao.dto';

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

    // Verificar CFOPs se fornecidos
    if (createNaturezaOperacaoDto.cfopDentroEstadoId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: createNaturezaOperacaoDto.cfopDentroEstadoId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP dentro do estado não encontrado');
      }
    }

    if (createNaturezaOperacaoDto.cfopForaEstadoId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: createNaturezaOperacaoDto.cfopForaEstadoId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP fora do estado não encontrado');
      }
    }

    if (createNaturezaOperacaoDto.cfopExteriorId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: createNaturezaOperacaoDto.cfopExteriorId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP exterior não encontrado');
      }
    }

    return this.prisma.naturezaOperacao.create({
      data: createNaturezaOperacaoDto,
      include: {
        cfopDentroEstado: true,
        cfopForaEstado: true,
        cfopExterior: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      AND: [
        { ativo: true },
        {
          OR: [
            { codigo: { contains: search, mode: 'insensitive' as const } },
            { descricao: { contains: search, mode: 'insensitive' as const } },
          ],
        },
      ],
    } : { ativo: true };

    const [naturezas, total] = await Promise.all([
      this.prisma.naturezaOperacao.findMany({
        where,
        include: {
          cfopDentroEstado: true,
          cfopForaEstado: true,
          cfopExterior: true,
        },
        orderBy: { descricao: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.naturezaOperacao.count({ where }),
    ]);

    return {
      data: naturezas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const natureza = await this.prisma.naturezaOperacao.findUnique({
      where: { id },
      include: {
        cfopDentroEstado: true,
        cfopForaEstado: true,
        cfopExterior: true,
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

    // Verificar CFOPs se fornecidos
    if (updateNaturezaOperacaoDto.cfopDentroEstadoId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: updateNaturezaOperacaoDto.cfopDentroEstadoId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP dentro do estado não encontrado');
      }
    }

    if (updateNaturezaOperacaoDto.cfopForaEstadoId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: updateNaturezaOperacaoDto.cfopForaEstadoId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP fora do estado não encontrado');
      }
    }

    if (updateNaturezaOperacaoDto.cfopExteriorId) {
      const cfop = await this.prisma.cFOP.findUnique({
        where: { id: updateNaturezaOperacaoDto.cfopExteriorId },
      });
      if (!cfop) {
        throw new NotFoundException('CFOP exterior não encontrado');
      }
    }

    return this.prisma.naturezaOperacao.update({
      where: { id },
      data: updateNaturezaOperacaoDto,
      include: {
        cfopDentroEstado: true,
        cfopForaEstado: true,
        cfopExterior: true,
      },
    });
  }

  async remove(id: string) {
    // Verificar se existe
    await this.findOne(id);

    // Soft delete
    return this.prisma.naturezaOperacao.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async getAtivas() {
    return this.prisma.naturezaOperacao.findMany({
      where: { ativo: true },
      include: {
        cfopDentroEstado: true,
        cfopForaEstado: true,
        cfopExterior: true,
      },
      orderBy: { descricao: 'asc' },
    });
  }
}

