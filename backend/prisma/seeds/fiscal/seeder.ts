import { PrismaClient } from '@prisma/client';
import { loadCFOPs } from './loader';
import { ALL_CST, CSOSN_DATA } from './data';
import { loadNCMs } from './ncm-loader';

export async function seedFiscalTables(prisma: PrismaClient): Promise<void> {
  await seedCFOPs(prisma);
  await seedCSTs(prisma);
  await seedCSOSNs(prisma);
  await seedNCMs(prisma);
}

async function seedCFOPs(prisma: PrismaClient): Promise<void> {
  // Verificar se já existem CFOPs
  const existingCount = await prisma.cFOP.count();

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CFOPs já existem no banco, pulando seed...`);
    return;
  }

  const cfops = await loadCFOPs();

  for (const cfop of cfops) {
    await prisma.cFOP.upsert({
      where: { codigo: cfop.codigo },
      update: {
        descricao: cfop.descricao,
        tipo: cfop.tipo,
      },
      create: {
        codigo: cfop.codigo,
        descricao: cfop.descricao,
        aplicacao: cfop.tipo === 'ENTRADA' ? 'Entrada' : 'Saída',
        tipo: cfop.tipo,
      },
    });
  }

  console.log(`   ✅ ${cfops.length} CFOPs criados com sucesso`);
}

async function seedCSTs(prisma: PrismaClient): Promise<void> {
  // Verificar se já existem CSTs
  const existingCount = await prisma.cST.count();

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CSTs já existem no banco, pulando seed...`);
    return;
  }

  // Criar CSTs apenas se não existirem
  await prisma.cST.createMany({
    data: ALL_CST,
    skipDuplicates: true,
  });

  console.log(`   ✅ ${ALL_CST.length} CSTs criados com sucesso`);
}

async function seedCSOSNs(prisma: PrismaClient): Promise<void> {
  // Verificar se já existem CSOSNs
  const existingCount = await prisma.cSOSN.count();

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CSOSNs já existem no banco, pulando seed...`);
    return;
  }

  for (const csosn of CSOSN_DATA) {
    await prisma.cSOSN.upsert({
      where: { codigo: csosn.codigo },
      update: { descricao: csosn.descricao },
      create: csosn,
    });
  }

  console.log(`   ✅ ${CSOSN_DATA.length} CSOSNs criados com sucesso`);
}

async function seedNCMs(prisma: PrismaClient): Promise<void> {
  // Verificar se já existem NCMs
  const existingCount = await prisma.nCM.count();

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} NCMs já existem no banco, pulando seed...`);
    return;
  }

  console.log('   📥 Carregando NCMs...');

  const ncms = await loadNCMs();

  console.log(`   💾 Salvando ${ncms.length} NCMs no banco...`);

  let count = 0;
  for (const ncm of ncms) {
    await prisma.nCM.upsert({
      where: { codigo: ncm.codigo },
      update: {
        descricao: ncm.descricao,
        unidade: ncm.unidade,
      },
      create: {
        codigo: ncm.codigo,
        descricao: ncm.descricao,
        unidade: ncm.unidade,
      },
    });

    count++;
    if (count % 1000 === 0) {
      console.log(`   ⏳ ${count}/${ncms.length} NCMs salvos...`);
    }
  }

  console.log(`   ✅ ${count} NCMs salvos com sucesso`);
}
