/**
 * Prisma Database Seeder
 * 
 * Este arquivo é o ponto de entrada para popular o banco de dados com dados iniciais.
 * Executado automaticamente com: npx prisma db seed
 * 
 * Estrutura:
 * - seeders/: Contém os seeders modulares organizados por domínio
 * - data/: Contém os arquivos JSON com os dados estáticos
 */

import { PrismaClient } from '@prisma/client'
import { seedCFOP } from './seeders/cfop.seeder'
import { seedCST } from './seeders/cst.seeder'
import { seedCSOSN } from './seeders/csosn.seeder'
import { seedNCM } from './seeders/ncm.seeder'
import { seedNaturezasOperacao } from './seeders/natureza-operacao.seeder'
import { seedFormasPagamento } from './seeders/forma-pagamento.seeder'
import { seedEmitentePlaceholder } from './seeders/emitente.seeder'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  try {
    // 1. Dados Fiscais (ordem: CFOP, CST, CSOSN, NCM)
    console.log('📋 Dados Fiscais')
    await seedCFOP(prisma)
    await seedCST(prisma)
    await seedCSOSN(prisma)
    await seedNCM(prisma)

    // 2. Naturezas de Operação
    console.log('\n🏷️  Naturezas de Operação')
    await seedNaturezasOperacao(prisma)

    // 3. Formas de Pagamento
    console.log('\n💳 Formas de Pagamento')
    await seedFormasPagamento(prisma)

    // 4. Emitente Placeholder
    console.log('\n🏢 Emitente Placeholder')
    await seedEmitentePlaceholder(prisma)

    console.log('\n✅ Seed concluído com sucesso!\n')
    console.log('📊 Resumo dos dados populados:')
    console.log('   • CFOP: ~600 códigos')
    console.log('   • CST: 40 códigos (ICMS, PIS, COFINS, IPI)')
    console.log('   • CSOSN: 10 códigos')
    console.log('   • NCM: ~10.500 códigos (Tabela Siscomex)')
    console.log('   • Naturezas de Operação: 2 padrões')
    console.log('   • Formas de Pagamento: 21 formas')
    console.log('   • Emitente: 1 placeholder\n')
    console.log('ℹ️  Estados e Municípios são carregados automaticamente via API IBGE')
    console.log('ℹ️  Configure o emitente em: Configurações > Emitente\n')

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

