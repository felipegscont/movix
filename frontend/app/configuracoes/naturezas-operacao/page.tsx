"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconLoader2 } from "@tabler/icons-react"
import { NaturezaOperacaoFormDialog } from "@/components/configuracoes/natureza-operacao/natureza-operacao-form-dialog"
import { NaturezaOperacaoDataTable } from "@/components/configuracoes/natureza-operacao/natureza-operacao-data-table"
import { NaturezaOperacaoSectionCards } from "@/components/configuracoes/natureza-operacao/natureza-operacao-section-cards"
import { NaturezaOperacao, NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"
import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function NaturezasOperacaoPage() {
  const [naturezas, setNaturezas] = useState<NaturezaOperacao[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const limit = 10

  useEffect(() => {
    loadNaturezas()
  }, [page, search])

  const loadNaturezas = async () => {
    try {
      setLoading(true)
      const response = await NaturezaOperacaoService.getAll({
        page,
        limit,
        search: search || undefined,
      })
      setNaturezas(response.data)
      setTotal(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error("Erro ao carregar naturezas de operação:", error)
      toast.error("Erro ao carregar naturezas de operação")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Reset para primeira página ao buscar
  }

  const handleNew = () => {
    setSelectedId(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (id: string) => {
    setSelectedId(id)
    setDialogOpen(true)
  }

  const handleSuccess = () => {
    loadNaturezas()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Naturezas de Operação</h2>
          <p className="text-muted-foreground">
            Configure naturezas de operação para facilitar a emissão de notas fiscais
          </p>
        </div>
        <Button onClick={handleNew}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nova Natureza
        </Button>
      </div>

      <NaturezaOperacaoSectionCards naturezas={naturezas} />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código ou descrição..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <NaturezaOperacaoDataTable
            naturezas={naturezas}
            onEdit={handleEdit}
            onDelete={handleSuccess}
          />

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <NaturezaOperacaoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        naturezaId={selectedId}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

