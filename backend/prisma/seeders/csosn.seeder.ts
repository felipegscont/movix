import { PrismaClient } from '@prisma/client'

interface CSOSNData {
  codigo: string
  descricao: string
}

const CSOSN_DATA: CSOSNData[] = [
  { codigo: '101', descricao: 'Tributada pelo Simples Nacional com permissão de crédito' },
  { codigo: '102', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito' },
  { codigo: '103', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta' },
  { codigo: '201', descricao: 'Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por ST' },
  { codigo: '202', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST' },
  { codigo: '203', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por ST' },
  { codigo: '300', descricao: 'Imune' },
  { codigo: '400', descricao: 'Não tributada pelo Simples Nacional' },
  { codigo: '500', descricao: 'ICMS cobrado anteriormente por ST ou por antecipação' },
  { codigo: '900', descricao: 'Outros' },
]

export async function seedCSOSN(prisma: PrismaClient): Promise<void> {
  const existingCount = await prisma.cSOSN.count()

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CSOSNs já existem, pulando...`)
    return
  }

  console.log(`   💾 Salvando ${CSOSN_DATA.length} CSOSNs...`)
  
  // Usar createMany para melhor performance
  await prisma.cSOSN.createMany({
    data: CSOSN_DATA,
    skipDuplicates: true,
  })

  console.log(`   ✅ ${CSOSN_DATA.length} CSOSNs criados`)
}

