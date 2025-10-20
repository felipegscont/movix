import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Injectable()
export class FornecedorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFornecedorDto: CreateFornecedorDto) {
    return this.prisma.fornecedor.create({
      data: createFornecedorDto,
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' as const } },
            { documento: { contains: search, mode: 'insensitive' as const } },
            { nomeFantasia: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.fornecedor.findMany({
        where,
        include: {
          municipio: {
            include: { estado: true },
          },
          estado: true,
        },
        skip,
        take: limit,
        orderBy: { nome: 'asc' },
      }),
      this.prisma.fornecedor.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: { id },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });

    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    return fornecedor;
  }

  async findByDocumento(documento: string) {
    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: { documento },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });

    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    return fornecedor;
  }

  async getFornecedoresForSelect() {
    const fornecedores = await this.prisma.fornecedor.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true,
        documento: true,
      },
      orderBy: { nome: 'asc' },
    });

    return { data: fornecedores };
  }

  async update(id: string, updateFornecedorDto: UpdateFornecedorDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.fornecedor.update({
      where: { id },
      data: updateFornecedorDto,
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.fornecedor.delete({
      where: { id },
    });
  }
}

