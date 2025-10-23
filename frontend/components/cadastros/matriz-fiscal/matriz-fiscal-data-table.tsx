"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconDotsVertical, IconEdit, IconTrash, IconLoader2, IconSearch } from "@tabler/icons-react"
import { toast } from "sonner"
import { MatrizFiscalService, type MatrizFiscal } from "@/lib/services/matriz-fiscal.service"
import { MatrizFiscalFormDialog } from "./matriz-fiscal-form-dialog"

export function MatrizFiscalDataTable() {
  const router = useRouter()
  const [data, setData] = useState<MatrizFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)

  // Filtros
  const [searchCodigo, setSearchCodigo] = useState("")
  const [filterUfOrigem, setFilterUfOrigem] = useState<string>("")
  const [filterUfDestino, setFilterUfDestino] = useState<string>("")
  const [filterAtivo, setFilterAtivo] = useState<string>("all")

  // Dialog de edição
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMatriz, setEditingMatriz] = useState<MatrizFiscal | null>(null)

  const columns: ColumnDef<MatrizFiscal>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("codigo")}</div>
      ),
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue("descricao")}</div>
      ),
    },
    {
      accessorKey: "ufOrigem",
      header: "UF Origem",
      cell: ({ row }) => {
        const uf = row.getValue("ufOrigem") as string | null
        return uf ? (
          <Badge variant="outline">{uf}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Qualquer</span>
        )
      },
    },
    {
      accessorKey: "ufDestino",
      header: "UF Destino",
      cell: ({ row }) => {
        const uf = row.getValue("ufDestino") as string | null
        return uf ? (
          <Badge variant="outline">{uf}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Qualquer</span>
        )
      },
    },
    {
      accessorKey: "cfop",
      header: "CFOP",
      cell: ({ row }) => {
        const cfop = row.original.cfop
        return cfop ? (
          <div className="text-sm">
            <div className="font-medium">{cfop.codigo}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
              {cfop.descricao}
            </div>
          </div>
        ) : (
          "-"
        )
      },
    },
    {
      accessorKey: "prioridade",
      header: "Prioridade",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("prioridade")}</Badge>
      ),
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => {
        const ativo = row.getValue("ativo") as boolean
        return (
          <Badge variant={ativo ? "default" : "secondary"}>
            {ativo ? "Ativo" : "Inativo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const matriz = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(matriz)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(matriz.id)}
                className="text-destructive"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await MatrizFiscalService.getAll({
        page: currentPage,
        limit: pageSize,
        ufOrigem: filterUfOrigem || undefined,
        ufDestino: filterUfDestino || undefined,
        ativo: filterAtivo === "all" ? undefined : filterAtivo === "true",
      })

      // Filtrar por código localmente (busca simples)
      let filteredData = response.data
      if (searchCodigo) {
        filteredData = filteredData.filter((m) =>
          m.codigo.toLowerCase().includes(searchCodigo.toLowerCase()) ||
          m.descricao.toLowerCase().includes(searchCodigo.toLowerCase())
        )
      }

      setData(filteredData)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Erro ao carregar matrizes fiscais:", error)
      toast.error("Erro ao carregar matrizes fiscais")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentPage, filterUfOrigem, filterUfDestino, filterAtivo])

  const handleEdit = (matriz: MatrizFiscal) => {
    setEditingMatriz(matriz)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta matriz fiscal?")) {
      return
    }

    try {
      await MatrizFiscalService.delete(id)
      toast.success("Matriz fiscal excluída com sucesso!")
      loadData()
    } catch (error) {
      console.error("Erro ao excluir matriz fiscal:", error)
      toast.error("Erro ao excluir matriz fiscal")
    }
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setEditingMatriz(null)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou descrição..."
              value={searchCodigo}
              onChange={(e) => setSearchCodigo(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={filterUfOrigem} onValueChange={setFilterUfOrigem}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="UF Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="SP">SP</SelectItem>
            <SelectItem value="RJ">RJ</SelectItem>
            <SelectItem value="MG">MG</SelectItem>
            {/* Adicionar mais UFs conforme necessário */}
          </SelectContent>
        </Select>
        <Select value={filterUfDestino} onValueChange={setFilterUfDestino}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="UF Destino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="SP">SP</SelectItem>
            <SelectItem value="RJ">RJ</SelectItem>
            <SelectItem value="MG">MG</SelectItem>
            {/* Adicionar mais UFs conforme necessário */}
          </SelectContent>
        </Select>
        <Select value={filterAtivo} onValueChange={setFilterAtivo}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativos</SelectItem>
            <SelectItem value="false">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma matriz fiscal encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* Dialog de Edição */}
      <MatrizFiscalFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        matriz={editingMatriz}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

