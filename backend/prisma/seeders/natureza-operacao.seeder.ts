import { PrismaClient } from '@prisma/client'

interface NaturezaOperacaoData {
  codigo: string
  descricao: string
  cfopDentroEstado: string
  cfopForaEstado: string
  tipoOperacao: number
  finalidade: number
  ativo: boolean
}

const NATUREZAS: NaturezaOperacaoData[] = [
  {
    codigo: 'VENDA',
    descricao: 'Venda de Mercadoria',
    cfopDentroEstado: '5102', // Venda dentro do estado
    cfopForaEstado: '6102',   // Venda fora do estado
    tipoOperacao: 1,          // Saída
    finalidade: 1,            // Normal
    ativo: true,
  },
  {
    codigo: 'DEVOLUCAO',
    descricao: 'Devolução de Mercadoria',
    cfopDentroEstado: '5202', // Devolução dentro do estado
    cfopForaEstado: '6202',   // Devolução fora do estado
    tipoOperacao: 1,          // Saída
    finalidade: 4,            // Devolução
    ativo: true,
  },
]

export async function seedNaturezasOperacao(prisma: PrismaClient): Promise<void> {
  let created = 0
  let updated = 0

  for (const natureza of NATUREZAS) {
    // Buscar CFOPs
    const cfopDentro = await prisma.cFOP.findUnique({
      where: { codigo: natureza.cfopDentroEstado },
    })

    const cfopFora = await prisma.cFOP.findUnique({
      where: { codigo: natureza.cfopForaEstado },
    })

    if (!cfopDentro || !cfopFora) {
      console.log(`   ⚠️  CFOPs não encontrados para natureza ${natureza.codigo}, pulando...`)
      continue
    }

    const result = await prisma.naturezaOperacao.upsert({
      where: { codigo: natureza.codigo },
      update: {
        descricao: natureza.descricao,
        cfopDentroEstadoId: cfopDentro.id,
        cfopForaEstadoId: cfopFora.id,
        tipoOperacao: natureza.tipoOperacao,
        finalidade: natureza.finalidade,
        ativo: natureza.ativo,
      },
      create: {
        codigo: natureza.codigo,
        descricao: natureza.descricao,
        cfopDentroEstadoId: cfopDentro.id,
        cfopForaEstadoId: cfopFora.id,
        tipoOperacao: natureza.tipoOperacao,
        finalidade: natureza.finalidade,
        ativo: natureza.ativo,
      },
    })

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++
    } else {
      updated++
    }
  }

  console.log(`   ✅ ${created} criadas, ${updated} atualizadas (Total: ${NATUREZAS.length})`)
}

