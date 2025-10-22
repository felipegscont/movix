import { PrismaClient } from '@prisma/client';
import { loadCFOPs } from './loader';
import { ALL_CST, CSOSN_DATA } from './data';

export async function seedFiscalTables(prisma: PrismaClient): Promise<void> {
  await seedCFOPs(prisma);
  await seedCSTs(prisma);
  await seedCSOSNs(prisma);
}

async function seedCFOPs(prisma: PrismaClient): Promise<void> {
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
}

async function seedCSTs(prisma: PrismaClient): Promise<void> {
  await prisma.cST.deleteMany({});
  
  await prisma.cST.createMany({
    data: ALL_CST,
    skipDuplicates: true,
  });
}

async function seedCSOSNs(prisma: PrismaClient): Promise<void> {
  for (const csosn of CSOSN_DATA) {
    await prisma.cSOSN.upsert({
      where: { codigo: csosn.codigo },
      update: { descricao: csosn.descricao },
      create: csosn,
    });
  }
}

