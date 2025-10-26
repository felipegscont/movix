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
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconEdit, IconTrash, IconLoader2, IconSearch, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import { MatrizFiscalService, type MatrizFiscal } from "@/lib/services/matriz-fiscal.service"

export function MatrizFiscalDataTable() {
  const router = useRouter()
  const [data, setData] = useState<MatrizFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)

  // Filtros
  const [searchCodigo, setSearchCodigo] = useState("")
  const [filterImposto, setFilterImposto] = useState<string>("")
  const [filterUfDestino, setFilterUfDestino] = useState<string>("")
  const [filterAtivo, setFilterAtivo] = useState<string>("all")



  const columns: ColumnDef<MatrizFiscal>[] = [
    {
      accessorKey: "codigo",
      header: "Imposto",
      cell: ({ row }) => (
        <Badge variant="default" className="font-medium">
          {row.getValue("codigo")}
        </Badge>
      ),
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("descricao")}
        </div>
      ),
    },
    {
      accessorKey: "seAplicaA",
      header: "Aplica-se a",
      cell: ({ row }) => {
        const seAplicaA = row.getValue("seAplicaA") as string | null
        return seAplicaA ? (
          <Badge variant="outline" className="capitalize">
            {seAplicaA}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )
      },
    },
    {
      accessorKey: "regimeTributario",
      header: "Regime",
      cell: ({ row }) => {
        const regime = row.getValue("regimeTributario") as number | null
        const regimeMap: Record<number, string> = {
          1: "Simples",
          2: "Presumido",
          3: "Real"
        }
        return regime ? (
          <Badge variant="secondary" className="text-xs">
            {regimeMap[regime] || regime}
          </Badge>
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
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )
      },
    },
    {
      header: "CST/CSOSN",
      cell: ({ row }) => {
        const cst = row.original.cst
        const csosn = row.original.csosn

        if (csosn) {
          return (
            <Badge variant="secondary" className="text-xs">
              CSOSN {csosn.codigo}
            </Badge>
          )
        }

        if (cst) {
          return (
            <Badge variant="secondary" className="text-xs">
              CST {cst.codigo}
            </Badge>
          )
        }

        return <span className="text-muted-foreground text-xs">-</span>
      },
    },
    {
      accessorKey: "prioridade",
      header: "Prior.",
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {row.getValue("prioridade")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => {
        const ativo = row.getValue("ativo") as boolean
        return (
          <Badge variant={ativo ? "default" : "secondary"} className="text-xs">
            {ativo ? "Ativo" : "Inativo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const matriz = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(matriz)}
              className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <IconEdit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(matriz.id)}
              className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <IconTrash className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
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
        ufDestino: filterUfDestino || undefined,
        ativo: filterAtivo === "all" ? undefined : filterAtivo === "true",
      })

      // Filtrar localmente por código/descrição e imposto
      let filteredData = response.data

      if (searchCodigo) {
        filteredData = filteredData.filter((m) =>
          m.codigo.toLowerCase().includes(searchCodigo.toLowerCase()) ||
          m.descricao.toLowerCase().includes(searchCodigo.toLowerCase())
        )
      }

      if (filterImposto) {
        filteredData = filteredData.filter((m) => m.codigo === filterImposto)
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
  }, [currentPage, filterImposto, filterUfDestino, filterAtivo])

  const handleEdit = (matriz: MatrizFiscal) => {
    router.push(`/matrizes-fiscais/${matriz.id}`)
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



  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead><Skeleton className="h-3 w-16" /></TableHead>
                <TableHead><Skeleton className="h-3 w-32" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead><Skeleton className="h-3 w-24" /></TableHead>
                <TableHead><Skeleton className="h-3 w-16" /></TableHead>
                <TableHead className="w-32"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2"><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-3 w-40" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-3 w-20" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <Skeleton className="h-3 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Header com filtros e ações */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
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
        <Select value={filterImposto || "todos"} onValueChange={(value) => setFilterImposto(value === "todos" ? "" : value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Imposto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ICMS">ICMS</SelectItem>
            <SelectItem value="PIS">PIS</SelectItem>
            <SelectItem value="COFINS">COFINS</SelectItem>
            <SelectItem value="IPI">IPI</SelectItem>
            <SelectItem value="ISSQN">ISSQN</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUfDestino || "todas"} onValueChange={(value) => setFilterUfDestino(value === "todas" ? "" : value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="UF Destino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="SP">SP</SelectItem>
            <SelectItem value="RJ">RJ</SelectItem>
            <SelectItem value="MG">MG</SelectItem>
            <SelectItem value="ES">ES</SelectItem>
            <SelectItem value="PR">PR</SelectItem>
            <SelectItem value="SC">SC</SelectItem>
            <SelectItem value="RS">RS</SelectItem>
            <SelectItem value="MA">MA</SelectItem>
            <SelectItem value="BA">BA</SelectItem>
            <SelectItem value="CE">CE</SelectItem>
          </SelectContent>
        </Select>
          <Select value={filterAtivo} onValueChange={setFilterAtivo}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-7"
            onClick={() => router.push("/matrizes-fiscais/nova")}
          >
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Nova Matriz</span>
          </Button>
        </div>
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
            className="h-7"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            className="h-7"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>


    </div>
  )
}

