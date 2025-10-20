import { Controller, Get, Query, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IbgeCacheService } from '../external-apis/services/ibge-cache.service';

@Controller()
export class AuxiliaresController {
  private readonly logger = new Logger(AuxiliaresController.name);

  constructor(
    private prisma: PrismaService,
    private ibgeCacheService: IbgeCacheService,
  ) {}

  @Get('estados')
  async getEstados(@Query('search') search?: string) {
    try {
      // Verifica se há estados no banco
      const count = await this.prisma.estado.count();

      // Se não houver estados, popula via API IBGE
      if (count === 0) {
        this.logger.log('Nenhum estado encontrado, populando via API IBGE...');
        await this.ibgeCacheService.getEstados();
      }

      const where = search ? {
        OR: [
          { nome: { contains: search, mode: 'insensitive' as const } },
          { uf: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {};

      const estados = await this.prisma.estado.findMany({
        where,
        orderBy: { nome: 'asc' },
      });

      return { data: estados };
    } catch (error) {
      this.logger.error(`Erro ao buscar estados: ${error.message}`);
      throw error;
    }
  }

  @Get('municipios')
  async getMunicipios(
    @Query('estadoId') estadoId?: string,
    @Query('search') search?: string,
  ) {
    try {
      const where: any = {};

      if (estadoId) {
        where.estadoId = estadoId;

        // Verifica se há municípios para este estado
        const count = await this.prisma.municipio.count({ where: { estadoId } });

        // Se não houver municípios, popula via API IBGE
        if (count === 0) {
          const estado = await this.prisma.estado.findUnique({
            where: { id: estadoId },
          });

          if (estado) {
            this.logger.log(`Nenhum município encontrado para ${estado.uf}, populando via API IBGE...`);
            await this.ibgeCacheService.getMunicipiosByEstado(estado.uf);
          }
        }
      }

      if (search) {
        where.nome = { contains: search, mode: 'insensitive' as const };
      }

      const municipios = await this.prisma.municipio.findMany({
        where,
        include: { estado: true },
        orderBy: { nome: 'asc' },
        take: 1000, // Aumentado para retornar todos os municípios
      });

      return { data: municipios };
    } catch (error) {
      this.logger.error(`Erro ao buscar municípios: ${error.message}`);
      throw error;
    }
  }

  @Get('ncms')
  async getNcms(@Query('search') search?: string) {
    const where = search ? {
      OR: [
        { codigo: { contains: search } },
        { descricao: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const ncms = await this.prisma.nCM.findMany({
      where,
      orderBy: { codigo: 'asc' },
      take: 50,
    });

    return { data: ncms };
  }

  @Get('cfops')
  async getCfops(@Query('search') search?: string) {
    const where = search ? {
      OR: [
        { codigo: { contains: search } },
        { descricao: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const cfops = await this.prisma.cFOP.findMany({
      where,
      orderBy: { codigo: 'asc' },
      take: 50,
    });

    return { data: cfops };
  }

  @Get('csts')
  async getCsts(@Query('tipo') tipo?: string) {
    const where = tipo ? { tipo } : {};

    const csts = await this.prisma.cST.findMany({
      where,
      orderBy: { codigo: 'asc' },
    });

    return { data: csts };
  }

  @Get('csosns')
  async getCsosns() {
    const csosns = await this.prisma.cSOSN.findMany({
      orderBy: { codigo: 'asc' },
    });

    return { data: csosns };
  }
}
