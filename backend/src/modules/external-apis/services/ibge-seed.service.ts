import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IbgeDataService } from './ibge-data.service';

@Injectable()
export class IbgeSeedService {
  private readonly logger = new Logger(IbgeSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ibgeService: IbgeDataService,
  ) {}

  /**
   * Executa o seed completo de estados e municípios
   */
  async executeSeed(): Promise<void> {
    try {
      this.logger.log('🌍 Iniciando seed de dados do IBGE...');
      
      // Verificar se já existem estados
      const estadosExistentes = await this.prisma.estado.count();
      if (estadosExistentes > 0) {
        this.logger.log(`ℹ️  ${estadosExistentes} estados já existem, pulando seed de estados`);
      } else {
        await this.seedEstados();
      }

      // Verificar se já existem municípios
      const municipiosExistentes = await this.prisma.municipio.count();
      if (municipiosExistentes > 0) {
        this.logger.log(`ℹ️  ${municipiosExistentes} municípios já existem, pulando seed de municípios`);
      } else {
        await this.seedMunicipiosPrincipais();
      }

      this.logger.log('✅ Seed do IBGE concluído com sucesso!');
    } catch (error) {
      this.logger.error('❌ Erro durante o seed do IBGE:', error.message);
      throw error;
    }
  }

  /**
   * Faz seed de todos os estados brasileiros
   */
  private async seedEstados(): Promise<void> {
    this.logger.log('📍 Buscando estados na API do IBGE...');
    
    const response = await this.ibgeService.getEstados();
    if (!response.success) {
      throw new Error(`Erro ao buscar estados: ${response.error}`);
    }

    const estados = response.data!;
    this.logger.log(`📥 Encontrados ${estados.length} estados`);

    const estadosData = estados.map(estado => ({
      codigo: estado.id.toString(),
      uf: estado.sigla,
      nome: estado.nome,
      regiao: estado.regiao.nome,
      ativo: true,
    }));

    // Inserir estados em lote
    await this.prisma.estado.createMany({
      data: estadosData,
      skipDuplicates: true,
    });

    this.logger.log(`✅ ${estados.length} estados inseridos com sucesso`);
  }

  /**
   * Faz seed de TODOS os municípios de TODOS os estados brasileiros
   */
  private async seedMunicipiosPrincipais(): Promise<void> {
    this.logger.log('🏙️  Buscando TODOS os municípios do Brasil...');

    // Buscar todos os estados do banco
    const estados = await this.prisma.estado.findMany({
      orderBy: { uf: 'asc' },
    });

    if (estados.length === 0) {
      this.logger.warn('⚠️  Nenhum estado encontrado no banco. Execute seedEstados() primeiro.');
      return;
    }

    this.logger.log(`📍 Processando municípios de ${estados.length} estados...`);

    let totalMunicipios = 0;
    let estadosProcessados = 0;

    for (const estado of estados) {
      try {
        this.logger.log(`📍 [${estadosProcessados + 1}/${estados.length}] Buscando municípios de ${estado.uf}...`);

        const response = await this.ibgeService.getMunicipiosByEstado(estado.uf);
        if (!response.success) {
          this.logger.warn(`⚠️  Erro ao buscar municípios de ${estado.uf}: ${response.error}`);
          continue;
        }

        const municipios = response.data!;

        // Preparar dados dos municípios
        const municipiosData = municipios.map(municipio => ({
          codigo: municipio.id.toString(),
          nome: municipio.nome,
          estadoId: estado.id,
          ativo: true,
        }));

        // Inserir municípios em lote
        await this.prisma.municipio.createMany({
          data: municipiosData,
          skipDuplicates: true,
        });

        totalMunicipios += municipios.length;
        estadosProcessados++;
        this.logger.log(`   ✅ ${municipios.length} municípios de ${estado.uf} inseridos (Total: ${totalMunicipios})`);

        // Pequena pausa para não sobrecarregar a API do IBGE
        await this.sleep(300);

      } catch (error) {
        this.logger.warn(`⚠️  Erro ao processar municípios de ${estado.uf}: ${error.message}`);
      }
    }

    this.logger.log('');
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`✅ SEED DE MUNICÍPIOS CONCLUÍDO!`);
    this.logger.log(`   • Estados processados: ${estadosProcessados}/${estados.length}`);
    this.logger.log(`   • Total de municípios: ${totalMunicipios}`);
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Busca e insere municípios de um estado específico
   */
  async seedMunicipiosEstado(uf: string): Promise<void> {
    this.logger.log(`🏙️  Buscando municípios de ${uf}...`);

    const response = await this.ibgeService.getMunicipiosByEstado(uf);
    if (!response.success) {
      throw new Error(`Erro ao buscar municípios de ${uf}: ${response.error}`);
    }

    const municipios = response.data!;
    
    // Buscar o estado no banco
    const estado = await this.prisma.estado.findUnique({
      where: { uf: uf.toUpperCase() },
    });

    if (!estado) {
      throw new Error(`Estado ${uf} não encontrado no banco`);
    }

    // Preparar dados dos municípios
    const municipiosData = municipios.map(municipio => ({
      codigo: municipio.id.toString(),
      nome: municipio.nome,
      estadoId: estado.id,
      ativo: true,
    }));

    // Inserir municípios
    await this.prisma.municipio.createMany({
      data: municipiosData,
      skipDuplicates: true,
    });

    this.logger.log(`✅ ${municipios.length} municípios de ${uf} inseridos`);
  }

  /**
   * Utilitário para pausar execução
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
