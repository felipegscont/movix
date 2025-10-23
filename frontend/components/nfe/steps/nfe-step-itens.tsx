"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NfeFormData, NfeItemFormData } from "../types"
import { NfeItemDialog } from "../nfe-item-dialog"

interface NfeStepItensProps {
  formData: NfeFormData
  updateFormData: (data: Partial<NfeFormData>) => void
  errors: Record<string, string[]>
}

export function NfeStepItens({ formData, updateFormData, errors }: NfeStepItensProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NfeItemFormData | undefined>()
  const [editingIndex, setEditingIndex] = useState<number | undefined>()

  const handleAddItem = () => {
    setEditingItem(undefined)
    setEditingIndex(undefined)
    setDialogOpen(true)
  }

  const handleEditItem = (item: NfeItemFormData, index: number) => {
    setEditingItem(item)
    setEditingIndex(index)
    setDialogOpen(true)
  }

  const handleSaveItem = (item: NfeItemFormData) => {
    if (editingIndex !== undefined) {
      // Editar item existente
      const newItems = [...formData.itens]
      newItems[editingIndex] = item
      updateFormData({ itens: newItems })
    } else {
      // Adicionar novo item
      updateFormData({ itens: [...formData.itens, item] })
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = formData.itens.filter((_, i) => i !== index)
    updateFormData({ itens: newItems })
  }

  const calculateSubtotal = () => {
    return formData.itens.reduce((sum, item) => sum + item.valorTotal, 0)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Itens da NFe</CardTitle>
              <CardDescription>
                Adicione os produtos e serviços da nota fiscal
              </CardDescription>
            </div>
            <Button onClick={handleAddItem}>
              <IconPlus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.itens && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.itens[0]}</AlertDescription>
            </Alert>
          )}

          {formData.itens.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <IconAlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum item adicionado</p>
              <p className="text-sm mt-2">
                Clique em "Adicionar Item" para começar
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">#</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">Desconto</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell className="text-right">
                          {item.quantidadeComercial} {item.unidadeComercial}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.valorUnitario.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.valorDesconto || 0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.valorTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(item, index)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Resumo */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de Itens:</span>
                    <span className="font-medium">{formData.itens.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Subtotal:</span>
                    <span>
                      {calculateSubtotal().toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <NfeItemDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        itemIndex={editingIndex}
      />
    </>
  )
}
