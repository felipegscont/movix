import { PrismaClient } from '@prisma/client';
import { seedFiscalTables } from './seeds/fiscal';

const prisma = new PrismaClient();

async function seedEstados() {
  const estados = [
    { codigo: '12', uf: 'AC', nome: 'Acre', regiao: 'Norte' },
    { codigo: '27', uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
    { codigo: '16', uf: 'AP', nome: 'Amapá', regiao: 'Norte' },
    { codigo: '13', uf: 'AM', nome: 'Amazonas', regiao: 'Norte' },
    { codigo: '29', uf: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
    { codigo: '23', uf: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
    { codigo: '53', uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
    { codigo: '32', uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
    { codigo: '52', uf: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
    { codigo: '21', uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
    { codigo: '51', uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
    { codigo: '50', uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
    { codigo: '31', uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
    { codigo: '15', uf: 'PA', nome: 'Pará', regiao: 'Norte' },
    { codigo: '25', uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
    { codigo: '41', uf: 'PR', nome: 'Paraná', regiao: 'Sul' },
    { codigo: '26', uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
    { codigo: '22', uf: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
    { codigo: '33', uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
    { codigo: '24', uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
    { codigo: '43', uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
    { codigo: '11', uf: 'RO', nome: 'Rondônia', regiao: 'Norte' },
    { codigo: '14', uf: 'RR', nome: 'Roraima', regiao: 'Norte' },
    { codigo: '42', uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
    { codigo: '35', uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
    { codigo: '28', uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
    { codigo: '17', uf: 'TO', nome: 'Tocantins', regiao: 'Norte' },
  ];

  for (const estado of estados) {
    await prisma.estado.upsert({
      where: { uf: estado.uf },
      update: {},
      create: estado,
    });
  }
}

async function seedMunicipios() {
  const estadoSP = await prisma.estado.findUnique({ where: { uf: 'SP' } });
  const estadoRJ = await prisma.estado.findUnique({ where: { uf: 'RJ' } });
  const estadoMG = await prisma.estado.findUnique({ where: { uf: 'MG' } });
  const estadoMA = await prisma.estado.findUnique({ where: { uf: 'MA' } });
  const estadoGO = await prisma.estado.findUnique({ where: { uf: 'GO' } });

  if (!estadoSP || !estadoRJ || !estadoMG || !estadoMA || !estadoGO) {
    throw new Error('Estados não encontrados');
  }

  const municipios = [
    { codigo: '3550308', nome: 'São Paulo', estadoId: estadoSP.id },
    { codigo: '3304557', nome: 'Rio de Janeiro', estadoId: estadoRJ.id },
    { codigo: '3106200', nome: 'Belo Horizonte', estadoId: estadoMG.id },
    { codigo: '2105302', nome: 'Imperatriz', estadoId: estadoMA.id },
    { codigo: '2104552', nome: 'Governador Edison Lobão', estadoId: estadoMA.id },
    { codigo: '5208707', nome: 'Goiânia', estadoId: estadoGO.id },
  ];

  for (const municipio of municipios) {
    await prisma.municipio.upsert({
      where: { codigo: municipio.codigo },
      update: {},
      create: municipio,
    });
  }
}

async function seedNCMs() {
  const ncms = [
    { codigo: '44152000', descricao: 'Paletes, coleiras e outras plataformas para carga, de madeira', unidade: 'UN' },
    { codigo: '87164000', descricao: 'Reboques e semi-reboques, para qualquer veículo; outros veículos não autopropulsados', unidade: 'UN' },
    { codigo: '84716000', descricao: 'Unidades de entrada ou de saída, podendo conter, no mesmo corpo, unidades de memória', unidade: 'UN' },
    { codigo: '85171200', descricao: 'Telefones para redes celulares ou para outras redes sem fio', unidade: 'UN' },
  ];

  for (const ncm of ncms) {
    await prisma.nCM.upsert({
      where: { codigo: ncm.codigo },
      update: {},
      create: ncm,
    });
  }
}

async function seedNaturezas() {
  const cfop5102 = await prisma.cFOP.findUnique({ where: { codigo: '5102' } });
  const cfop6102 = await prisma.cFOP.findUnique({ where: { codigo: '6102' } });
  const cfop5101 = await prisma.cFOP.findUnique({ where: { codigo: '5101' } });
  const cfop6101 = await prisma.cFOP.findUnique({ where: { codigo: '6101' } });

  const naturezas = [
    {
      codigo: 'VENDA',
      descricao: 'Venda de mercadoria',
      cfopDentroEstadoId: cfop5102?.id,
      cfopForaEstadoId: cfop6102?.id,
      tipoOperacao: 1,
      finalidade: 1,
      consumidorFinal: 1,
      presencaComprador: 1,
    },
    {
      codigo: 'VENDA_PROD',
      descricao: 'Venda de produção do estabelecimento',
      cfopDentroEstadoId: cfop5101?.id,
      cfopForaEstadoId: cfop6101?.id,
      tipoOperacao: 1,
      finalidade: 1,
      consumidorFinal: 1,
      presencaComprador: 1,
    },
  ];

  for (const natureza of naturezas) {
    await prisma.naturezaOperacao.upsert({
      where: { codigo: natureza.codigo },
      update: {},
      create: natureza,
    });
  }
}

async function main() {
  console.log('🌱 Seed iniciado');

  console.log('📍 Estados');
  await seedEstados();

  console.log('🏙️ Municípios');
  await seedMunicipios();

  console.log('📦 NCMs');
  await seedNCMs();

  console.log('🔢 Tabelas Fiscais (CFOP, CST, CSOSN)');
  await seedFiscalTables(prisma);

  console.log('📋 Naturezas de Operação');
  await seedNaturezas();

  console.log('✅ Seed concluído');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
