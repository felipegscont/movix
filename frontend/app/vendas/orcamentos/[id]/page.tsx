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
  IconFileText,
  IconX,
  IconArrowRight,
  IconTrash
} from "@tabler/icons-react"
import { toast } from "sonner"
import { OrcamentoService, type Orcamento } from "@/lib/services/orcamento.service"
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

export default function OrcamentoDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [orcamento, setOrcamento] = useState<Orcamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    if (id) {
      loadOrcamento()
    }
  }, [id])

  const loadOrcamento = async () => {
    try {
      setLoading(true)
      const data = await OrcamentoService.getById(id)
      setOrcamento(data)
    } catch (error) {
      console.error("Erro ao carregar orçamento:", error)
      toast.error("Erro ao carregar orçamento")
      router.push("/vendas/orcamentos")
    } finally {
      setLoading(false)
    }
  }

  const handleConverterEmPedido = async () => {
    try {
      setConverting(true)
      const result = await OrcamentoService.converterEmPedido(id)
      toast.success("Orçamento convertido em pedido com sucesso!")
      router.push(`/vendas/pedidos/${result.pedido.id}`)
    } catch (error: any) {
      console.error("Erro ao converter orçamento:", error)
      toast.error(error.message || "Erro ao converter orçamento")
    } finally {
      setConverting(false)
    }
  }

  const handleCancelar = async () => {
    try {
      await OrcamentoService.cancelar(id)
      toast.success("Orçamento cancelado com sucesso!")
      loadOrcamento()
    } catch (error: any) {
      console.error("Erro ao cancelar orçamento:", error)
      toast.error(error.message || "Erro ao cancelar orçamento")
    }
  }

  const handleExcluir = async () => {
    try {
      await OrcamentoService.delete(id)
      toast.success("Orçamento excluído com sucesso!")
      router.push("/vendas/orcamentos")
    } catch (error: any) {
      console.error("Erro ao excluir orçamento:", error)
      toast.error(error.message || "Erro ao excluir orçamento")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      EM_ABERTO: "default",
      APROVADO: "secondary",
      CANCELADO: "destructive",
    }

    const labels: Record<string, string> = {
      EM_ABERTO: "Em Aberto",
      APROVADO: "Aprovado",
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

  if (!orcamento) {
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
                    <span className="sr-only">Dashboard</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/vendas/orcamentos" className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Orçamentos
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>#{orcamento.numero}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Orçamento #{orcamento.numero}
                  </h2>
                  <p className="text-muted-foreground">
                    {getStatusBadge(orcamento.status)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {orcamento.status === 'EM_ABERTO' && (
                    <>
                      <Button
                        onClick={handleConverterEmPedido}
                        disabled={converting}
                      >
                        <IconArrowRight className="mr-2 h-4 w-4" />
                        {converting ? "Convertendo..." : "Converter em Pedido"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            <IconX className="mr-2 h-4 w-4" />
                            Cancelar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar Orçamento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja cancelar este orçamento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelar}>
                              Confirmar Cancelamento
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  {orcamento.status !== 'APROVADO' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <IconTrash className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
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
                    <p className="text-lg font-semibold">{orcamento.cliente?.nome}</p>
                    <p className="text-sm text-muted-foreground">{orcamento.cliente?.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                    <p className="text-lg">{orcamento.vendedorNome || "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                    <p className="text-lg">
                      {format(new Date(orcamento.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Validade</p>
                    <p className="text-lg">
                      {format(new Date(orcamento.dataValidade), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Itens */}
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Orçamento</CardTitle>
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
                      {orcamento.itens?.map((item) => (
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

              {/* Totais */}
              <Card>
                <CardHeader>
                  <CardTitle>Totais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(orcamento.subtotal)}</span>
                  </div>
                  {orcamento.valorDesconto > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto:</span>
                      <span className="font-medium">-{formatCurrency(orcamento.valorDesconto)}</span>
                    </div>
                  )}
                  {orcamento.valorFrete > 0 && (
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span className="font-medium">{formatCurrency(orcamento.valorFrete)}</span>
                    </div>
                  )}
                  {orcamento.valorOutros > 0 && (
                    <div className="flex justify-between">
                      <span>Outros:</span>
                      <span className="font-medium">{formatCurrency(orcamento.valorOutros)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(orcamento.valorTotal)}</span>
                  </div>
                </CardContent>
              </Card>

              {orcamento.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{orcamento.observacoes}</p>
                  </CardContent>
                </Card>
              )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

