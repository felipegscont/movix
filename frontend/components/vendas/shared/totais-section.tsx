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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevenir submit ao pressionar Enter
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-3">
      {/* Totais - Compacto */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm">Totais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Subtotal (readonly) */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Subtotal
              </label>
              <div className="h-8 px-2.5 py-1.5 bg-muted rounded-md border border-input flex items-center">
                <span className="text-xs font-semibold">
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
                  <FormLabel className="text-xs">Desconto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-8 text-xs"
                      onKeyDown={handleKeyDown}
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
                  <FormLabel className="text-xs">Frete</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-8 text-xs"
                      onKeyDown={handleKeyDown}
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
                  <FormLabel className="text-xs">Outros</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="h-8 text-xs"
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />

          {/* Total (readonly) - Compacto */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Valor Total
            </label>
            <div className="h-10 px-3 py-2 bg-primary/5 rounded-md border-2 border-primary/20 flex items-center">
              <span className="text-lg font-bold text-primary">
                {valorTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações - Compacto */}
      {showObservacoes && (
        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm">Observações</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="min-h-[80px] text-xs resize-none"
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

