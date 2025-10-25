"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar, SiteHeader, SidebarLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconHome, IconSettings } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ConfiguracoesPage() {
  const router = useRouter()

  return (
    <SidebarLayout>
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
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => router.push('/configuracoes/emitente')}>
                  <CardHeader>
                    <CardTitle>Emitente</CardTitle>
                    <CardDescription>
                      Configurar dados da empresa e certificado digital
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => router.push('/configuracoes/naturezas-operacao')}>
                  <CardHeader>
                    <CardTitle>Naturezas de Operação</CardTitle>
                    <CardDescription>
                      Gerenciar naturezas de operação e CFOPs
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

