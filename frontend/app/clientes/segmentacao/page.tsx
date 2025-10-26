import Link from "next/link"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconHome, IconFilter } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Página de Segmentação de Clientes
 * 
 * Segmentação inteligente de clientes para campanhas direcionadas
 */
export default function SegmentacaoPage() {
  const segmentos = [
    {
      nome: "Clientes VIP",
      total: 45,
      ticketMedio: "R$ 15.500",
      descricao: "Alto valor, compras recorrentes",
    },
    {
      nome: "Clientes Recorrentes",
      total: 128,
      ticketMedio: "R$ 5.200",
      descricao: "Compram regularmente",
    },
    {
      nome: "Clientes Inativos",
      total: 67,
      ticketMedio: "R$ 3.800",
      descricao: "Sem compra há mais de 90 dias",
    },
    {
      nome: "Novos Clientes",
      total: 34,
      ticketMedio: "R$ 2.100",
      descricao: "Cadastrados nos últimos 30 dias",
    },
  ]

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/clientes">Clientes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <IconFilter className="h-4 w-4" />
                  Segmentação
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Segmentação de Clientes</h1>
              <p className="text-muted-foreground">
                Crie e gerencie segmentos de clientes para campanhas direcionadas
              </p>
            </div>
            <Button>
              <IconFilter className="mr-2 h-4 w-4" />
              Novo Segmento
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {segmentos.map((segmento) => (
              <Card key={segmento.nome}>
                <CardHeader>
                  <CardTitle className="text-base">{segmento.nome}</CardTitle>
                  <CardDescription>{segmento.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="font-semibold">{segmento.total} clientes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ticket Médio:</span>
                      <span className="font-semibold">{segmento.ticketMedio}</span>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Construtor de Segmentos</CardTitle>
              <CardDescription>
                Crie segmentos personalizados com filtros avançados (em desenvolvimento)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <IconFilter className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Construtor de Segmentos</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Interface de filtros avançados em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

