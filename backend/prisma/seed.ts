import { PrismaClient } from '@prisma/client';
import { seedFiscalTables } from './seeds/fiscal';

const prisma = new PrismaClient();

async function seedNaturezas() {
  const cfop5102 = await prisma.cFOP.findUnique({ where: { codigo: '5102' } });
  const cfop6102 = await prisma.cFOP.findUnique({ where: { codigo: '6102' } });
  const cfop5101 = await prisma.cFOP.findUnique({ where: { codigo: '5101' } });
  const cfop6101 = await prisma.cFOP.findUnique({ where: { codigo: '6101' } });

  if (!cfop5102 || !cfop6102 || !cfop5101 || !cfop6101) {
    console.log('⚠️  CFOPs não encontrados, pulando naturezas de operação');
    return;
  }

  const naturezas = [
    {
      codigo: 'VENDA',
      descricao: 'Venda de mercadoria',
      cfopDentroEstadoId: cfop5102.id,
      cfopForaEstadoId: cfop6102.id,
      tipoOperacao: 1,
      finalidade: 1,
      consumidorFinal: 1,
      presencaComprador: 1,
    },
    {
      codigo: 'VENDA_PROD',
      descricao: 'Venda de produção do estabelecimento',
      cfopDentroEstadoId: cfop5101.id,
      cfopForaEstadoId: cfop6101.id,
      tipoOperacao: 1,
      finalidade: 1,
      consumidorFinal: 1,
      presencaComprador: 1,
    },
  ];

  for (const natureza of naturezas) {
    await prisma.naturezaOperacao.upsert({
      where: { codigo: natureza.codigo },
      update: {},
      create: natureza,
    });
  }
}

async function main() {
  console.log('🌱 Seed iniciado');

  console.log('🔢 Tabelas Fiscais (CFOP, CST, CSOSN)');
  await seedFiscalTables(prisma);

  console.log('📋 Naturezas de Operação');
  await seedNaturezas();

  console.log('✅ Seed concluído');
  console.log('');
  console.log('ℹ️  Estados e Municípios são populados automaticamente via API IBGE');
  console.log('ℹ️  NCMs devem ser cadastrados conforme necessidade do negócio');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
