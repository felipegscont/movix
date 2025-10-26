"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconFileText,
  IconLayoutColumns,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconEye,
  IconUser,
  IconCalendar,
  IconCurrencyReal,
  IconArrowRight,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableFilter } from "@/components/data-table-filter"
import { useDataTableFilters } from "@/components/data-table-filter"
import { createColumnConfigHelper } from "@/components/data-table-filter/core/filters"
import { OrcamentoService, type Orcamento } from "@/lib/services/orcamento.service"
import { formatCurrency } from "@/lib/utils"

// Configuração dos filtros do Bazza UI
const dtf = createColumnConfigHelper<Orcamento>()

const filterColumnsConfig = [
  dtf
    .text()
    .id("numero")
    .displayName("Número")
    .icon(IconFileText)
    .accessor((row) => row.numero.toString())
    .build(),
  dtf
    .text()
    .id("cliente")
    .displayName("Cliente")
    .icon(IconUser)
    .accessor((row) => row.cliente?.nome || "")
    .build(),
  dtf
    .option()
    .id("status")
    .displayName("Status")
    .icon(IconCalendar)
    .accessor((row) => row.status)
    .options([
      { value: "EM_ABERTO", label: "Em Aberto" },
      { value: "APROVADO", label: "Aprovado" },
      { value: "CANCELADO", label: "Cancelado" },
    ])
    .build(),
] as const

export function OrcamentosDataTable() {
  const router = useRouter()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    loadOrcamentos()
  }, [])

  const loadOrcamentos = async () => {
    try {
      setLoading(true)
      const response = await OrcamentoService.getAll({ page: 1, limit: 1000 })
      setOrcamentos(response.data)
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error)
      toast.error("Erro ao carregar orçamentos")
    } finally {
      setLoading(false)
    }
  }

  // Filtros do Bazza UI
  const {
    filters: bazzaFilters,
    columns: bazzaColumns,
    actions: bazzaActions,
  } = useDataTableFilters({
    strategy: "client",
    data: orcamentos,
    columnsConfig: filterColumnsConfig,
  })

  // Aplicar filtros do Bazza UI aos dados
  const filteredData = React.useMemo(() => {
    if (bazzaFilters.length === 0) return orcamentos

    return orcamentos.filter((row) => {
      return bazzaFilters.every((filter) => {
        const column = bazzaColumns.find((col) => col.id === filter.columnId)
        if (!column) return true

        const value = column.accessor(row)

        if (filter.type === 'text') {
          const textValue = String(value || '').toLowerCase()
          const filterValue = String(filter.values[0] || '').toLowerCase()

          switch (filter.operator) {
            case 'contains':
              return textValue.includes(filterValue)
            case 'doesNotContain':
              return !textValue.includes(filterValue)
            case 'startsWith':
              return textValue.startsWith(filterValue)
            case 'endsWith':
              return textValue.endsWith(filterValue)
            case 'isEmpty':
              return !textValue
            case 'isNotEmpty':
              return !!textValue
            default:
              return true
          }
        }

        if (filter.type === 'option') {
          const optionValue = String(value)
          const filterValues = filter.values.map(String)

          switch (filter.operator) {
            case 'is':
              return filterValues.includes(optionValue)
            case 'isNot':
              return !filterValues.includes(optionValue)
            case 'isAnyOf':
              return filterValues.includes(optionValue)
            case 'isNoneOf':
              return !filterValues.includes(optionValue)
            default:
              return true
          }
        }

        return true
      })
    })
  }, [orcamentos, bazzaFilters, bazzaColumns])

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

  const columns: ColumnDef<Orcamento>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "numero",
      header: "Orçamento",
      cell: ({ row }) => {
        const numero = row.getValue("numero") as number
        const orcamentoId = row.original.id
        const dataEmissao = row.original.dataEmissao
        return (
          <div className="flex flex-col">
            <button
              onClick={() => router.push(`/vendas/orcamentos/${orcamentoId}`)}
              className="font-bold text-lg text-left hover:text-primary hover:underline transition-colors"
            >
              #{numero}
            </button>
            <span className="text-xs text-muted-foreground">
              {format(new Date(dataEmissao), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const pedidoId = row.original.pedidoId
        return (
          <div className="flex flex-col gap-1">
            {getStatusBadge(status)}
            {pedidoId && (
              <Badge variant="outline" className="text-xs w-fit">
                <IconArrowRight className="h-3 w-3 mr-1" />
                Convertido
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: ({ row }) => {
        const cliente = row.original.cliente
        return cliente ? (
          <div className="flex flex-col">
            <span className="font-medium">{cliente.nome}</span>
            <span className="text-xs text-muted-foreground">
              {cliente.documento}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "dataValidade",
      header: "Validade",
      cell: ({ row }) => {
        const dataValidade = row.original.dataValidade
        const status = row.original.status
        const isVencido = new Date(dataValidade) < new Date() && status === 'EM_ABERTO'
        return (
          <div className="flex flex-col">
            <span>{format(new Date(dataValidade), "dd/MM/yyyy", { locale: ptBR })}</span>
            {isVencido && (
              <Badge variant="destructive" className="text-xs w-fit">
                Vencido
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "valorTotal",
      header: "Valor",
      cell: ({ row }) => {
        const valorTotal = row.getValue("valorTotal") as number
        const itensCount = row.original._count?.itens || row.original.itens?.length || 0
        return (
          <div className="flex flex-col text-right">
            <span className="font-bold text-lg">{formatCurrency(valorTotal)}</span>
            <span className="text-xs text-muted-foreground">
              {itensCount} {itensCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const orcamento = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/vendas/orcamentos/${orcamento.id}`)}>
                <IconEye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Em desenvolvimento")}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.info("Em desenvolvimento")}
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
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-32" />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <Skeleton className="h-4 w-48" />
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
          <DataTableFilter
            filters={bazzaFilters}
            columns={bazzaColumns}
            actions={bazzaActions}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-7">
                <IconLayoutColumns className="size-4" />
                <span className="hidden lg:inline">Colunas</span>
                <IconChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="h-7"
            onClick={() => router.push("/vendas/orcamentos/novo")}
          >
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Novo Orçamento</span>
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page-orcamentos" className="text-sm font-medium">
              Linhas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page-orcamentos">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

