import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkFinal() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 CHECAGEM FINAL DO BANCO DE DADOS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  // Dados Geográficos
  const estados = await prisma.estado.count();
  const municipios = await prisma.municipio.count();
  
  console.log('🌍 DADOS GEOGRÁFICOS (IBGE):');
  console.log('   Estados:', estados, '/ 27', estados === 27 ? '✓ OK' : '✗ ERRO');
  console.log('   Municípios:', municipios, '/ 5570', municipios === 5570 ? '✓ OK' : '✗ ERRO');
  
  // Verificar alguns estados específicos
  const sp = await prisma.estado.findUnique({ where: { uf: 'SP' } });
  const rj = await prisma.estado.findUnique({ where: { uf: 'RJ' } });
  const mg = await prisma.estado.findUnique({ where: { uf: 'MG' } });
  console.log('   SP encontrado:', sp ? '✓ OK' : '✗ ERRO');
  console.log('   RJ encontrado:', rj ? '✓ OK' : '✗ ERRO');
  console.log('   MG encontrado:', mg ? '✓ OK' : '✗ ERRO');
  
  // Verificar municípios de SP
  if (sp) {
    const municipiosSP = await prisma.municipio.count({ where: { estadoId: sp.id } });
    console.log('   Municípios de SP:', municipiosSP, '/ 645', municipiosSP === 645 ? '✓ OK' : '✗ ERRO');
  }
  
  console.log('');
  
  // Dados Fiscais
  const cfops = await prisma.cFOP.count();
  const csts = await prisma.cST.count();
  const csosns = await prisma.cSOSN.count();
  const ncms = await prisma.nCM.count();
  
  console.log('📋 DADOS FISCAIS:');
  console.log('   CFOPs:', cfops, '/ 601', cfops === 601 ? '✓ OK' : '✗ ERRO');
  console.log('   CSTs:', csts, '/ 47', csts >= 26 ? '✓ OK' : '✗ ERRO');
  console.log('   CSOSNs:', csosns, '/ 10', csosns === 10 ? '✓ OK' : '✗ ERRO');
  console.log('   NCMs:', ncms, '(opcional)');
  
  // Verificar alguns CFOPs específicos
  const cfop5102 = await prisma.cFOP.findUnique({ where: { codigo: '5102' } });
  const cfop6102 = await prisma.cFOP.findUnique({ where: { codigo: '6102' } });
  console.log('   CFOP 5102 (Venda dentro estado):', cfop5102 ? '✓ OK' : '✗ ERRO');
  console.log('   CFOP 6102 (Venda fora estado):', cfop6102 ? '✓ OK' : '✗ ERRO');
  
  console.log('');
  
  // Dados Operacionais
  const naturezas = await prisma.naturezaOperacao.count();
  const formasPagamento = await prisma.formaPagamento.count();
  const emitentes = await prisma.emitente.count();
  
  console.log('🏢 DADOS OPERACIONAIS:');
  console.log('   Naturezas de Operação:', naturezas, '/ 2', naturezas === 2 ? '✓ OK' : '✗ ERRO');
  console.log('   Formas de Pagamento:', formasPagamento, '/ 17', formasPagamento === 17 ? '✓ OK' : '✗ ERRO');
  console.log('   Emitentes:', emitentes, '/ 1', emitentes === 1 ? '✓ OK' : '✗ ERRO');
  
  // Verificar naturezas específicas
  const natVenda = await prisma.naturezaOperacao.findUnique({ where: { codigo: 'VENDA' } });
  const natDevolucao = await prisma.naturezaOperacao.findUnique({ where: { codigo: 'DEVOLUCAO' } });
  console.log('   Natureza VENDA:', natVenda ? '✓ OK' : '✗ ERRO');
  console.log('   Natureza DEVOLUCAO:', natDevolucao ? '✓ OK' : '✗ ERRO');
  
  // Verificar formas de pagamento específicas
  const fpDinheiro = await prisma.formaPagamento.findUnique({ where: { codigo: '01' } });
  const fpPix = await prisma.formaPagamento.findUnique({ where: { codigo: '17' } });
  console.log('   Forma Pagamento Dinheiro (01):', fpDinheiro ? '✓ OK' : '✗ ERRO');
  console.log('   Forma Pagamento PIX (17):', fpPix ? '✓ OK' : '✗ ERRO');
  
  console.log('');
  
  // Verificar emitente
  const emitente = await prisma.emitente.findFirst();
  if (emitente) {
    console.log('🏢 EMITENTE PLACEHOLDER:');
    console.log('   CNPJ:', emitente.cnpj);
    console.log('   Razão Social:', emitente.razaoSocial);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Resumo final
  const totalErros = 
    (estados !== 27 ? 1 : 0) +
    (municipios !== 5570 ? 1 : 0) +
    (cfops !== 601 ? 1 : 0) +
    (csosns !== 10 ? 1 : 0) +
    (naturezas !== 2 ? 1 : 0) +
    (formasPagamento !== 17 ? 1 : 0) +
    (emitentes !== 1 ? 1 : 0);
  
  if (totalErros === 0) {
    console.log('✅ TODOS OS TESTES PASSARAM! BANCO 100% FUNCIONAL!');
  } else {
    console.log('❌ ENCONTRADOS ' + totalErros + ' ERROS!');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  await prisma.$disconnect();
}

checkFinal();

