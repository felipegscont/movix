import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

interface NCMData {
  codigo: string
  descricao: string
  unidade?: string
}

const NCM_FILE = path.join(__dirname, '../data/ncm.json')

function loadNCMs(): NCMData[] {
  if (!fs.existsSync(NCM_FILE)) {
    throw new Error(
      'Arquivo ncm.json não encontrado. ' +
      'O arquivo deve estar em: backend/prisma/data/ncm.json'
    )
  }

  const data = fs.readFileSync(NCM_FILE, 'utf-8')
  const jsonData = JSON.parse(data)

  // Verificar formato da API Siscomex {Nomenclaturas: [...]}
  let ncmsRaw: any[]
  if (jsonData.Nomenclaturas && Array.isArray(jsonData.Nomenclaturas)) {
    ncmsRaw = jsonData.Nomenclaturas
  } else if (Array.isArray(jsonData)) {
    ncmsRaw = jsonData
  } else {
    throw new Error('Formato de arquivo NCM inválido')
  }

  // Filtrar apenas NCMs de 8 dígitos
  const ncms = ncmsRaw
    .filter((item: any) => {
      const codigo = item.Codigo || item.codigo
      return codigo && codigo.length === 8
    })
    .map((item: any) => ({
      codigo: item.Codigo || item.codigo,
      descricao: item.Descricao || item.descricao,
      unidade: item.UnidadeMedida || item.unidade || 'UN',
    }))

  return ncms
}

export async function seedNCM(prisma: PrismaClient): Promise<void> {
  const existingCount = await prisma.nCM.count()

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} NCMs já existem, pulando...`)
    return
  }

  console.log('   📥 Carregando NCMs da tabela Siscomex...')
  const ncms = loadNCMs()

  console.log(`   💾 Salvando ${ncms.length} NCMs (pode levar alguns minutos)...`)
  
  // Processar em lotes para melhor performance
  const BATCH_SIZE = 1000
  let processed = 0

  for (let i = 0; i < ncms.length; i += BATCH_SIZE) {
    const batch = ncms.slice(i, i + BATCH_SIZE)
    
    await prisma.nCM.createMany({
      data: batch,
      skipDuplicates: true,
    })

    processed += batch.length
    
    if (processed % 2000 === 0 || processed === ncms.length) {
      console.log(`      ⏳ ${processed}/${ncms.length} NCMs salvos...`)
    }
  }

  console.log(`   ✅ ${ncms.length} NCMs criados`)
}

