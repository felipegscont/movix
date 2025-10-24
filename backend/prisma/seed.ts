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
import { seedEstados, seedMunicipios } from './seeders/ibge.seeder'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  try {
    // 0. Estados e Municípios (IBGE) - PRIMEIRO!
    console.log('🌍 Dados Geográficos (IBGE)')
    await seedEstados(prisma)
    await seedMunicipios(prisma)

    // 1. Dados Fiscais (ordem: CFOP, CST, CSOSN, NCM)
    console.log('\n📋 Dados Fiscais')
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

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ SEED CONCLUÍDO COM SUCESSO!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('📊 Resumo dos dados populados:')
    console.log('   🌍 Dados Geográficos:')
    console.log('      • Estados: 27 (todos os estados brasileiros)')
    console.log('      • Municípios: ~5.570 (todos os municípios do Brasil)')
    console.log('')
    console.log('   📋 Dados Fiscais:')
    console.log('      • CFOP: ~600 códigos')
    console.log('      • CST: ~90 códigos (ICMS, PIS, COFINS, IPI)')
    console.log('      • CSOSN: 10 códigos')
    console.log('      • NCM: ~10.500 códigos (8 dígitos - Tabela Siscomex)')
    console.log('')
    console.log('   🏢 Dados Operacionais:')
    console.log('      • Naturezas de Operação: 2 padrões')
    console.log('      • Formas de Pagamento: 26 formas')
    console.log('      • Emitente: 1 placeholder')
    console.log('')
    console.log('ℹ️  Todos os dados são oficiais e atualizados:')
    console.log('   • Estados/Municípios: API IBGE')
    console.log('   • NCM: Tabela Siscomex (Receita Federal)')
    console.log('   • CFOP: Tabela SPED (Receita Federal)')
    console.log('')
    console.log('💡 Próximos passos:')
    console.log('   1. Configure o emitente em: Configurações > Emitente')
    console.log('   2. Cadastre produtos e clientes')
    console.log('   3. Comece a emitir notas fiscais!\n')

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

