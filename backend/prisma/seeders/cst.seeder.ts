import { PrismaClient } from '@prisma/client'

interface CSTData {
  codigo: string
  descricao: string
  tipo: 'ICMS' | 'PIS' | 'COFINS' | 'IPI'
}

// CST ICMS
const CST_ICMS: CSTData[] = [
  { codigo: '00', descricao: 'Tributada integralmente', tipo: 'ICMS' },
  { codigo: '10', descricao: 'Tributada e com cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '20', descricao: 'Com redução de base de cálculo', tipo: 'ICMS' },
  { codigo: '30', descricao: 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '40', descricao: 'Isenta', tipo: 'ICMS' },
  { codigo: '41', descricao: 'Não tributada', tipo: 'ICMS' },
  { codigo: '50', descricao: 'Suspensão', tipo: 'ICMS' },
  { codigo: '51', descricao: 'Diferimento', tipo: 'ICMS' },
  { codigo: '60', descricao: 'ICMS cobrado anteriormente por substituição tributária', tipo: 'ICMS' },
  { codigo: '70', descricao: 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '90', descricao: 'Outras', tipo: 'ICMS' },
]

// CST PIS
const CST_PIS: CSTData[] = [
  { codigo: '01', descricao: 'Operação Tributável com Alíquota Básica', tipo: 'PIS' },
  { codigo: '02', descricao: 'Operação Tributável com Alíquota Diferenciada', tipo: 'PIS' },
  { codigo: '03', descricao: 'Operação Tributável com Alíquota por Unidade de Medida de Produto', tipo: 'PIS' },
  { codigo: '04', descricao: 'Operação Tributável Monofásica - Revenda a Alíquota Zero', tipo: 'PIS' },
  { codigo: '05', descricao: 'Operação Tributável por Substituição Tributária', tipo: 'PIS' },
  { codigo: '06', descricao: 'Operação Tributável a Alíquota Zero', tipo: 'PIS' },
  { codigo: '07', descricao: 'Operação Isenta da Contribuição', tipo: 'PIS' },
  { codigo: '08', descricao: 'Operação sem Incidência da Contribuição', tipo: 'PIS' },
  { codigo: '09', descricao: 'Operação com Suspensão da Contribuição', tipo: 'PIS' },
  { codigo: '49', descricao: 'Outras Operações de Saída', tipo: 'PIS' },
  { codigo: '99', descricao: 'Outras Operações', tipo: 'PIS' },
]

// CST COFINS
const CST_COFINS: CSTData[] = [
  { codigo: '01', descricao: 'Operação Tributável com Alíquota Básica', tipo: 'COFINS' },
  { codigo: '02', descricao: 'Operação Tributável com Alíquota Diferenciada', tipo: 'COFINS' },
  { codigo: '03', descricao: 'Operação Tributável com Alíquota por Unidade de Medida de Produto', tipo: 'COFINS' },
  { codigo: '04', descricao: 'Operação Tributável Monofásica - Revenda a Alíquota Zero', tipo: 'COFINS' },
  { codigo: '05', descricao: 'Operação Tributável por Substituição Tributária', tipo: 'COFINS' },
  { codigo: '06', descricao: 'Operação Tributável a Alíquota Zero', tipo: 'COFINS' },
  { codigo: '07', descricao: 'Operação Isenta da Contribuição', tipo: 'COFINS' },
  { codigo: '08', descricao: 'Operação sem Incidência da Contribuição', tipo: 'COFINS' },
  { codigo: '09', descricao: 'Operação com Suspensão da Contribuição', tipo: 'COFINS' },
  { codigo: '49', descricao: 'Outras Operações de Saída', tipo: 'COFINS' },
  { codigo: '99', descricao: 'Outras Operações', tipo: 'COFINS' },
]

// CST IPI
const CST_IPI: CSTData[] = [
  { codigo: '00', descricao: 'Entrada com Recuperação de Crédito', tipo: 'IPI' },
  { codigo: '01', descricao: 'Entrada Tributada com Alíquota Zero', tipo: 'IPI' },
  { codigo: '02', descricao: 'Entrada Isenta', tipo: 'IPI' },
  { codigo: '03', descricao: 'Entrada Não-Tributada', tipo: 'IPI' },
  { codigo: '04', descricao: 'Entrada Imune', tipo: 'IPI' },
  { codigo: '05', descricao: 'Entrada com Suspensão', tipo: 'IPI' },
  { codigo: '49', descricao: 'Outras Entradas', tipo: 'IPI' },
  { codigo: '50', descricao: 'Saída Tributada', tipo: 'IPI' },
  { codigo: '51', descricao: 'Saída Tributada com Alíquota Zero', tipo: 'IPI' },
  { codigo: '52', descricao: 'Saída Isenta', tipo: 'IPI' },
  { codigo: '53', descricao: 'Saída Não-Tributada', tipo: 'IPI' },
  { codigo: '54', descricao: 'Saída Imune', tipo: 'IPI' },
  { codigo: '55', descricao: 'Saída com Suspensão', tipo: 'IPI' },
  { codigo: '99', descricao: 'Outras Saídas', tipo: 'IPI' },
]

const ALL_CST = [...CST_ICMS, ...CST_PIS, ...CST_COFINS, ...CST_IPI]

export async function seedCST(prisma: PrismaClient): Promise<void> {
  const existingCount = await prisma.cST.count()

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CSTs já existem, pulando...`)
    return
  }

  console.log(`   💾 Salvando ${ALL_CST.length} CSTs...`)
  
  // Usar createMany para melhor performance
  await prisma.cST.createMany({
    data: ALL_CST,
    skipDuplicates: true,
  })

  const counts = {
    ICMS: await prisma.cST.count({ where: { tipo: 'ICMS' } }),
    PIS: await prisma.cST.count({ where: { tipo: 'PIS' } }),
    COFINS: await prisma.cST.count({ where: { tipo: 'COFINS' } }),
    IPI: await prisma.cST.count({ where: { tipo: 'IPI' } }),
  }

  console.log(`   ✅ ${ALL_CST.length} CSTs criados`)
  console.log(`      ICMS: ${counts.ICMS}, PIS: ${counts.PIS}, COFINS: ${counts.COFINS}, IPI: ${counts.IPI}`)
}

