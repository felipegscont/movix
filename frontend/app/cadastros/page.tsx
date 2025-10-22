"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconBuilding, IconPackage, IconArrowRight } from "@tabler/icons-react"

export default function CadastrosPage() {
  const cadastros = [
    {
      title: "Clientes",
      description: "Gerencie seus clientes e destinatários de notas fiscais",
      icon: IconUsers,
      href: "/cadastros/clientes",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Fornecedores",
      description: "Cadastre e gerencie seus fornecedores",
      icon: IconBuilding,
      href: "/cadastros/fornecedores",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Produtos",
      description: "Cadastre produtos e configure impostos",
      icon: IconPackage,
      href: "/cadastros/produtos",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cadastros</h2>
        <p className="text-muted-foreground">
          Gerencie clientes, fornecedores e produtos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cadastros.map((cadastro) => {
          const Icon = cadastro.icon
          return (
            <Link key={cadastro.href} href={cadastro.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${cadastro.bgColor}`}>
                      <Icon className={`h-6 w-6 ${cadastro.color}`} />
                    </div>
                    <IconArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{cadastro.title}</CardTitle>
                  <CardDescription>{cadastro.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

