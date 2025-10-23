import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface FormaPagamentoData {
  codigo: string;
  descricao: string;
  requerCard: boolean;
  vigenciaInicio: string;
  observacoes: string | null;
}

export async function seedFormasPagamento(prisma: PrismaClient) {
  console.log('   💳 Formas de Pagamento...');

  // Ler arquivo JSON
  const jsonPath = path.join(__dirname, 'data', 'formas-pagamento.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const formasPagamento: FormaPagamentoData[] = JSON.parse(jsonData);

  let created = 0;
  let updated = 0;

  for (const forma of formasPagamento) {
    const existing = await prisma.formaPagamento.findUnique({
      where: { codigo: forma.codigo },
    });

    if (existing) {
      await prisma.formaPagamento.update({
        where: { codigo: forma.codigo },
        data: {
          descricao: forma.descricao,
          requerCard: forma.requerCard,
          vigenciaInicio: forma.vigenciaInicio ? new Date(forma.vigenciaInicio) : null,
          observacoes: forma.observacoes,
          ativo: true,
        },
      });
      updated++;
    } else {
      await prisma.formaPagamento.create({
        data: {
          codigo: forma.codigo,
          descricao: forma.descricao,
          requerCard: forma.requerCard,
          vigenciaInicio: forma.vigenciaInicio ? new Date(forma.vigenciaInicio) : null,
          observacoes: forma.observacoes,
          ativo: true,
        },
      });
      created++;
    }
  }

  console.log(`      ✓ ${created} criadas, ${updated} atualizadas (Total: ${formasPagamento.length})`);
}

