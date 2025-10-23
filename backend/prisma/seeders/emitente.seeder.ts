import { PrismaClient } from '@prisma/client'

export async function seedEmitentePlaceholder(prisma: PrismaClient): Promise<void> {
  const existingEmitente = await prisma.emitente.findFirst()

  if (existingEmitente) {
    console.log('   ℹ️  Emitente já existe, mantendo dados atuais')
    return
  }

  // Buscar ou criar Estado placeholder
  let estado = await prisma.estado.findFirst()

  if (!estado) {
    estado = await prisma.estado.create({
      data: {
        codigo: '35',
        uf: 'SP',
        nome: 'São Paulo',
        regiao: 'Sudeste',
      },
    })
  }

  // Buscar ou criar Município placeholder
  let municipio = await prisma.municipio.findFirst({
    where: { estadoId: estado.id },
  })

  if (!municipio) {
    municipio = await prisma.municipio.create({
      data: {
        codigo: '3550308',
        nome: 'São Paulo',
        estadoId: estado.id,
      },
    })
  }

  // Criar emitente placeholder com dados fake
  await prisma.emitente.create({
    data: {
      cnpj: '00000000000000',
      razaoSocial: 'CONFIGURAR EMITENTE',
      nomeFantasia: null,
      inscricaoEstadual: null,
      inscricaoMunicipal: null,
      cnae: null,
      regimeTributario: 1, // Simples Nacional (padrão mais comum)

      // Endereço placeholder
      logradouro: 'Rua a Configurar',
      numero: 'S/N',
      complemento: null,
      bairro: 'Centro',
      cep: '00000000',
      municipioId: municipio.id,
      estadoId: estado.id,

      // Contato
      telefone: null,
      email: null,
      site: null,

      // Configurações NFe
      certificadoPath: null,
      certificadoPassword: null,
      ambienteNfe: 2, // Homologação (seguro para testes)
      proximoNumeroNfe: 1,
      serieNfe: 1,

      ativo: true,
    },
  })

  console.log('   ✅ Emitente placeholder criado')
  console.log('   ⚠️  IMPORTANTE: Configure os dados reais em Configurações > Emitente')
  console.log('   ℹ️  CNPJ: 00000000000000 (fake)')
  console.log('   ℹ️  Ambiente: Homologação')
}

