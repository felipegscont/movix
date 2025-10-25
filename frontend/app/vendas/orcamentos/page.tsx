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
import { IconPlus, IconFileText, IconFileInvoice } from "@tabler/icons-react"
import { toast } from "sonner"
import { OrcamentoService, type Orcamento } from "@/lib/services/orcamento.service"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function OrcamentosPage() {
  const router = useRouter()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadOrcamentos()
  }, [page])

  const loadOrcamentos = async () => {
    try {
      setLoading(true)
      const response = await OrcamentoService.getAll({ page, limit: 20 })
      setOrcamentos(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error)
      toast.error("Erro ao carregar orçamentos")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
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
                <BreadcrumbPage>Orçamentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
                  <p className="text-muted-foreground">
                    Gerencie suas propostas comerciais
                  </p>
                </div>
                <Button onClick={() => router.push("/vendas/orcamentos/novo")}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Novo Orçamento
                </Button>
              </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Orçamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os orçamentos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : orcamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <IconFileInvoice className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/vendas/orcamentos/novo")}
              >
                Criar primeiro orçamento
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">ORÇAMENTO</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>CLIENTE</TableHead>
                    <TableHead>VALIDADE</TableHead>
                    <TableHead className="text-right">VALOR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentos.map((orcamento) => (
                    <TableRow
                      key={orcamento.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/vendas/orcamentos/${orcamento.id}`)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-bold text-lg">#{orcamento.numero}</div>
                          <div className="text-xs text-muted-foreground">
                            Emitido em: {format(new Date(orcamento.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                          {orcamento.vendedorNome && (
                            <div className="text-xs text-muted-foreground">
                              Vendedor: {orcamento.vendedorNome}
                            </div>
                          )}
                          {orcamento.pedidoId && (
                            <Badge variant="secondary" className="text-xs">
                              Convertido
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(orcamento.status)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{orcamento.cliente?.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            CNPJ: {orcamento.cliente?.documento}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{format(new Date(orcamento.dataValidade), "dd/MM/yyyy", { locale: ptBR })}</div>
                          {new Date(orcamento.dataValidade) < new Date() && orcamento.status === 'EM_ABERTO' && (
                            <Badge variant="destructive" className="text-xs">
                              Vencido
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-lg">
                          {formatCurrency(orcamento.valorTotal)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {orcamento._count?.itens || orcamento.itens?.length || 0} {(orcamento._count?.itens || orcamento.itens?.length || 0) === 1 ? 'item' : 'itens'}
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

