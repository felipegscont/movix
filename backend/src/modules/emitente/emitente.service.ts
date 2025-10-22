import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmitenteDto } from './dto/create-emitente.dto';
import { UpdateEmitenteDto } from './dto/update-emitente.dto';

@Injectable()
export class EmitenteService {
  constructor(private prisma: PrismaService) {}

  async create(createEmitenteDto: CreateEmitenteDto) {
    // Verificar se CNPJ já existe
    const existingEmitente = await this.prisma.emitente.findUnique({
      where: { cnpj: createEmitenteDto.cnpj },
    });

    if (existingEmitente) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    // Verificar se município e estado existem
    const municipio = await this.prisma.municipio.findUnique({
      where: { id: createEmitenteDto.municipioId },
      include: { estado: true },
    });

    if (!municipio) {
      throw new NotFoundException('Município não encontrado');
    }

    if (municipio.estadoId !== createEmitenteDto.estadoId) {
      throw new ConflictException('Município não pertence ao estado informado');
    }

    return this.prisma.emitente.create({
      data: createEmitenteDto,
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });
  }

  async findAll() {
    return this.prisma.emitente.findMany({
      where: { ativo: true },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
      orderBy: { razaoSocial: 'asc' },
    });
  }

  async findOne(id: string) {
    const emitente = await this.prisma.emitente.findUnique({
      where: { id },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });

    if (!emitente) {
      throw new NotFoundException('Emitente não encontrado');
    }

    return emitente;
  }

  async findByCnpj(cnpj: string) {
    const emitente = await this.prisma.emitente.findUnique({
      where: { cnpj },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });

    if (!emitente) {
      throw new NotFoundException('Emitente não encontrado');
    }

    return emitente;
  }

  async update(id: string, updateEmitenteDto: UpdateEmitenteDto) {
    const emitente = await this.findOne(id);

    // Se está alterando CNPJ, verificar se não existe outro com o mesmo
    if (updateEmitenteDto.cnpj && updateEmitenteDto.cnpj !== emitente.cnpj) {
      const existingEmitente = await this.prisma.emitente.findUnique({
        where: { cnpj: updateEmitenteDto.cnpj },
      });

      if (existingEmitente) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    // Verificar município e estado se fornecidos
    if (updateEmitenteDto.municipioId || updateEmitenteDto.estadoId) {
      const municipioId = updateEmitenteDto.municipioId || emitente.municipioId;
      const estadoId = updateEmitenteDto.estadoId || emitente.estadoId;

      const municipio = await this.prisma.municipio.findUnique({
        where: { id: municipioId },
        include: { estado: true },
      });

      if (!municipio) {
        throw new NotFoundException('Município não encontrado');
      }

      if (municipio.estadoId !== estadoId) {
        throw new ConflictException('Município não pertence ao estado informado');
      }
    }

    return this.prisma.emitente.update({
      where: { id },
      data: updateEmitenteDto,
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.emitente.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async getProximoNumeroNfe(emitenteId: string): Promise<number> {
    const emitente = await this.findOne(emitenteId);

    const proximoNumero = emitente.proximoNumeroNfe;

    // Incrementar o próximo número
    await this.prisma.emitente.update({
      where: { id: emitenteId },
      data: { proximoNumeroNfe: proximoNumero + 1 },
    });

    return proximoNumero;
  }

  async getEmitenteAtivo() {
    const emitente = await this.prisma.emitente.findFirst({
      where: { ativo: true },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
      orderBy: { createdAt: 'asc' }, // Pega o primeiro cadastrado
    });

    if (!emitente) {
      throw new NotFoundException('Nenhum emitente ativo encontrado. Configure um emitente antes de emitir NFe.');
    }

    return emitente;
  }

  async updateCertificadoPath(id: string, certificadoPath: string) {
    const emitente = await this.prisma.emitente.findUnique({
      where: { id },
    });

    if (!emitente) {
      throw new NotFoundException('Emitente não encontrado');
    }

    return this.prisma.emitente.update({
      where: { id },
      data: { certificadoPath },
      include: {
        municipio: {
          include: { estado: true },
        },
        estado: true,
      },
    });
  }

  async saveCertificadoInfo(
    emitenteId: string,
    certificadoData: {
      arquivoPath: string;
      arquivoNome: string;
      arquivoTamanho: number;
      senha: string;
      cnpjCertificado?: string;
      razaoSocialCertificado?: string;
      titular?: string;
      emissor?: string;
      numeroSerie?: string;
      validoDe: Date;
      validoAte: Date;
      diasParaVencimento: number;
      expirado: boolean;
      proximoVencimento: boolean;
    },
  ) {
    // Desativar certificados anteriores
    await this.prisma.certificadoDigital.updateMany({
      where: { emitenteId, ativo: true },
      data: { ativo: false },
    });

    // Criar novo registro de certificado
    return this.prisma.certificadoDigital.create({
      data: {
        emitenteId,
        ...certificadoData,
      },
    });
  }

  async getCertificadoAtivo(emitenteId: string) {
    return this.prisma.certificadoDigital.findFirst({
      where: {
        emitenteId,
        ativo: true,
        expirado: false,
      },
      orderBy: { dataUpload: 'desc' },
    });
  }
}
