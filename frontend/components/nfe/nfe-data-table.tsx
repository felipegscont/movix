"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { IconDotsVertical, IconEye, IconEdit, IconTrash, IconFileDownload } from "@tabler/icons-react"
import { Nfe, NfeService } from "@/lib/services/nfe.service"
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

interface NfeDataTableProps {
  nfes: Nfe[]
  onRefresh: () => void
}

export function NfeDataTable({ nfes, onRefresh }: NfeDataTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [nfeToDelete, setNfeToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const statusColors = {
    DIGITACAO: "bg-yellow-500",
    AUTORIZADA: "bg-green-500",
    CANCELADA: "bg-red-500",
    REJEITADA: "bg-destructive",
  }

  const statusLabels = {
    DIGITACAO: "Digitação",
    AUTORIZADA: "Autorizada",
    CANCELADA: "Cancelada",
    REJEITADA: "Rejeitada",
  }

  const columns: ColumnDef<Nfe>[] = [
    {
      accessorKey: "numero",
      header: "Número",
      cell: ({ row }) => {
        const numero = row.getValue("numero") as number
        const serie = row.original.serie
        return (
          <div className="font-medium">
            {numero.toString().padStart(6, '0')} / {serie}
          </div>
        )
      },
    },
    {
      accessorKey: "dataEmissao",
      header: "Data Emissão",
      cell: ({ row }) => {
        const data = new Date(row.getValue("dataEmissao"))
        return data.toLocaleDateString('pt-BR')
      },
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: ({ row }) => {
        const cliente = row.original.cliente
        return (
          <div>
            <div className="font-medium">{cliente?.nome}</div>
            <div className="text-sm text-muted-foreground">{cliente?.documento}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "naturezaOperacao",
      header: "Natureza",
    },
    {
      accessorKey: "valorTotal",
      header: "Valor Total",
      cell: ({ row }) => {
        const valor = row.getValue("valorTotal") as number
        return (
          <div className="text-right font-medium">
            {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const nfe = row.original
        const podeEditar = nfe.status === 'DIGITACAO'
        const podeExcluir = nfe.status === 'DIGITACAO'

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
              <DropdownMenuItem onClick={() => router.push(`/nfes/${nfe.id}`)}>
                <IconEye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              {podeEditar && (
                <DropdownMenuItem onClick={() => router.push(`/nfes/${nfe.id}/editar`)}>
                  <IconEdit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {nfe.xmlAutorizado && (
                <DropdownMenuItem onClick={() => handleDownloadXml(nfe.id)}>
                  <IconFileDownload className="mr-2 h-4 w-4" />
                  Baixar XML
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {podeExcluir && (
                <DropdownMenuItem
                  onClick={() => {
                    setNfeToDelete(nfe.id)
                    setDeleteDialogOpen(true)
                  }}
                  className="text-destructive"
                >
                  <IconTrash className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: nfes || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const handleDownloadXml = async (nfeId: string) => {
    try {
      // TODO: Implementar download de XML
      toast.info("Funcionalidade em desenvolvimento")
    } catch (error) {
      toast.error("Erro ao baixar XML")
    }
  }

  const handleDelete = async () => {
    if (!nfeToDelete) return

    try {
      setDeleting(true)
      await NfeService.delete(nfeToDelete)
      toast.success("NFe excluída com sucesso!")
      setDeleteDialogOpen(false)
      setNfeToDelete(null)
      onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir NFe")
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
            {table.getRowModel()?.rows?.length ? (
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
                  Nenhuma NFe encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
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
              Tem certeza que deseja excluir esta NFe? Esta ação não pode ser desfeita.
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

