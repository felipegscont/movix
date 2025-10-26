"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { AppSidebar } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconShoppingCart,
  IconFileInvoice,
  IconTrash,
  IconHome
} from "@tabler/icons-react"
import { toast } from "sonner"
import { PedidoService, type Pedido } from "@/lib/services/pedido.service"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PedidoDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadPedido()
    }
  }, [id])

  const loadPedido = async () => {
    try {
      setLoading(true)
      const data = await PedidoService.getById(id)
      setPedido(data)
    } catch (error) {
      console.error("Erro ao carregar pedido:", error)
      toast.error("Erro ao carregar pedido")
      router.push("/vendas/pedidos")
    } finally {
      setLoading(false)
    }
  }

  const handleExcluir = async () => {
    try {
      await PedidoService.delete(id)
      toast.success("Pedido excluído com sucesso!")
      router.push("/vendas/pedidos")
    } catch (error: any) {
      console.error("Erro ao excluir pedido:", error)
      toast.error(error.message || "Erro ao excluir pedido")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
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
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Skeleton className="h-4 w-64" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
                <div className="border rounded-lg">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border-b last:border-b-0">
                      <Skeleton className="h-4 w-full" />
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

  if (!pedido) {
    return null
  }

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
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/vendas/pedidos" className="flex items-center gap-1.5">
                    <IconShoppingCart className="h-4 w-4" />
                    Pedidos
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>#{pedido.numero}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Pedido #{pedido.numero}
                  </h2>
                  <p className="text-muted-foreground">
                    {getStatusBadge(pedido.status)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {pedido.status === 'ABERTO' && (
                    <>
                      <Button
                        onClick={() => toast.info("Funcionalidade de faturamento em desenvolvimento")}
                      >
                        <IconFileInvoice className="mr-2 h-4 w-4" />
                        Faturar Pedido
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <IconTrash className="mr-2 h-4 w-4" />
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleExcluir}>
                              Confirmar Exclusão
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>

              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                    <p className="text-lg font-semibold">{pedido.cliente?.nome}</p>
                    <p className="text-sm text-muted-foreground">{pedido.cliente?.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                    <p className="text-lg">{pedido.vendedorNome || "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                    <p className="text-lg">
                      {format(new Date(pedido.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Entrega</p>
                    <p className="text-lg">
                      {pedido.dataEntrega 
                        ? format(new Date(pedido.dataEntrega), "dd/MM/yyyy", { locale: ptBR })
                        : "Não definida"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Itens */}
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Valor Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedido.itens?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.numeroItem}</TableCell>
                          <TableCell>{item.codigo}</TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell className="text-right">
                            {item.quantidade} {item.unidade}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.valorUnitario)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.valorTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagamentos */}
              {pedido.pagamentos && pedido.pagamentos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Condições de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parcela</TableHead>
                          <TableHead>Forma de Pagamento</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pedido.pagamentos.map((pagamento) => (
                          <TableRow key={pagamento.id}>
                            <TableCell>{pagamento.parcela}</TableCell>
                            <TableCell>{pagamento.formaPagamento?.descricao}</TableCell>
                            <TableCell>
                              {format(new Date(pagamento.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(pagamento.valor)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Totais */}
              <Card>
                <CardHeader>
                  <CardTitle>Totais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(pedido.subtotal)}</span>
                  </div>
                  {pedido.valorDesconto > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto:</span>
                      <span className="font-medium">-{formatCurrency(pedido.valorDesconto)}</span>
                    </div>
                  )}
                  {pedido.valorFrete > 0 && (
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span className="font-medium">{formatCurrency(pedido.valorFrete)}</span>
                    </div>
                  )}
                  {pedido.valorOutros > 0 && (
                    <div className="flex justify-between">
                      <span>Outros:</span>
                      <span className="font-medium">{formatCurrency(pedido.valorOutros)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(pedido.valorTotal)}</span>
                  </div>
                </CardContent>
              </Card>

              {pedido.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{pedido.observacoes}</p>
                  </CardContent>
                </Card>
              )}

              {/* NFes Vinculadas */}
              {pedido.nfes && pedido.nfes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notas Fiscais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pedido.nfes.map((nfe: any) => (
                        <div key={nfe.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">NFe #{nfe.numero} - Série {nfe.serie}</p>
                            <p className="text-sm text-muted-foreground">
                              {nfe.chave || "Chave não disponível"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/nfes/${nfe.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

