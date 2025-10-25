"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { IconBuilding, IconFileInvoice, IconArrowRight, IconHome, IconSettings } from "@tabler/icons-react"

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">
                      <IconHome className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconSettings className="h-4 w-4" />
                    Configurações
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

