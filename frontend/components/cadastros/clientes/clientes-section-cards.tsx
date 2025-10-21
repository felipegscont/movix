"use client"

import { IconTrendingUp, IconUsers, IconUserCheck, IconUserPlus } from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useClientes } from "@/hooks/clientes/use-clientes"

export function ClientesSectionCards() {
  const { stats, statsLoading: loading } = useClientes()

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
            <IconUsers className="h-4 w-4" />
            Total
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.totalClientes.toLocaleString('pt-BR')}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconUserCheck className="h-4 w-4 text-green-600" />
            Ativos
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.clientesAtivos.toLocaleString('pt-BR')}
            <span className="ml-2 text-sm font-normal text-green-600">
              {((stats.clientesAtivos / stats.totalClientes) * 100).toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <IconUserPlus className="h-4 w-4 text-blue-600" />
            Novos (mês)
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {stats.clientesNovos.toLocaleString('pt-BR')}
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
            {formatPercentage(stats.crescimentoMes)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
