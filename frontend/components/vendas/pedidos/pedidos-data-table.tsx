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
  IconShoppingCart,
  IconLayoutColumns,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconFileInvoice,
  IconEye,
  IconUser,
  IconCalendar,
  IconCurrencyReal,
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
import { PedidoService, type Pedido } from "@/lib/services/pedido.service"
import { formatCurrency } from "@/lib/utils"

// Configuração dos filtros do Bazza UI
const dtf = createColumnConfigHelper<Pedido>()

const filterColumnsConfig = [
  dtf
    .text()
    .id("numero")
    .displayName("Número")
    .icon(IconShoppingCart)
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
    .icon(IconFileInvoice)
    .accessor((row) => row.status)
    .options([
      { value: "ABERTO", label: "Aberto" },
      { value: "FATURADO", label: "Faturado" },
      { value: "CANCELADO", label: "Cancelado" },
    ])
    .build(),
] as const

export function PedidosDataTable() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
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
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const response = await PedidoService.getAll({ page: 1, limit: 1000 })
      setPedidos(response.data)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      toast.error("Erro ao carregar pedidos")
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
    data: pedidos,
    columnsConfig: filterColumnsConfig,
  })

  // Aplicar filtros do Bazza UI aos dados
  const filteredData = React.useMemo(() => {
    if (bazzaFilters.length === 0) return pedidos

    return pedidos.filter((row) => {
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
  }, [pedidos, bazzaFilters, bazzaColumns])

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

  const columns: ColumnDef<Pedido>[] = [
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
      header: "Pedido",
      cell: ({ row }) => {
        const numero = row.getValue("numero") as number
        const pedidoId = row.original.id
        const dataEmissao = row.original.dataEmissao
        return (
          <div className="flex flex-col">
            <button
              onClick={() => router.push(`/vendas/pedidos/${pedidoId}`)}
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
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
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
      accessorKey: "dataEntrega",
      header: "Entrega",
      cell: ({ row }) => {
        const dataEntrega = row.original.dataEntrega
        const status = row.original.status
        return dataEntrega ? (
          <div className="flex flex-col">
            <span>{format(new Date(dataEntrega), "dd/MM/yyyy", { locale: ptBR })}</span>
            {status === 'FATURADO' && (
              <Badge variant="secondary" className="text-xs w-fit">
                Entregue
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">Não definida</span>
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
        const pedido = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/vendas/pedidos/${pedido.id}`)}>
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
                <TableHead className="w-12"><Skeleton className="h-3 w-3" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead><Skeleton className="h-3 w-16" /></TableHead>
                <TableHead><Skeleton className="h-3 w-24" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead><Skeleton className="h-3 w-20" /></TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2"><Skeleton className="h-3 w-3" /></TableCell>
                  <TableCell className="py-2">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-2">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2"><Skeleton className="h-3 w-20" /></TableCell>
                  <TableCell className="py-2">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2"><Skeleton className="h-6 w-6 rounded" /></TableCell>
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
            onClick={() => router.push("/vendas/pedidos/novo")}
          >
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Novo Pedido</span>
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
                    <IconShoppingCart className="h-8 w-8 opacity-50" />
                    <p>Nenhum pedido encontrado.</p>
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
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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
