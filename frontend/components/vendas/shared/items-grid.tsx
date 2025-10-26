"use client"

import { useState } from "react"
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Item {
  numeroItem: number
  produtoId: string
  codigo: string
  descricao: string
  unidade: string
  quantidade: number
  valorUnitario: number
  valorDesconto?: number
  valorTotal: number
  observacoes?: string
}

interface ItemsGridProps {
  itens: Item[]
  onAddItem: () => void
  onEditItem: (index: number) => void
  onRemoveItem: (index: number) => void
  title?: string
  description?: string
}

export function ItemsGrid({
  itens,
  onAddItem,
  onEditItem,
  onRemoveItem,
  title = "Itens",
  description = "Lista de produtos e serviços"
}: ItemsGridProps) {
  const calculateSubtotal = () => {
    return itens.reduce((sum, item) => sum + (item.valorTotal || 0), 0)
  }

  const handleRemoveItem = (index: number) => {
    if (confirm('Deseja realmente remover este item?')) {
      onRemoveItem(index)
    }
  }

  return (
    <div className="space-y-4">
      {/* Botão Adicionar Item */}
      <Card className="py-3">
        <CardContent className="py-3">
          <Button
            type="button"
            onClick={onAddItem}
            className="w-full"
            variant="outline"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{title} ({itens.length})</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
            {itens.length > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Subtotal</div>
                <div className="text-lg font-bold">
                  {calculateSubtotal().toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {itens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum item adicionado. Clique em "Adicionar Item" para começar.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
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
                  {itens.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-xs">{item.numeroItem}</TableCell>
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
                        {item.quantidade.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4
                        })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {item.valorUnitario.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {(item.valorDesconto || 0).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {item.valorTotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditItem(index)}
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
    </div>
  )
}

