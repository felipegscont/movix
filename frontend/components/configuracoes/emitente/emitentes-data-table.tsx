"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { Emitente, EmitenteService } from "@/lib/services/emitente.service"
import { toast } from "sonner"
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

interface EmitentesDataTableProps {
  data: Emitente[]
  onEdit: (id: string) => void
  onRefresh: () => void
}

export function EmitentesDataTable({ data, onEdit, onRefresh }: EmitentesDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [emitenteToDelete, setEmitenteToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const columns: ColumnDef<Emitente>[] = [
    {
      accessorKey: "razaoSocial",
      header: "Razão Social",
      cell: ({ row }) => {
        const emitente = row.original
        return (
          <div>
            <div className="font-medium">{emitente.razaoSocial}</div>
            {emitente.nomeFantasia && (
              <div className="text-sm text-muted-foreground">{emitente.nomeFantasia}</div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "cnpj",
      header: "CNPJ",
      cell: ({ row }) => {
        const cnpj = row.getValue("cnpj") as string
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
      },
    },
    {
      accessorKey: "inscricaoEstadual",
      header: "Inscrição Estadual",
    },
    {
      accessorKey: "municipio",
      header: "Município",
      cell: ({ row }) => {
        const emitente = row.original
        return (
          <div>
            <div>{emitente.municipio?.nome}</div>
            <div className="text-sm text-muted-foreground">{emitente.estado?.uf}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "serieNfe",
      header: "Série NFe",
      cell: ({ row }) => {
        return <div className="text-center font-mono">{row.getValue("serieNfe")}</div>
      },
    },
    {
      accessorKey: "ambienteNfe",
      header: "Ambiente",
      cell: ({ row }) => {
        const ambiente = row.getValue("ambienteNfe") as number
        return (
          <Badge variant={ambiente === 1 ? "default" : "secondary"}>
            {ambiente === 1 ? "Produção" : "Homologação"}
          </Badge>
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
        const emitente = row.original

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
              <DropdownMenuItem onClick={() => onEdit(emitente.id)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEmitenteToDelete(emitente.id)
                  setDeleteDialogOpen(true)
                }}
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const handleDelete = async () => {
    if (!emitenteToDelete) return

    try {
      setDeleting(true)
      await EmitenteService.delete(emitenteToDelete)
      toast.success("Emitente excluído com sucesso!")
      setDeleteDialogOpen(false)
      setEmitenteToDelete(null)
      onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir emitente")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum emitente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="h-7"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          className="h-7"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este emitente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

