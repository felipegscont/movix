"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconLoader2, IconPackage, IconReceipt } from "@tabler/icons-react"
import { toast } from "sonner"
import { nfeItemSchema, type NfeItemFormData } from "@/lib/schemas/nfe.schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"

interface NfeEditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: NfeItemFormData | null
  onSave: (item: NfeItemFormData) => void
}

export function NfeEditItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: NfeEditItemDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<NfeItemFormData>({
    resolver: zodResolver(nfeItemSchema) as any,
    defaultValues: item || undefined,
  })

  useEffect(() => {
    if (open && item) {
      form.reset(item)
    }
  }, [open, item, form])

  const handleSubmit = async (data: NfeItemFormData) => {
    try {
      setLoading(true)
      
      // Recalcular valor total
      data.valorTotal = 
        (data.quantidadeComercial * data.valorUnitario) - 
        (data.valorDesconto || 0) +
        (data.valorFrete || 0) +
        (data.valorSeguro || 0) +
        (data.valorOutros || 0)

      // Recalcular impostos
      calcularImpostos(data)

      onSave(data)
      onOpenChange(false)
      toast.success("Item atualizado!")
    } catch (error: any) {
      console.error("Erro ao salvar item:", error)
      toast.error(error.message || "Erro ao salvar item")
    } finally {
      setLoading(false)
    }
  }

  const calcularImpostos = (item: NfeItemFormData) => {
    const valorBase = item.quantidadeComercial * item.valorUnitario - (item.valorDesconto || 0)

    // ICMS
    if (item.icms) {
      item.icms.baseCalculo = valorBase
      item.icms.valor = (valorBase * (item.icms.aliquota || 0)) / 100
    }

    // IPI
    if (item.ipi) {
      item.ipi.baseCalculo = valorBase
      item.ipi.valor = (valorBase * (item.ipi.aliquota || 0)) / 100
    }

    // PIS
    if (item.pis) {
      item.pis.baseCalculo = valorBase
      item.pis.valor = (valorBase * (item.pis.aliquota || 0)) / 100
    }

    // COFINS
    if (item.cofins) {
      item.cofins.baseCalculo = valorBase
      item.cofins.valor = (valorBase * (item.cofins.aliquota || 0)) / 100
    }
  }

  const calcularValorTotal = () => {
    const qtd = form.watch('quantidadeComercial') || 0
    const valor = form.watch('valorUnitario') || 0
    const desconto = form.watch('valorDesconto') || 0
    const frete = form.watch('valorFrete') || 0
    const seguro = form.watch('valorSeguro') || 0
    const outros = form.watch('valorOutros') || 0
    
    return (qtd * valor) - desconto + frete + seguro + outros
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>
            Ajuste os valores e impostos do item (específicos desta NFe, não altera o cadastro do produto)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="produto" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="produto">
                  <IconPackage className="h-4 w-4 mr-2" />
                  Produto
                </TabsTrigger>
                <TabsTrigger value="valores">
                  Valores
                </TabsTrigger>
                <TabsTrigger value="impostos">
                  <IconReceipt className="h-4 w-4 mr-2" />
                  Impostos
                </TabsTrigger>
              </TabsList>

              {/* Aba Produto */}
              <TabsContent value="produto" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Código</Label>
                    <Input value={item?.codigo} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Input value={item?.unidadeComercial} disabled />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={item?.descricao} disabled />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantidadeComercial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Aba Valores */}
              <TabsContent value="valores" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valorFrete"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frete</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valorSeguro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seguro</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valorOutros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outras Despesas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Valor Total:</span>
                    <span className="text-2xl font-bold">
                      {calcularValorTotal().toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Aba Impostos */}
              <TabsContent value="impostos" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Ajuste as alíquotas dos impostos se necessário
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">ICMS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alíquota (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form.watch('icms.aliquota') || 0}
                          onChange={(e) => form.setValue('icms.aliquota', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">PIS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alíquota (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form.watch('pis.aliquota') || 0}
                          onChange={(e) => form.setValue('pis.aliquota', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">COFINS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alíquota (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form.watch('cofins.aliquota') || 0}
                          onChange={(e) => form.setValue('cofins.aliquota', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

