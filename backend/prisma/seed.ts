import { PrismaClient } from '@prisma/client';
import { seedFiscalTables } from './seeds/fiscal';
import { seedFormasPagamento } from './seeds/formas-pagamento';
import { seedEmitentePlaceholder } from './seeds/emitente-placeholder';
import { seedNaturezasOperacao } from './seeds/naturezas-operacao';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed iniciado');

  console.log('🔢 Tabelas Fiscais (CFOP, CST, CSOSN, NCM)');
  await seedFiscalTables(prisma);

  console.log('📋 Naturezas de Operação');
  await seedNaturezasOperacao(prisma);

  console.log('💳 Formas de Pagamento');
  await seedFormasPagamento(prisma);

  console.log('🏢 Emitente Placeholder');
  await seedEmitentePlaceholder(prisma);

  console.log('✅ Seed concluído');
  console.log('');
  console.log('📊 Dados populados:');
  console.log('   • CFOP: ~500 códigos');
  console.log('   • CST: ~90 códigos (ICMS, PIS, COFINS, IPI)');
  console.log('   • CSOSN: 10 códigos');
  console.log('   • NCM: ~10.500 códigos (8 dígitos - Tabela completa Siscomex)');
  console.log('   • Naturezas de Operação: 2 padrões');
  console.log('   • Formas de Pagamento: 26 formas (IT 2024.002 v.1.10)');
  console.log('   • Emitente: 1 placeholder (configure em Configurações > Emitente)');
  console.log('');
  console.log('ℹ️  Estados e Municípios são populados automaticamente via API IBGE');
  console.log('ℹ️  NCMs atualizados da tabela oficial do Siscomex (Receita Federal)');
  console.log('ℹ️  Todos os dados são carregados de arquivos JSON em prisma/seeds/data/');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
