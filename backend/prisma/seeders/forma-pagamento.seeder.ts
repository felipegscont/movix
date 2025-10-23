import { PrismaClient } from '@prisma/client'

interface FormaPagamentoData {
  codigo: string
  descricao: string
  ativo: boolean
}

// Formas de pagamento conforme IT 2024.002 v.1.10
const FORMAS_PAGAMENTO: FormaPagamentoData[] = [
  { codigo: '01', descricao: 'Dinheiro', ativo: true },
  { codigo: '02', descricao: 'Cheque', ativo: true },
  { codigo: '03', descricao: 'Cartão de Crédito', ativo: true },
  { codigo: '04', descricao: 'Cartão de Débito', ativo: true },
  { codigo: '05', descricao: 'Crédito Loja', ativo: true },
  { codigo: '10', descricao: 'Vale Alimentação', ativo: true },
  { codigo: '11', descricao: 'Vale Refeição', ativo: true },
  { codigo: '12', descricao: 'Vale Presente', ativo: true },
  { codigo: '13', descricao: 'Vale Combustível', ativo: true },
  { codigo: '14', descricao: 'Duplicata Mercantil', ativo: true },
  { codigo: '15', descricao: 'Boleto Bancário', ativo: true },
  { codigo: '16', descricao: 'Depósito Bancário', ativo: true },
  { codigo: '17', descricao: 'Pagamento Instantâneo (PIX)', ativo: true },
  { codigo: '18', descricao: 'Transferência bancária, Carteira Digital', ativo: true },
  { codigo: '19', descricao: 'Programa de fidelidade, Cashback, Crédito Virtual', ativo: true },
  { codigo: '90', descricao: 'Sem pagamento', ativo: true },
  { codigo: '99', descricao: 'Outros', ativo: true },
]

export async function seedFormasPagamento(prisma: PrismaClient): Promise<void> {
  let created = 0
  let updated = 0

  for (const forma of FORMAS_PAGAMENTO) {
    const result = await prisma.formaPagamento.upsert({
      where: { codigo: forma.codigo },
      update: {
        descricao: forma.descricao,
        ativo: forma.ativo,
      },
      create: forma,
    })

    if (result.createdAt === result.updatedAt) {
      created++
    } else {
      updated++
    }
  }

  console.log(`   ✅ ${created} criadas, ${updated} atualizadas (Total: ${FORMAS_PAGAMENTO.length})`)
}

