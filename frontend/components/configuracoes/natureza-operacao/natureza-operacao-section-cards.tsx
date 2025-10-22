"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconFileInvoice, IconArrowUpRight, IconArrowDownRight, IconCheck } from "@tabler/icons-react"
import { NaturezaOperacao } from "@/lib/services/natureza-operacao.service"

interface NaturezaOperacaoSectionCardsProps {
  naturezas: NaturezaOperacao[]
}

export function NaturezaOperacaoSectionCards({ naturezas }: NaturezaOperacaoSectionCardsProps) {
  const total = naturezas.length
  const ativas = naturezas.filter(n => n.ativo).length
  const saida = naturezas.filter(n => n.tipoOperacao === 1).length
  const entrada = naturezas.filter(n => n.tipoOperacao === 0).length

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

