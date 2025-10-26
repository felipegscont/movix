"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProdutoCombobox } from "@/components/shared/combobox/produto-combobox"
import { itemFormSchema, type ItemFormData } from "@/lib/schemas/pedido.schema"
import { IconDeviceFloppy, IconX } from "@tabler/icons-react"

interface ItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: ItemFormData | null
  onSave: (item: ItemFormData) => void
  calculateItemTotal: (item: Partial<ItemFormData>) => number
  title?: string
}

export function ItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
  calculateItemTotal,
  title = "Adicionar Item"
}: ItemDialogProps) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema) as any,
    defaultValues: {
      produtoId: '',
      codigo: '',
      descricao: '',
      unidade: 'UN',
      quantidade: 1,
      valorUnitario: 0,
      valorDesconto: 0,
      valorTotal: 0,
      observacoes: '',
    }
  })

  // Preencher formulário ao editar
  useEffect(() => {
    if (item) {
      form.reset(item)
    } else {
      form.reset({
        produtoId: '',
        codigo: '',
        descricao: '',
        unidade: 'UN',
        quantidade: 1,
        valorUnitario: 0,
        valorDesconto: 0,
        valorTotal: 0,
        observacoes: '',
      })
    }
  }, [item, form])

  // Calcular total automaticamente
  useEffect(() => {
    const subscription = form.watch((value) => {
      const total = calculateItemTotal(value as Partial<ItemFormData>)
      form.setValue('valorTotal', total, { shouldValidate: false })
    })
    return () => subscription.unsubscribe()
  }, [form, calculateItemTotal])

  const handleProdutoSelect = (produtoId: string, produto: any) => {
    form.setValue('produtoId', produtoId)
    form.setValue('codigo', produto.codigo || '')
    form.setValue('descricao', produto.descricao || '')
    form.setValue('unidade', produto.unidade || 'UN')
    form.setValue('valorUnitario', produto.valorUnitario || 0)
  }

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data)
    form.reset()
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha as informações do item
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Produto */}
            <FormField
              control={form.control}
              name="produtoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto *</FormLabel>
                  <FormControl>
                    <ProdutoCombobox
                      value={field.value}
                      onChange={handleProdutoSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Código */}
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unidade */}
              <FormField
                control={form.control}
                name="unidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Quantidade */}
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor Unitário */}
              <FormField
                control={form.control}
                name="valorUnitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Unitário *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Desconto */}
              <FormField
                control={form.control}
                name="valorDesconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total (readonly) */}
              <FormField
                control={form.control}
                name="valorTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="bg-muted font-semibold"
                        value={field.value?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre este item..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <IconX className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit">
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                Salvar Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

