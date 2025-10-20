import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IbgeCacheService } from '../external-apis/services/ibge-cache.service';

@Injectable()
export class AuxiliaresService {
  private readonly logger = new Logger(AuxiliaresService.name);

  constructor(
    private prisma: PrismaService,
    private ibgeCacheService: IbgeCacheService,
  ) {}

  /**
   * Busca estados do banco, se não existir popula via API IBGE
   */
  async getEstados(search?: string) {
    try {
      // Verifica se há estados no banco
      const count = await this.prisma.estado.count();
      
      if (count === 0) {
        this.logger.log('Nenhum estado encontrado no banco, populando via API IBGE...');
        await this.popularEstados();
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

  /**
   * Busca municípios do banco, se não existir para o estado popula via API IBGE
   */
  async getMunicipios(estadoId?: string, search?: string) {
    try {
      const where: any = {};
      
      if (estadoId) {
        where.estadoId = estadoId;

        // Verifica se há municípios para este estado
        const count = await this.prisma.municipio.count({ where: { estadoId } });
        
        if (count === 0) {
          this.logger.log(`Nenhum município encontrado para o estado ${estadoId}, populando via API IBGE...`);
          await this.popularMunicipiosPorEstado(estadoId);
        }
      }
      
      if (search) {
        where.nome = { contains: search, mode: 'insensitive' as const };
      }

      const municipios = await this.prisma.municipio.findMany({
        where,
        include: { estado: true },
        orderBy: { nome: 'asc' },
        take: 1000, // Aumentado para retornar todos os municípios do estado
      });

      return { data: municipios };
    } catch (error) {
      this.logger.error(`Erro ao buscar municípios: ${error.message}`);
      throw error;
    }
  }

  /**
   * Popula todos os estados via API IBGE
   */
  private async popularEstados() {
    try {
      const response = await this.ibgeCacheService.getEstados();
      
      if (response.success && response.data) {
        this.logger.log(`${response.data.length} estados populados com sucesso`);
      } else {
        this.logger.error('Erro ao popular estados via API IBGE');
      }
    } catch (error) {
      this.logger.error(`Erro ao popular estados: ${error.message}`);
      throw error;
    }
  }

  /**
   * Popula municípios de um estado específico via API IBGE
   */
  private async popularMunicipiosPorEstado(estadoId: string) {
    try {
      // Busca o estado para pegar a UF
      const estado = await this.prisma.estado.findUnique({
        where: { id: estadoId },
      });

      if (!estado) {
        throw new Error(`Estado ${estadoId} não encontrado`);
      }

      const response = await this.ibgeCacheService.getMunicipiosByEstado(estado.uf);
      
      if (response.success && response.data) {
        this.logger.log(`${response.data.length} municípios populados para ${estado.uf}`);
      } else {
        this.logger.error(`Erro ao popular municípios para ${estado.uf}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao popular municípios: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca município por nome e UF (usado para auto-fill)
   */
  async findMunicipioByNomeAndUf(nome: string, uf: string) {
    try {
      // Busca o estado pela UF
      const estado = await this.prisma.estado.findUnique({
        where: { uf: uf.toUpperCase() },
      });

      if (!estado) {
        return null;
      }

      // Verifica se há municípios para este estado
      const count = await this.prisma.municipio.count({ 
        where: { estadoId: estado.id } 
      });
      
      if (count === 0) {
        this.logger.log(`Populando municípios para ${uf}...`);
        await this.popularMunicipiosPorEstado(estado.id);
      }

      // Busca o município
      const municipio = await this.prisma.municipio.findFirst({
        where: {
          estadoId: estado.id,
          nome: {
            equals: nome,
            mode: 'insensitive',
          },
        },
        include: { estado: true },
      });

      return municipio;
    } catch (error) {
      this.logger.error(`Erro ao buscar município: ${error.message}`);
      return null;
    }
  }
}

