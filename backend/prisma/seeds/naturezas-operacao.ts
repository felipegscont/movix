import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface NaturezaOperacaoData {
  codigo: string;
  descricao: string;
  cfopDentroEstado: string;
  cfopForaEstado: string;
  cfopExterior: string | null;
  tipoOperacao: number;
  finalidade: number;
  consumidorFinal: number;
  presencaComprador: number;
  informacoesAdicionaisPadrao: string | null;
  ativo: boolean;
}

export async function seedNaturezasOperacao(prisma: PrismaClient) {
  console.log('   📋 Naturezas de Operação...');

  // Ler dados do JSON
  const jsonPath = path.join(__dirname, 'data', 'naturezas-operacao.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const naturezas: NaturezaOperacaoData[] = JSON.parse(jsonData);

  let created = 0;
  let updated = 0;

  for (const natureza of naturezas) {
    // Buscar CFOPs
    const cfopDentro = await prisma.cFOP.findUnique({
      where: { codigo: natureza.cfopDentroEstado },
    });

    const cfopFora = await prisma.cFOP.findUnique({
      where: { codigo: natureza.cfopForaEstado },
    });

    if (!cfopDentro || !cfopFora) {
      console.log(`      ⚠️  CFOPs não encontrados para ${natureza.codigo}, pulando`);
      continue;
    }

    const existing = await prisma.naturezaOperacao.findUnique({
      where: { codigo: natureza.codigo },
    });

    if (existing) {
      await prisma.naturezaOperacao.update({
        where: { codigo: natureza.codigo },
        data: {
          descricao: natureza.descricao,
          cfopDentroEstadoId: cfopDentro.id,
          cfopForaEstadoId: cfopFora.id,
          cfopExteriorId: null,
          tipoOperacao: natureza.tipoOperacao,
          finalidade: natureza.finalidade,
          consumidorFinal: natureza.consumidorFinal,
          presencaComprador: natureza.presencaComprador,
          informacoesAdicionaisPadrao: natureza.informacoesAdicionaisPadrao,
          ativo: natureza.ativo,
        },
      });
      updated++;
    } else {
      await prisma.naturezaOperacao.create({
        data: {
          codigo: natureza.codigo,
          descricao: natureza.descricao,
          cfopDentroEstadoId: cfopDentro.id,
          cfopForaEstadoId: cfopFora.id,
          cfopExteriorId: null,
          tipoOperacao: natureza.tipoOperacao,
          finalidade: natureza.finalidade,
          consumidorFinal: natureza.consumidorFinal,
          presencaComprador: natureza.presencaComprador,
          informacoesAdicionaisPadrao: natureza.informacoesAdicionaisPadrao,
          ativo: natureza.ativo,
        },
      });
      created++;
    }
  }

  console.log(`      ✓ ${created} criadas, ${updated} atualizadas (Total: ${naturezas.length})`);
}

