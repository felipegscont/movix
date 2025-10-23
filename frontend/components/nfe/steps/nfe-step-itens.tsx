"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { type NfeItemFormData } from "@/lib/schemas/nfe.schema"
import { UseFormReturn } from "react-hook-form"

interface NfeStepItensProps {
  form: UseFormReturn<any>
  addItem: (item: NfeItemFormData) => void
  updateItem: (index: number, item: NfeItemFormData) => void
  removeItem: (index: number) => void
}

export function NfeStepItens({ form, addItem, updateItem, removeItem }: NfeStepItensProps) {
  const itens = form.watch('itens') || []

  const handleRemoveItem = (index: number) => {
    if (confirm('Deseja realmente remover este item?')) {
      removeItem(index)
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Itens da NFe</CardTitle>
            <CardDescription>
              Adicione os produtos e serviços da nota fiscal
            </CardDescription>
          </div>
          <Button type="button" onClick={() => alert('Funcionalidade de adicionar item em desenvolvimento')}>
            <IconPlus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  {itens.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.codigo}</div>
                        {item.codigoBarras && (
                          <div className="text-xs text-muted-foreground">
                            EAN: {item.codigoBarras}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{item.descricao}</div>
                        <div className="flex gap-1 mt-1">
                          {item.pis?.cstId && (
                            <Badge variant="outline" className="text-xs">
                              PIS: {item.pis.cstId}
                            </Badge>
                          )}
                          {item.cofins?.cstId && (
                            <Badge variant="outline" className="text-xs">
                              COFINS: {item.cofins.cstId}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantidadeComercial} {item.unidadeComercial}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.valorUnitario)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.valorDesconto || 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.valorTotal)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => alert('Funcionalidade de editar item em desenvolvimento')}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
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
                  <span className="font-medium">{itens.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
