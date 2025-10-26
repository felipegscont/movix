"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface TotaisSectionProps {
  form: UseFormReturn<any>
  subtotal: number
  valorTotal: number
  showObservacoes?: boolean
}

export function TotaisSection({ 
  form, 
  subtotal, 
  valorTotal,
  showObservacoes = true 
}: TotaisSectionProps) {
  return (
    <div className="space-y-4">
      {/* Totais */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Totais</CardTitle>
          <CardDescription className="text-xs">
            Valores adicionais e total do documento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Subtotal (readonly) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Subtotal
              </label>
              <div className="h-9 px-3 py-2 bg-muted rounded-md border border-input flex items-center">
                <span className="text-sm font-semibold">
                  {subtotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>

            {/* Desconto */}
            <FormField
              control={form.control}
              name="valorDesconto"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Desconto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Frete */}
            <FormField
              control={form.control}
              name="valorFrete"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Frete</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Outros */}
            <FormField
              control={form.control}
              name="valorOutros"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Outros</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Total (readonly) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Valor Total
            </label>
            <div className="h-12 px-4 py-3 bg-primary/5 rounded-md border-2 border-primary/20 flex items-center">
              <span className="text-2xl font-bold text-primary">
                {valorTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      {showObservacoes && (
        <Card className="py-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Observações</CardTitle>
            <CardDescription className="text-xs">
              Informações adicionais sobre o documento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Textarea
                      placeholder="Digite observações adicionais..."
                      className="min-h-[100px] text-sm resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

