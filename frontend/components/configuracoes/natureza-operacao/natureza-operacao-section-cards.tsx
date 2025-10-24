"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconFileInvoice, IconArrowUpRight, IconArrowDownRight, IconCheck } from "@tabler/icons-react"
import { NaturezaOperacao, NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"
import { Skeleton } from "@/components/ui/skeleton"

export function NaturezaOperacaoSectionCards() {
  const [naturezas, setNaturezas] = useState<NaturezaOperacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await NaturezaOperacaoService.getAll({ page: 1, limit: 1000 })
      setNaturezas(response.data)
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error)
    } finally {
      setLoading(false)
    }
  }

  const total = naturezas.length
  const ativas = naturezas.filter(n => n.ativa).length
  const saida = naturezas.filter(n => n.tipo === 1).length
  const entrada = naturezas.filter(n => n.tipo === 0).length

  const cards = [
    {
      title: "Total",
      value: total,
      icon: IconFileInvoice,
      description: "Naturezas cadastradas",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Ativas",
      value: ativas,
      icon: IconCheck,
      description: "Disponíveis para uso",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Saída",
      value: saida,
      icon: IconArrowUpRight,
      description: "Operações de saída",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Entrada",
      value: entrada,
      icon: IconArrowDownRight,
      description: "Operações de entrada",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

