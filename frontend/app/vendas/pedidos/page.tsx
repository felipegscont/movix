"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconShoppingCart, IconFileInvoice } from "@tabler/icons-react"
import { toast } from "sonner"
import { PedidoService, type Pedido } from "@/lib/services/pedido.service"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadPedidos()
  }, [page])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const response = await PedidoService.getAll({ page, limit: 20 })
      setPedidos(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      toast.error("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ABERTO: "default",
      FATURADO: "secondary",
      CANCELADO: "destructive",
    }

    const labels: Record<string, string> = {
      ABERTO: "Aberto",
      FATURADO: "Faturado",
      CANCELADO: "Cancelado",
    }

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Pedidos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Pedidos de Venda</h2>
                  <p className="text-muted-foreground">
                    Gerencie seus pedidos de venda
                  </p>
                </div>
                <Button onClick={() => router.push("/vendas/pedidos/novo")}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Novo Pedido
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Pedidos</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todos os pedidos cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <IconShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/vendas/pedidos/novo")}
                      >
                        Criar primeiro pedido
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">PEDIDO</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead>CLIENTE</TableHead>
                            <TableHead>ENTREGA</TableHead>
                            <TableHead className="text-right">VALOR</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pedidos.map((pedido) => (
                            <TableRow 
                              key={pedido.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => router.push(`/vendas/pedidos/${pedido.id}`)}
                            >
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-bold text-lg">#{pedido.numero}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Emitido em: {format(new Date(pedido.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                                  </div>
                                  {pedido.status === 'FATURADO' && pedido.nfes && pedido.nfes.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      Faturado em: {format(new Date(pedido.nfes[0].dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                                    </div>
                                  )}
                                  {pedido.vendedorNome && (
                                    <div className="text-xs text-muted-foreground">
                                      Vendedor: {pedido.vendedorNome}
                                    </div>
                                  )}
                                  {pedido.nfes && pedido.nfes.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <IconFileInvoice className="h-3 w-3 mr-1" />
                                      NFe
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(pedido.status)}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{pedido.cliente?.nome}</div>
                                  <div className="text-xs text-muted-foreground">
                                    CNPJ: {pedido.cliente?.documento}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {pedido.dataEntrega ? (
                                    <>
                                      <div>{format(new Date(pedido.dataEntrega), "dd/MM/yyyy", { locale: ptBR })}</div>
                                      {pedido.status === 'FATURADO' && (
                                        <Badge variant="secondary" className="text-xs">
                                          Entregue
                                        </Badge>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Não definida</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-lg">
                                  {formatCurrency(pedido.valorTotal)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {pedido._count?.itens || pedido.itens?.length || 0} {(pedido._count?.itens || pedido.itens?.length || 0) === 1 ? 'item' : 'itens'}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                          >
                            Anterior
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Página {page} de {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                          >
                            Próxima
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

