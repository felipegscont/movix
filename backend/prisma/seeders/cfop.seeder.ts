import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

interface CFOPData {
  codigo: string
  descricao: string
}

interface CFOPResponse {
  list: CFOPData[]
}

const CFOP_SOURCE = 'https://gist.githubusercontent.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67/raw'
const CFOP_FILE = path.join(__dirname, '../data/cfop.json')

function determineTipo(codigo: string): 'ENTRADA' | 'SAIDA' {
  const first = codigo.charAt(0)
  return ['1', '2', '3'].includes(first) ? 'ENTRADA' : 'SAIDA'
}

async function loadCFOPs(): Promise<Array<CFOPData & { tipo: 'ENTRADA' | 'SAIDA' }>> {
  // Tentar carregar do arquivo local primeiro
  if (fs.existsSync(CFOP_FILE)) {
    const data: CFOPResponse = JSON.parse(fs.readFileSync(CFOP_FILE, 'utf-8'))
    return data.list.map(item => ({
      codigo: item.codigo,
      descricao: item.descricao,
      tipo: determineTipo(item.codigo),
    }))
  }

  // Se não existir, baixar da API
  try {
    const response = await axios.get<CFOPResponse>(CFOP_SOURCE, { timeout: 30000 })
    
    // Salvar para uso futuro
    const dataDir = path.dirname(CFOP_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(CFOP_FILE, JSON.stringify(response.data, null, 2))
    
    return response.data.list.map(item => ({
      codigo: item.codigo,
      descricao: item.descricao,
      tipo: determineTipo(item.codigo),
    }))
  } catch (error) {
    throw new Error(`Falha ao carregar CFOPs: ${error}`)
  }
}

export async function seedCFOP(prisma: PrismaClient): Promise<void> {
  const existingCount = await prisma.cFOP.count()

  if (existingCount > 0) {
    console.log(`   ℹ️  ${existingCount} CFOPs já existem, pulando...`)
    return
  }

  console.log('   📥 Carregando CFOPs...')
  const cfops = await loadCFOPs()

  console.log(`   💾 Salvando ${cfops.length} CFOPs...`)
  
  // Usar createMany para melhor performance
  await prisma.cFOP.createMany({
    data: cfops.map(cfop => ({
      codigo: cfop.codigo,
      descricao: cfop.descricao,
      aplicacao: cfop.tipo === 'ENTRADA' ? 'Entrada' : 'Saída',
      tipo: cfop.tipo,
    })),
    skipDuplicates: true,
  })

  console.log(`   ✅ ${cfops.length} CFOPs criados`)
}

