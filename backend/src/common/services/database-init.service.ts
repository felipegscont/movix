import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);
  private isInitializing = false;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Executar em background para não bloquear a inicialização
    setImmediate(() => this.initializeDatabase());
  }

  private async initializeDatabase() {
    if (this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      // Verificar se o banco precisa de inicialização
      const needsInit = await this.checkIfNeedsInitialization();

      if (needsInit) {
        this.logger.warn('⚠️  Banco de dados não está populado!');
        this.logger.log('');
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('🔄 EXECUTANDO INICIALIZAÇÃO AUTOMÁTICA DO BANCO DE DADOS');
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('');

        // Executar migrations
        this.logger.log('📦 Aplicando migrations...');
        await this.runMigrations();

        // Executar seed
        this.logger.log('🌱 Populando banco de dados...');
        await this.runSeed();

        this.logger.log('');
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('✅ BANCO DE DADOS INICIALIZADO COM SUCESSO!');
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log('');
        this.logger.log('📋 Dados populados:');
        this.logger.log('   🌍 Dados Geográficos:');
        this.logger.log('      • Estados: 27 (todos os estados brasileiros)');
        this.logger.log('      • Municípios: ~5.570 (todos os municípios do Brasil)');
        this.logger.log('');
        this.logger.log('   📋 Dados Fiscais:');
        this.logger.log('      • CFOP: ~600 códigos');
        this.logger.log('      • CST: ~90 códigos (ICMS, PIS, COFINS, IPI)');
        this.logger.log('      • CSOSN: 10 códigos');
        this.logger.log('      • NCM: ~10.500 códigos (8 dígitos - Tabela Siscomex)');
        this.logger.log('');
        this.logger.log('   🏢 Dados Operacionais:');
        this.logger.log('      • Naturezas de Operação: 2 padrões');
        this.logger.log('      • Formas de Pagamento: 26 formas');
        this.logger.log('      • Emitente: 1 placeholder');
        this.logger.log('');
        this.logger.log('ℹ️  Todos os dados são oficiais e atualizados:');
        this.logger.log('   • Estados/Municípios: API IBGE');
        this.logger.log('   • NCM: Tabela Siscomex (Receita Federal)');
        this.logger.log('   • CFOP: Tabela SPED (Receita Federal)');
        this.logger.log('');
      } else {
        this.logger.log('✅ Banco de dados já inicializado');
      }
    } catch (error) {
      this.logger.error('');
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.error('❌ ERRO AO INICIALIZAR BANCO DE DADOS');
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.error('');
      this.logger.error(`Erro: ${error.message}`);
      this.logger.error('');
      this.logger.error('💡 Execute manualmente:');
      this.logger.error('   cd backend');
      this.logger.error('   npm run db:setup');
      this.logger.error('');
    } finally {
      this.isInitializing = false;
    }
  }

  private async checkIfNeedsInitialization(): Promise<boolean> {
    try {
      // Verificar se existem CFOPs (indicador de que o seed foi executado)
      const cfopCount = await this.prisma.cFOP.count();
      
      if (cfopCount === 0) {
        return true;
      }

      // Verificar se existem CSTs
      const cstCount = await this.prisma.cST.count();
      
      if (cstCount === 0) {
        return true;
      }

      return false;
    } catch (error) {
      // Se houver erro (ex: tabela não existe), precisa inicializar
      this.logger.warn('⚠️  Tabelas não encontradas, será necessário executar migrations');
      return true;
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      const backendPath = path.join(process.cwd());

      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        cwd: backendPath,
        env: { ...process.env },
      });

      if (stdout) {
        const lines = stdout.split('\n').filter(line => line.trim());
        lines.forEach(line => this.logger.log(`   ${line}`));
      }

      if (stderr && !stderr.includes('already applied') && !stderr.includes('deprecated')) {
        this.logger.warn(stderr);
      }

      this.logger.log('   ✓ Migrations aplicadas');
    } catch (error) {
      this.logger.error('   ✗ Erro ao executar migrations:', error.message);
      throw error;
    }
  }

  private async runSeed(): Promise<void> {
    try {
      const backendPath = path.join(process.cwd());

      const { stdout, stderr } = await execAsync('npm run prisma:seed', {
        cwd: backendPath,
        env: { ...process.env },
        timeout: 60000, // 60 segundos timeout
      });

      if (stdout) {
        const lines = stdout.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('✅') || line.includes('🌱') || line.includes('🔢') || line.includes('📋')) {
            this.logger.log(`   ${line}`);
          }
        });
      }

      if (stderr && !stderr.includes('DeprecationWarning') && !stderr.includes('deprecated') && !stderr.includes('package.json#prisma')) {
        this.logger.warn(stderr);
      }

      this.logger.log('   ✓ Seed executado com sucesso');
    } catch (error) {
      this.logger.error('   ✗ Erro ao executar seed:', error.message);
      throw error;
    }
  }
}

