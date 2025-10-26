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
import { IconHome, IconHistory } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Página de Histórico de Compras
 * 
 * Timeline completo de interações e compras de cada cliente
 */
export default function HistoricoComprasPage() {
  const eventos = [
    {
      data: "26/10/2025 - 14:30",
      tipo: "email",
      titulo: "Email enviado: Proposta Comercial",
      status: "Aberto",
    },
    {
      data: "20/10/2025 - 10:15",
      tipo: "ligacao",
      titulo: "Ligação realizada (15 min)",
      status: "Follow-up proposta",
    },
    {
      data: "15/10/2025",
      tipo: "pedido",
      titulo: "Pedido #1234 - R$ 5.800,00",
      status: "Entregue",
    },
    {
      data: "10/10/2025",
      tipo: "reuniao",
      titulo: "Reunião presencial",
      status: "Apresentação de produtos",
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
                  <IconHistory className="h-4 w-4" />
                  Histórico de Compras
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Histórico de Compras</h1>
              <p className="text-muted-foreground">
                Timeline completo de interações e compras dos clientes
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.245</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 3.450</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.892</div>
                <p className="text-xs text-muted-foreground">Emails, ligações e reuniões</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Timeline de Eventos</CardTitle>
              <CardDescription>
                Histórico de todas as interações com clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventos.map((evento, index) => (
                  <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <IconHistory className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{evento.titulo}</h4>
                        <span className="text-sm text-muted-foreground">{evento.data}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{evento.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

