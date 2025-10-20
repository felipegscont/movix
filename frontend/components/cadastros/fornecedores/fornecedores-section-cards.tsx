"use client"

import { useState, useEffect } from "react"
import { IconBuilding, IconBuildingStore, IconTrendingUp, IconCheck } from "@tabler/icons-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FornecedorStats {
  totalFornecedores: number
  fornecedoresAtivos: number
  fornecedoresPJ: number
  crescimentoMes: number
}

export function FornecedoresSectionCards() {
  const [stats, setStats] = useState<FornecedorStats>({
    totalFornecedores: 0,
    fornecedoresAtivos: 0,
    fornecedoresPJ: 0,
    crescimentoMes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Simular dados por enquanto - depois integrar com API real
      setStats({
        totalFornecedores: 142,
        fornecedoresAtivos: 138,
        fornecedoresPJ: 89,
        crescimentoMes: 8.2,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-9 bg-muted rounded w-24"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconBuilding className="h-4 w-4" />
            Total
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.totalFornecedores.toLocaleString('pt-BR')}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconCheck className="h-4 w-4 text-green-600" />
            Ativos
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.fornecedoresAtivos.toLocaleString('pt-BR')}
            <span className="ml-2 text-sm font-normal text-green-600">
              {((stats.fornecedoresAtivos / stats.totalFornecedores) * 100).toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconBuildingStore className="h-4 w-4 text-blue-600" />
            Pessoa Jurídica
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.fornecedoresPJ.toLocaleString('pt-BR')}
            <span className="ml-2 text-sm font-normal text-blue-600">
              {((stats.fornecedoresPJ / stats.totalFornecedores) * 100).toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4" />
            Crescimento
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            +{stats.crescimentoMes.toFixed(1)}%
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
