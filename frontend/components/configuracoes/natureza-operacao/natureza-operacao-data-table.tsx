"use client"

import { useState } from "react"
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
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { NaturezaOperacao, NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"
import { toast } from "sonner"

interface NaturezaOperacaoDataTableProps {
  naturezas: NaturezaOperacao[]
  onEdit: (id: string) => void
  onDelete: () => void
}

export function NaturezaOperacaoDataTable({
  naturezas,
  onEdit,
  onDelete,
}: NaturezaOperacaoDataTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedId) return

    try {
      setDeleting(true)
      await NaturezaOperacaoService.delete(selectedId)
      toast.success("Natureza de operação excluída com sucesso!")
      onDelete()
    } catch (error: any) {
      console.error("Erro ao excluir natureza de operação:", error)
      toast.error(error.response?.data?.message || "Erro ao excluir natureza de operação")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setSelectedId(null)
    }
  }

  const getTipoOperacaoLabel = (tipo: number) => {
    return tipo === 0 ? "Entrada" : "Saída"
  }

  const getFinalidadeLabel = (finalidade: number) => {
    const labels: Record<number, string> = {
      1: "Normal",
      2: "Complementar",
      3: "Ajuste",
      4: "Devolução",
    }
    return labels[finalidade] || "Desconhecido"
  }

  if (naturezas.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhuma natureza de operação cadastrada
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Finalidade</TableHead>
              <TableHead>CFOP Dentro</TableHead>
              <TableHead>CFOP Fora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {naturezas.map((natureza) => (
              <TableRow key={natureza.id}>
                <TableCell className="font-medium">{natureza.codigo}</TableCell>
                <TableCell>{natureza.descricao}</TableCell>
                <TableCell>
                  <Badge variant={natureza.tipoOperacao === 1 ? "default" : "secondary"}>
                    {getTipoOperacaoLabel(natureza.tipoOperacao)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getFinalidadeLabel(natureza.finalidade)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {natureza.cfopDentroEstado ? (
                    <span className="text-sm">
                      {natureza.cfopDentroEstado.codigo}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {natureza.cfopForaEstado ? (
                    <span className="text-sm">
                      {natureza.cfopForaEstado.codigo}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={natureza.ativo ? "success" : "secondary"}>
                    {natureza.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(natureza.id)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(natureza.id)}
                        className="text-destructive"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta natureza de operação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

