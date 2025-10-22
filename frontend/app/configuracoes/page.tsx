"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBuilding, IconFileInvoice, IconArrowRight } from "@tabler/icons-react"

export default function ConfiguracoesPage() {
  const configuracoes = [
    {
      title: "Emitente",
      description: "Configure os dados da sua empresa emitente de notas fiscais",
      icon: IconBuilding,
      href: "/configuracoes/emitente",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Naturezas de Operação",
      description: "Configure naturezas de operação para facilitar a emissão de NFes",
      icon: IconFileInvoice,
      href: "/configuracoes/naturezas-operacao",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Configure o sistema e parâmetros fiscais
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {configuracoes.map((config) => {
          const Icon = config.icon
          return (
            <Link key={config.href} href={config.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <IconArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

