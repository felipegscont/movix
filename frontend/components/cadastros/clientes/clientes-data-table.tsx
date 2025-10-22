"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconUsers,
  IconBuilding,
  IconLayoutColumns,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconMail,
  IconFileText,
  IconCircleCheck,
  IconEye,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { ClienteFormDialog } from "./cliente-form-dialog"
import { DataTableFilter } from "@/components/data-table-filter"
import { useDataTableFilters } from "@/components/data-table-filter"
import { createColumnConfigHelper } from "@/components/data-table-filter/core/filters"
import type { Locale } from "@/components/data-table-filter/lib/i18n"
import { Cliente } from "@/lib/services/cliente.service"
import { useClientes } from "@/hooks/clientes/use-clientes"

// Configuração dos filtros do Bazza UI
const dtf = createColumnConfigHelper<Cliente>()

const filterColumnsConfig = [
  dtf
    .text()
    .id("nome")
    .displayName("Nome")
    .icon(IconUsers)
    .accessor((row) => row.nome)
    .build(),
  dtf
    .text()
    .id("documento")
    .displayName("Documento")
    .icon(IconFileText)
    .accessor((row) => row.documento)
    .build(),
  dtf
    .text()
    .id("email")
    .displayName("Email")
    .icon(IconMail)
    .accessor((row) => row.email || "")
    .build(),
  dtf
    .option()
    .id("tipo")
    .displayName("Tipo")
    .icon(IconBuilding)
    .accessor((row) => row.tipo)
    .options([
      { value: "FISICA", label: "Pessoa Física" },
      { value: "JURIDICA", label: "Pessoa Jurídica" },
    ])
    .build(),
  dtf
    .option()
    .id("ativo")
    .displayName("Status")
    .icon(IconCircleCheck)
    .accessor((row) => row.ativo ? "true" : "false")
    .options([
      { value: "true", label: "Ativo" },
      { value: "false", label: "Inativo" },
    ])
    .build(),
] as const

export function ClientesDataTable() {
  const router = useRouter()
  const { clientes, loading, deleteCliente, refreshData } = useClientes()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<string | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Filtros do Bazza UI
  const {
    filters: bazzaFilters,
    columns: bazzaColumns,
    actions: bazzaActions,
  } = useDataTableFilters({
    strategy: "client",
    data: clientes,
    columnsConfig: filterColumnsConfig,
  })

  // Aplicar filtros do Bazza UI aos dados
  const filteredData = React.useMemo(() => {
    if (bazzaFilters.length === 0) return clientes

    return clientes.filter((row) => {
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
  }, [clientes, bazzaFilters, bazzaColumns])

  const columns: ColumnDef<Cliente>[] = [
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
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo") as string
        return (
          <div className="flex items-center gap-2">
            {tipo === "JURIDICA" ? (
              <IconBuilding className="h-4 w-4 text-blue-600" />
            ) : (
              <IconUsers className="h-4 w-4 text-green-600" />
            )}
            <Badge variant="outline" className="text-xs">
              {tipo === "JURIDICA" ? "PJ" : "PF"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: ({ row }) => {
        const documento = row.getValue("documento") as string
        const tipo = row.original.tipo
        if (tipo === "JURIDICA") {
          return documento.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
        }
        return documento.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
      },
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => {
        const nome = row.getValue("nome") as string
        const nomeFantasia = row.original.nomeFantasia
        const clienteId = row.original.id
        return (
          <div className="flex flex-col">
            <button
              onClick={() => router.push(`/clientes/${clienteId}`)}
              className="font-medium text-left hover:text-primary hover:underline transition-colors"
            >
              {nome}
            </button>
            {nomeFantasia && (
              <span className="text-xs text-muted-foreground">{nomeFantasia}</span>
            )}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string
        return email || <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "telefone",
      header: "Contato",
      cell: ({ row }) => {
        const telefone = row.original.telefone
        const celular = row.original.celular
        const contato = celular || telefone
        return contato ? (
          <span className="text-sm">{contato}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "municipio",
      header: "Cidade/UF",
      cell: ({ row }) => {
        const municipio = row.original.municipio
        return municipio ? (
          <span className="text-sm">
            {municipio.nome}/{municipio.estado.uf}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
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
        const cliente = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/clientes/${cliente.id}`)}>
                <IconEye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(cliente.id)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(cliente.id)}
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



  const handleEdit = (id: string) => {
    setSelectedClienteId(id)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setClienteToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!clienteToDelete) return

    try {
      setDeleting(true)
      await deleteCliente(clienteToDelete)
      setDeleteDialogOpen(false)
      setClienteToDelete(null)
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setDeleting(false)
    }
  }

  const handleSuccess = () => {
    refreshData()
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex h-32 items-center justify-center rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Carregando clientes...</span>
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
            columns={bazzaColumns}
            filters={bazzaFilters}
            actions={bazzaActions}
            strategy="client"
            locale={"pt-BR" as Locale}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-7">
                <IconLayoutColumns className="size-4" />
                <span className="hidden lg:inline">Colunas</span>
                <IconChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
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
            onClick={() => setDialogOpen(true)}
          >
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Novo Cliente</span>
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
                    <IconUsers className="h-8 w-8 opacity-50" />
                    <p>Nenhum cliente encontrado.</p>
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

      <ClienteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clienteId={selectedClienteId}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              {clienteToDelete && (
                <span className="block mt-2 text-sm font-medium text-foreground">
                  O cliente será removido permanentemente do sistema.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

