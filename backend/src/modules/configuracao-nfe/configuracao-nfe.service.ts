import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConfiguracaoNfeDto } from './dto/create-configuracao-nfe.dto';
import { UpdateConfiguracaoNfeDto } from './dto/update-configuracao-nfe.dto';

@Injectable()
export class ConfiguracaoNfeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Buscar configuração de NFe por emitente
   */
  async findByEmitente(emitenteId: string) {
    return this.prisma.configuracaoNfe.findUnique({
      where: { emitenteId },
    });
  }

  /**
   * Criar ou atualizar configuração de NFe
   */
  async upsert(emitenteId: string, data: UpdateConfiguracaoNfeDto) {
    return this.prisma.configuracaoNfe.upsert({
      where: { emitenteId },
      create: {
        emitenteId,
        ...data,
      },
      update: data,
    });
  }

  /**
   * Incrementar próximo número
   */
  async incrementarProximoNumero(emitenteId: string) {
    const config = await this.prisma.configuracaoNfe.findUnique({
      where: { emitenteId },
    });

    if (!config) {
      throw new NotFoundException('Configuração de NFe não encontrada');
    }

    return this.prisma.configuracaoNfe.update({
      where: { emitenteId },
      data: {
        proximoNumero: config.proximoNumero + 1,
      },
    });
  }

  /**
   * Deletar configuração
   */
  async remove(emitenteId: string) {
    return this.prisma.configuracaoNfe.delete({
      where: { emitenteId },
    });
  }
}

