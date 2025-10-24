import { PrismaClient } from '@prisma/client'

interface CFOPData {
  cfopId: string
  descricao: string
  padrao: boolean
}

interface NaturezaOperacaoData {
  codigo: string
  nome: string
  cfops: CFOPData[]
  tipo: number
  ativa: boolean
  propria: boolean
  dentroEstado: boolean
}

const NATUREZAS: NaturezaOperacaoData[] = [
  {
    codigo: 'VENDA',
    nome: 'Venda de Mercadoria',
    cfops: [
      {
        cfopId: '5403',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituto',
        padrao: false
      },
      {
        cfopId: '5102',
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
        padrao: false
      }
    ],
    tipo: 1,            // Saída
    ativa: true,
    propria: true,
    dentroEstado: true,
  },
  {
    codigo: 'DEVOLUCAO',
    nome: 'Devolução de Mercadoria',
    cfops: [
      {
        cfopId: '5202',
        descricao: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros',
        padrao: true
      }
    ],
    tipo: 1,            // Saída
    ativa: true,
    propria: true,
    dentroEstado: true,
  },
]

export async function seedNaturezasOperacao(prisma: PrismaClient): Promise<void> {
  let created = 0
  let updated = 0

  for (const natureza of NATUREZAS) {
    // Criar ou atualizar a natureza de operação
    const result = await prisma.naturezaOperacao.upsert({
      where: { codigo: natureza.codigo },
      update: {
        nome: natureza.nome,
        tipo: natureza.tipo,
        ativa: natureza.ativa,
        propria: natureza.propria,
        dentroEstado: natureza.dentroEstado,
      },
      create: {
        codigo: natureza.codigo,
        nome: natureza.nome,
        tipo: natureza.tipo,
        ativa: natureza.ativa,
        propria: natureza.propria,
        dentroEstado: natureza.dentroEstado,
      },
    })

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++
    } else {
      updated++
    }

    // Limpar CFOPs existentes e recriar
    await prisma.naturezaOperacaoCFOP.deleteMany({
      where: { naturezaOperacaoId: result.id }
    })

    // Adicionar CFOPs
    for (const cfopData of natureza.cfops) {
      const cfop = await prisma.cFOP.findFirst({
        where: { codigo: cfopData.cfopId },
      })

      if (!cfop) {
        console.log(`   ⚠️  CFOP ${cfopData.cfopId} não encontrado para ${natureza.codigo}, pulando...`)
        continue
      }

      await prisma.naturezaOperacaoCFOP.create({
        data: {
          naturezaOperacaoId: result.id,
          cfopId: cfop.id,
          padrao: cfopData.padrao,
        }
      })
    }
  }

  console.log(`   ✅ ${created} criadas, ${updated} atualizadas (Total: ${NATUREZAS.length})`)
}

