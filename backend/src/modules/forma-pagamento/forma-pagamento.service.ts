import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FormaPagamentoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.formaPagamento.findMany({
      where: { ativo: true },
      orderBy: { codigo: 'asc' },
    });
  }
}

