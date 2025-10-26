"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { IconEdit, IconTrash, IconAlertCircle } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type OrcamentoItemFormData } from "@/lib/schemas/orcamento.schema"
import { OrcamentoAddItemQuick } from "../orcamento-add-item-quick"
import { OrcamentoEditItemDialog } from "../orcamento-edit-item-dialog"

interface OrcamentoStepItensProps {
  form: UseFormReturn<any>
  addItem: (item: OrcamentoItemFormData) => void
  updateItem: (index: number, item: OrcamentoItemFormData) => void
  removeItem: (index: number) => void
}

export function OrcamentoStepItens({ form, addItem, updateItem, removeItem }: OrcamentoStepItensProps) {
  const itens = form.watch('itens') || []
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleRemoveItem = (index: number) => {
    if (confirm('Deseja realmente remover este item?')) {
      removeItem(index)
    }
  }

  const handleEditItem = (index: number) => {
    setEditingIndex(index)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (item: OrcamentoItemFormData) => {
    if (editingIndex !== null) {
      updateItem(editingIndex, item)
      setEditingIndex(null)
    }
  }

  const calculateSubtotal = () => {
    return itens.reduce((sum: number, item: any) => sum + (item.valorTotal || 0), 0)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <div className="space-y-4">
      {/* Formulário de adicionar item */}
      <OrcamentoAddItemQuick onAddItem={addItem} />

      {/* Lista de itens */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Itens Adicionados ({itens.length})</CardTitle>
              <CardDescription className="text-xs">
                Lista de produtos e serviços do orçamento
              </CardDescription>
            </div>
            {itens.length > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Subtotal</div>
                <div className="text-lg font-bold">{formatCurrency(calculateSubtotal())}</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.formState.errors.itens && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                {form.formState.errors.itens.message as string}
              </AlertDescription>
            </Alert>
          )}

          {itens.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <IconAlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum item adicionado</p>
              <p className="text-sm mt-2">
                Use o formulário acima para adicionar itens
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-xs">#</TableHead>
                    <TableHead className="text-xs">Produto</TableHead>
                    <TableHead className="text-xs text-right w-24">Qtd</TableHead>
                    <TableHead className="text-xs text-right w-32">Valor Unit.</TableHead>
                    <TableHead className="text-xs text-right w-32">Desconto</TableHead>
                    <TableHead className="text-xs text-right w-32">Total</TableHead>
                    <TableHead className="w-24 text-xs text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item: any, index: number) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-xs">{item.numeroItem || index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.descricao}</span>
                          <span className="text-xs text-muted-foreground">
                            Cód: {item.codigo} | {item.unidade}
                          </span>
                          {item.observacoes && (
                            <span className="text-xs text-muted-foreground italic mt-1">
                              {item.observacoes}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {Number(item.quantidade).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4
                        })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(Number(item.valorUnitario))}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(Number(item.valorDesconto) || 0)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {formatCurrency(Number(item.valorTotal))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(index)}
                            className="h-7 w-7 p-0"
                          >
                            <IconEdit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      {editingIndex !== null && (
        <OrcamentoEditItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          item={itens[editingIndex]}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}

