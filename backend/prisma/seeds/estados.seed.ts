import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Todos os 27 estados brasileiros com dados oficiais do IBGE
 */
const ESTADOS_BRASILEIROS = [
  // Região Norte
  { codigo: '11', uf: 'RO', nome: 'Rondônia', regiao: 'Norte' },
  { codigo: '12', uf: 'AC', nome: 'Acre', regiao: 'Norte' },
  { codigo: '13', uf: 'AM', nome: 'Amazonas', regiao: 'Norte' },
  { codigo: '14', uf: 'RR', nome: 'Roraima', regiao: 'Norte' },
  { codigo: '15', uf: 'PA', nome: 'Pará', regiao: 'Norte' },
  { codigo: '16', uf: 'AP', nome: 'Amapá', regiao: 'Norte' },
  { codigo: '17', uf: 'TO', nome: 'Tocantins', regiao: 'Norte' },

  // Região Nordeste
  { codigo: '21', uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
  { codigo: '22', uf: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
  { codigo: '23', uf: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
  { codigo: '24', uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { codigo: '25', uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
  { codigo: '26', uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
  { codigo: '27', uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
  { codigo: '28', uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
  { codigo: '29', uf: 'BA', nome: 'Bahia', regiao: 'Nordeste' },

  // Região Sudeste
  { codigo: '31', uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
  { codigo: '32', uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
  { codigo: '33', uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
  { codigo: '35', uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },

  // Região Sul
  { codigo: '41', uf: 'PR', nome: 'Paraná', regiao: 'Sul' },
  { codigo: '42', uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
  { codigo: '43', uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },

  // Região Centro-Oeste
  { codigo: '50', uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  { codigo: '51', uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
  { codigo: '52', uf: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
  { codigo: '53', uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
];

export async function seedEstados() {
  console.log('🌎 Iniciando seed de estados brasileiros...');

  let criados = 0;
  let atualizados = 0;
  let erros = 0;

  for (const estado of ESTADOS_BRASILEIROS) {
    try {
      const result = await prisma.estado.upsert({
        where: { uf: estado.uf },
        update: {
          codigo: estado.codigo,
          nome: estado.nome,
          regiao: estado.regiao,
          ativo: true,
          updatedAt: new Date(),
        },
        create: {
          codigo: estado.codigo,
          uf: estado.uf,
          nome: estado.nome,
          regiao: estado.regiao,
          ativo: true,
        },
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        criados++;
        console.log(`  ✅ Criado: ${estado.uf} - ${estado.nome}`);
      } else {
        atualizados++;
        console.log(`  🔄 Atualizado: ${estado.uf} - ${estado.nome}`);
      }
    } catch (error) {
      erros++;
      console.error(`  ❌ Erro ao processar ${estado.uf}: ${error.message}`);
    }
  }

  console.log('\n📊 Resumo do seed de estados:');
  console.log(`  ✅ Criados: ${criados}`);
  console.log(`  🔄 Atualizados: ${atualizados}`);
  console.log(`  ❌ Erros: ${erros}`);
  console.log(`  📍 Total: ${ESTADOS_BRASILEIROS.length} estados`);

  // Verificar total no banco
  const totalNoBanco = await prisma.estado.count({ where: { ativo: true } });
  console.log(`  💾 Total no banco: ${totalNoBanco} estados ativos`);

  if (totalNoBanco === 27) {
    console.log('  ✅ Todos os 27 estados brasileiros estão no banco!');
  } else {
    console.log(`  ⚠️  Atenção: Esperado 27 estados, encontrado ${totalNoBanco}`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedEstados()
    .then(() => {
      console.log('\n✅ Seed de estados concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro ao executar seed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

