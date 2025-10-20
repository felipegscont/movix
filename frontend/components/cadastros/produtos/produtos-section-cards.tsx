"use client"

import { useState, useEffect } from "react"
import { IconTrendingUp, IconPackage, IconPackageExport, IconCurrencyReal } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProdutoStats {
  totalProdutos: number
  produtosAtivos: number
  valorMedioUnitario: number
  crescimentoMes: number
}

export function ProdutosSectionCards() {
  const [stats, setStats] = useState<ProdutoStats>({
    totalProdutos: 0,
    produtosAtivos: 0,
    valorMedioUnitario: 0,
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
        totalProdutos: 856,
        produtosAtivos: 798,
        valorMedioUnitario: 125.50,
        crescimentoMes: 5.2,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
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
            <IconPackage className="h-4 w-4" />
            Total
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.totalProdutos.toLocaleString('pt-BR')}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconPackageExport className="h-4 w-4 text-green-600" />
            Ativos
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.produtosAtivos.toLocaleString('pt-BR')}
            <span className="ml-2 text-sm font-normal text-green-600">
              {((stats.produtosAtivos / stats.totalProdutos) * 100).toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyReal className="h-4 w-4 text-blue-600" />
            Valor Médio
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {formatCurrency(stats.valorMedioUnitario)}
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
