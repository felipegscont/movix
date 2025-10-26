"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  IconPlus,
  IconFileText,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrcamentoService, type Orcamento } from "@/lib/services/orcamento.service"
import { formatCurrency } from "@/lib/utils"

export function OrcamentosDataTable() {
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

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex h-32 items-center justify-center rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Carregando orçamentos...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Header com botão */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Espaço para filtros futuros */}
        </div>
        <Button
          variant="outline"
          className="h-7"
          onClick={() => router.push("/vendas/orcamentos/novo")}
        >
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Novo Orçamento</span>
        </Button>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[200px]">ORÇAMENTO</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>CLIENTE</TableHead>
              <TableHead>VALIDADE</TableHead>
              <TableHead className="text-right">VALOR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamentos.length > 0 ? (
              orcamentos.map((orcamento) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <IconFileText className="h-8 w-8 opacity-50" />
                    <p>Nenhum orçamento encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer com paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Página {page} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

