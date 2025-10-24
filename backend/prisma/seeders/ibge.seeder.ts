/**
 * Seeder para dados geográficos do IBGE
 * Popula estados e municípios brasileiros usando dados estáticos (JSON)
 *
 * Fonte dos dados: https://github.com/kelvins/municipios-brasileiros
 * Dados oficiais do IBGE
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

interface EstadoJSON {
  codigo_uf: number
  uf: string
  nome: string
  regiao: string
}

interface MunicipioJSON {
  codigo_ibge: number
  nome: string
  codigo_uf: number
}

function loadEstados(): EstadoJSON[] {
  const filePath = path.join(__dirname, '../data/estados.json')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

function loadMunicipios(): MunicipioJSON[] {
  const filePath = path.join(__dirname, '../data/municipios.json')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

export async function seedEstados(prisma: PrismaClient): Promise<void> {
  const existingCount = await prisma.estado.count()

  if (existingCount === 27) {
    console.log(`   ℹ️  ${existingCount} estados já existem (completo), pulando...`)
    return
  }

  if (existingCount > 0 && existingCount < 27) {
    console.log(`   ⚠️  Apenas ${existingCount}/27 estados existem. Completando...`)
  }

  console.log('   📥 Carregando estados do arquivo JSON...')
  const estados = loadEstados()

  console.log(`   💾 Salvando ${estados.length} estados...`)

  const result = await prisma.estado.createMany({
    data: estados.map(estado => ({
      codigo: estado.codigo_uf.toString(),
      uf: estado.uf,
      nome: estado.nome,
      regiao: estado.regiao,
      ativo: true,
    })),
    skipDuplicates: true,
  })

  const inserted = result.count || 0
  const totalFinal = existingCount + inserted
  console.log(`   ✅ ${inserted} estados inseridos (Total: ${totalFinal}/27)`)
}

export async function seedMunicipios(prisma: PrismaClient): Promise<void> {
  // Verificar se já temos municípios completos
  const existingCount = await prisma.municipio.count()

  // Brasil tem exatamente 5.570 municípios (dados de 2024)
  if (existingCount >= 5570) {
    console.log(`   ℹ️  ${existingCount} municípios já existem (completo), pulando...`)
    return
  }

  if (existingCount > 0 && existingCount < 5570) {
    console.log(`   ⚠️  Apenas ${existingCount}/5570 municípios existem. Completando...`)
  }

  // Buscar todos os estados do banco
  const estados = await prisma.estado.findMany({
    select: { id: true, uf: true, codigo: true },
  })

  if (estados.length < 27) {
    console.log(`   ⚠️  Apenas ${estados.length}/27 estados encontrados. Execute seedEstados() primeiro.`)
    return
  }

  // Criar mapa de UF -> Estado ID
  const estadoMap = new Map<number, string>()
  estados.forEach(estado => {
    estadoMap.set(parseInt(estado.codigo), estado.id)
  })

  console.log('   📥 Carregando TODOS os municípios do arquivo JSON...')
  const municipios = loadMunicipios()

  console.log(`   💾 Processando ${municipios.length} municípios...`)

  // Preparar dados dos municípios
  const municipiosData = municipios
    .map(municipio => {
      const estadoId = estadoMap.get(municipio.codigo_uf)
      if (!estadoId) {
        console.warn(`   ⚠️  Estado não encontrado para código UF: ${municipio.codigo_uf}`)
        return null
      }
      return {
        codigo: municipio.codigo_ibge.toString(),
        nome: municipio.nome,
        estadoId: estadoId,
        ativo: true,
      }
    })
    .filter(m => m !== null) as Array<{
      codigo: string
      nome: string
      estadoId: string
      ativo: boolean
    }>

  console.log(`   💾 Inserindo ${municipiosData.length} municípios no banco...`)

  // Inserir municípios em lote (skipDuplicates evita erros)
  const result = await prisma.municipio.createMany({
    data: municipiosData,
    skipDuplicates: true,
  })

  const inserted = result.count || 0
  const totalFinal = await prisma.municipio.count()

  console.log('')
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`   ✅ SEED DE MUNICÍPIOS CONCLUÍDO!`)
  console.log(`      • Municípios no arquivo: ${municipios.length}`)
  console.log(`      • Municípios inseridos: ${inserted}`)
  console.log(`      • Total no banco: ${totalFinal}/5570`)
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

