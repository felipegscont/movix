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
        <div className="flex h-32 items-center justify-center rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Carregando pedidos...</span>
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

