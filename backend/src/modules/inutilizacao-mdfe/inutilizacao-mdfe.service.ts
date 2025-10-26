import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateInutilizacaoMdfeDto } from './dto/update-inutilizacao-mdfe.dto';

@Injectable()
export class InutilizacaoMdfeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Buscar inutilização de NFe por emitente
   */
  async findByEmitente(emitenteId: string) {
    return this.prisma.inutilizacaoNfe.findUnique({
      where: { emitenteId },
    });
  }

  /**
   * Criar ou atualizar inutilização de NFe
   */
  async upsert(emitenteId: string, data: UpdateInutilizacaoMdfeDto) {
    return this.prisma.inutilizacaoNfe.upsert({
      where: { emitenteId },
      create: {
        emitenteId,
        ...data,
      },
      update: data,
    });
  }

  /**
   * Remover inutilização
   */
  async remove(emitenteId: string) {
    const inutilizacao = await this.prisma.inutilizacaoNfe.findUnique({
      where: { emitenteId },
    });

    if (!inutilizacao) {
      throw new NotFoundException('Inutilização de NFe não encontrada');
    }

    return this.prisma.inutilizacaoNfe.delete({
      where: { emitenteId },
    });
  }
}

