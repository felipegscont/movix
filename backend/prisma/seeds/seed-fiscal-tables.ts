import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Script para popular todas as tabelas fiscais (CFOP, CST, CSOSN, NCM, CEST)
 * 
 * Uso:
 * npx ts-node prisma/seeds/seed-fiscal-tables.ts
 */

async function seedCFOP() {
  console.log('🔄 Populando tabela CFOP...');
  
  const cfopData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/cfop.json'), 'utf-8')
  );

  let count = 0;
  for (const cfop of cfopData.list) {
    await prisma.cfop.upsert({
      where: { codigo: cfop.codigo },
      update: {
        descricao: cfop.descricao,
        tipo: cfop.codigo.startsWith('1') || cfop.codigo.startsWith('2') || cfop.codigo.startsWith('3') 
          ? 'ENTRADA' 
          : 'SAIDA',
      },
      create: {
        codigo: cfop.codigo,
        descricao: cfop.descricao,
        tipo: cfop.codigo.startsWith('1') || cfop.codigo.startsWith('2') || cfop.codigo.startsWith('3') 
          ? 'ENTRADA' 
          : 'SAIDA',
      },
    });
    count++;
  }

  console.log(`✅ ${count} CFOPs inseridos/atualizados`);
}

async function seedCSTICMS() {
  console.log('🔄 Populando tabela CST ICMS...');
  
  const csts = [
    { codigo: '00', descricao: 'Tributada integralmente' },
    { codigo: '10', descricao: 'Tributada e com cobrança do ICMS por substituição tributária' },
    { codigo: '20', descricao: 'Com redução de base de cálculo' },
    { codigo: '30', descricao: 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária' },
    { codigo: '40', descricao: 'Isenta' },
    { codigo: '41', descricao: 'Não tributada' },
    { codigo: '50', descricao: 'Suspensão' },
    { codigo: '51', descricao: 'Diferimento' },
    { codigo: '60', descricao: 'ICMS cobrado anteriormente por substituição tributária' },
    { codigo: '70', descricao: 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária' },
    { codigo: '90', descricao: 'Outras' },
  ];

  for (const cst of csts) {
    await prisma.cST.upsert({
      where: { codigo_tipo: { codigo: cst.codigo, tipo: 'ICMS' } },
      update: { descricao: cst.descricao },
      create: {
        codigo: cst.codigo,
        descricao: cst.descricao,
        tipo: 'ICMS',
      },
    });
  }

  console.log(`✅ ${csts.length} CSTs ICMS inseridos/atualizados`);
}

async function seedCSOSN() {
  console.log('🔄 Populando tabela CSOSN...');
  
  const csosns = [
    { codigo: '101', descricao: 'Tributada pelo Simples Nacional com permissão de crédito' },
    { codigo: '102', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito' },
    { codigo: '103', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta' },
    { codigo: '201', descricao: 'Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária' },
    { codigo: '202', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária' },
    { codigo: '203', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por substituição tributária' },
    { codigo: '300', descricao: 'Imune' },
    { codigo: '400', descricao: 'Não tributada pelo Simples Nacional' },
    { codigo: '500', descricao: 'ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação' },
    { codigo: '900', descricao: 'Outros' },
  ];

  for (const csosn of csosns) {
    await prisma.cSOSN.upsert({
      where: { codigo: csosn.codigo },
      update: { descricao: csosn.descricao },
      create: {
        codigo: csosn.codigo,
        descricao: csosn.descricao,
      },
    });
  }

  console.log(`✅ ${csosns.length} CSOSNs inseridos/atualizados`);
}

async function seedCSTPIS() {
  console.log('🔄 Populando tabela CST PIS...');
  
  const csts = [
    { codigo: '01', descricao: 'Operação Tributável com Alíquota Básica' },
    { codigo: '02', descricao: 'Operação Tributável com Alíquota Diferenciada' },
    { codigo: '03', descricao: 'Operação Tributável com Alíquota por Unidade de Medida de Produto' },
    { codigo: '04', descricao: 'Operação Tributável Monofásica - Revenda a Alíquota Zero' },
    { codigo: '05', descricao: 'Operação Tributável por Substituição Tributária' },
    { codigo: '06', descricao: 'Operação Tributável a Alíquota Zero' },
    { codigo: '07', descricao: 'Operação Isenta da Contribuição' },
    { codigo: '08', descricao: 'Operação sem Incidência da Contribuição' },
    { codigo: '09', descricao: 'Operação com Suspensão da Contribuição' },
    { codigo: '49', descricao: 'Outras Operações de Saída' },
    { codigo: '50', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno' },
    { codigo: '51', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno' },
    { codigo: '52', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação' },
    { codigo: '53', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno' },
    { codigo: '54', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação' },
    { codigo: '55', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação' },
    { codigo: '56', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação' },
    { codigo: '60', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno' },
    { codigo: '61', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno' },
    { codigo: '62', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação' },
    { codigo: '63', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno' },
    { codigo: '64', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação' },
    { codigo: '65', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação' },
    { codigo: '66', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação' },
    { codigo: '67', descricao: 'Crédito Presumido - Outras Operações' },
    { codigo: '70', descricao: 'Operação de Aquisição sem Direito a Crédito' },
    { codigo: '71', descricao: 'Operação de Aquisição com Isenção' },
    { codigo: '72', descricao: 'Operação de Aquisição com Suspensão' },
    { codigo: '73', descricao: 'Operação de Aquisição a Alíquota Zero' },
    { codigo: '74', descricao: 'Operação de Aquisição sem Incidência da Contribuição' },
    { codigo: '75', descricao: 'Operação de Aquisição por Substituição Tributária' },
    { codigo: '98', descricao: 'Outras Operações de Entrada' },
    { codigo: '99', descricao: 'Outras Operações' },
  ];

  for (const cst of csts) {
    await prisma.cST.upsert({
      where: { codigo_tipo: { codigo: cst.codigo, tipo: 'PIS' } },
      update: { descricao: cst.descricao },
      create: {
        codigo: cst.codigo,
        descricao: cst.descricao,
        tipo: 'PIS',
      },
    });
  }

  console.log(`✅ ${csts.length} CSTs PIS inseridos/atualizados`);
}

async function seedCSTCOFINS() {
  console.log('🔄 Populando tabela CST COFINS...');
  
  // COFINS usa os mesmos códigos do PIS
  const csts = [
    { codigo: '01', descricao: 'Operação Tributável com Alíquota Básica' },
    { codigo: '02', descricao: 'Operação Tributável com Alíquota Diferenciada' },
    { codigo: '03', descricao: 'Operação Tributável com Alíquota por Unidade de Medida de Produto' },
    { codigo: '04', descricao: 'Operação Tributável Monofásica - Revenda a Alíquota Zero' },
    { codigo: '05', descricao: 'Operação Tributável por Substituição Tributária' },
    { codigo: '06', descricao: 'Operação Tributável a Alíquota Zero' },
    { codigo: '07', descricao: 'Operação Isenta da Contribuição' },
    { codigo: '08', descricao: 'Operação sem Incidência da Contribuição' },
    { codigo: '09', descricao: 'Operação com Suspensão da Contribuição' },
    { codigo: '49', descricao: 'Outras Operações de Saída' },
    { codigo: '50', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno' },
    { codigo: '51', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno' },
    { codigo: '52', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação' },
    { codigo: '53', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno' },
    { codigo: '54', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação' },
    { codigo: '55', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação' },
    { codigo: '56', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação' },
    { codigo: '60', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno' },
    { codigo: '61', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno' },
    { codigo: '62', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação' },
    { codigo: '63', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno' },
    { codigo: '64', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação' },
    { codigo: '65', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação' },
    { codigo: '66', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação' },
    { codigo: '67', descricao: 'Crédito Presumido - Outras Operações' },
    { codigo: '70', descricao: 'Operação de Aquisição sem Direito a Crédito' },
    { codigo: '71', descricao: 'Operação de Aquisição com Isenção' },
    { codigo: '72', descricao: 'Operação de Aquisição com Suspensão' },
    { codigo: '73', descricao: 'Operação de Aquisição a Alíquota Zero' },
    { codigo: '74', descricao: 'Operação de Aquisição sem Incidência da Contribuição' },
    { codigo: '75', descricao: 'Operação de Aquisição por Substituição Tributária' },
    { codigo: '98', descricao: 'Outras Operações de Entrada' },
    { codigo: '99', descricao: 'Outras Operações' },
  ];

  for (const cst of csts) {
    await prisma.cST.upsert({
      where: { codigo_tipo: { codigo: cst.codigo, tipo: 'COFINS' } },
      update: { descricao: cst.descricao },
      create: {
        codigo: cst.codigo,
        descricao: cst.descricao,
        tipo: 'COFINS',
      },
    });
  }

  console.log(`✅ ${csts.length} CSTs COFINS inseridos/atualizados`);
}

async function seedCSTIPI() {
  console.log('🔄 Populando tabela CST IPI...');
  
  const csts = [
    { codigo: '00', descricao: 'Entrada com Recuperação de Crédito' },
    { codigo: '01', descricao: 'Entrada Tributada com Alíquota Zero' },
    { codigo: '02', descricao: 'Entrada Isenta' },
    { codigo: '03', descricao: 'Entrada Não-Tributada' },
    { codigo: '04', descricao: 'Entrada Imune' },
    { codigo: '05', descricao: 'Entrada com Suspensão' },
    { codigo: '49', descricao: 'Outras Entradas' },
    { codigo: '50', descricao: 'Saída Tributada' },
    { codigo: '51', descricao: 'Saída Tributada com Alíquota Zero' },
    { codigo: '52', descricao: 'Saída Isenta' },
    { codigo: '53', descricao: 'Saída Não-Tributada' },
    { codigo: '54', descricao: 'Saída Imune' },
    { codigo: '55', descricao: 'Saída com Suspensão' },
    { codigo: '99', descricao: 'Outras Saídas' },
  ];

  for (const cst of csts) {
    await prisma.cST.upsert({
      where: { codigo_tipo: { codigo: cst.codigo, tipo: 'IPI' } },
      update: { descricao: cst.descricao },
      create: {
        codigo: cst.codigo,
        descricao: cst.descricao,
        tipo: 'IPI',
      },
    });
  }

  console.log(`✅ ${csts.length} CSTs IPI inseridos/atualizados`);
}

async function main() {
  console.log('🚀 Iniciando seed das tabelas fiscais...\n');

  try {
    await seedCFOP();
    await seedCSTICMS();
    await seedCSOSN();
    await seedCSTPIS();
    await seedCSTCOFINS();
    await seedCSTIPI();

    console.log('\n✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

