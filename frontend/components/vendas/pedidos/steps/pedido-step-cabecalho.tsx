"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ClienteCombobox } from "@/components/shared/combobox/cliente-combobox"
import { Badge } from "@/components/ui/badge"

interface PedidoStepCabecalhoProps {
  form: UseFormReturn<any>
  proximoNumero?: number | null
}

export function PedidoStepCabecalho({ form, proximoNumero }: PedidoStepCabecalhoProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-3">
      {/* Informações Gerais - Compacto */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Informações Gerais</CardTitle>
            <Badge variant="outline" className="h-5 text-xs">
              #{proximoNumero || form.watch('numero') || '...'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Número (readonly) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Número
              </label>
              <div className="h-8 px-2.5 py-1.5 bg-muted rounded-md border border-input flex items-center">
                <span className="text-xs font-semibold">
                  #{proximoNumero || form.watch('numero') || '...'}
                </span>
              </div>
            </div>

            {/* Data de Emissão */}
            <FormField
              control={form.control}
              name="dataEmissao"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Data de Emissão *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
        </CardContent>
      </Card>

      {/* Cliente - Compacto */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm">Cliente</CardTitle>
          <CardDescription className="text-xs hidden">
            Selecione o cliente para este pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">Cliente *</FormLabel>
                <FormControl>
                  <ClienteCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Vendedor - Compacto */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm">Vendedor</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <FormField
            control={form.control}
            name="vendedorNome"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">Nome do Vendedor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do vendedor..."
                    className="h-8 text-xs"
                    onKeyDown={handleKeyDown}
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
    </div>
  )
}

