"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
import { ClienteService } from "@/lib/services/cliente.service"
import { ClienteFormDialog } from "./cliente-form-dialog"
import { DataTableFilter } from "@/components/data-table-filter"
import { useDataTableFilters } from "@/components/data-table-filter"
import { createColumnConfigBuilder } from "@/components/data-table-filter/core/filters"

interface Cliente {
  id: string
  tipo: "FISICA" | "JURIDICA"
  documento: string
  nome: string
  nomeFantasia?: string
  email?: string
  telefone?: string
  celular?: string
  ativo: boolean
  municipio?: {
    nome: string
    estado: {
      sigla: string
    }
  }
}

export function ClientesDataTableV2() {
  const [data, setData] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
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
        return (
          <div className="flex flex-col">
            <span className="font-medium">{nome}</span>
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
            {municipio.nome}/{municipio.estado.sigla}
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
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(cliente.id)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
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
    data,
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

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await ClienteService.getAll()
      setData(response.data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    setSelectedClienteId(id)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    try {
      await ClienteService.delete(id)
      toast.success("Cliente excluído com sucesso!")
      loadData()
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente")
    }
  }

  const handleSuccess = () => {
    loadData()
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
    <>

