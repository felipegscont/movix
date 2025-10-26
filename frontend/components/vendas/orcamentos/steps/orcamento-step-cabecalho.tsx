"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ClienteCombobox } from "@/components/shared/combobox/cliente-combobox"
import { Badge } from "@/components/ui/badge"

interface OrcamentoStepCabecalhoProps {
  form: UseFormReturn<any>
  proximoNumero?: number | null
}

export function OrcamentoStepCabecalho({ form, proximoNumero }: OrcamentoStepCabecalhoProps) {
  return (
    <div className="space-y-4">
      {/* Informações Gerais */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Informações Gerais</CardTitle>
              <CardDescription className="text-xs">
                Dados principais do orçamento
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Orçamento #{proximoNumero || form.watch('numero') || '...'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Número (readonly) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Número do Orçamento
              </label>
              <div className="h-9 px-3 py-2 bg-muted rounded-md border border-input flex items-center">
                <span className="text-sm font-semibold">
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
                  <FormLabel className="text-xs font-medium">Data de Emissão *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Data de Validade */}
            <FormField
              control={form.control}
              name="dataValidade"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Data de Validade *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-9 text-sm"
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

      {/* Cliente */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cliente</CardTitle>
          <CardDescription className="text-xs">
            Selecione o cliente para este orçamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Cliente *</FormLabel>
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

      {/* Vendedor */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vendedor</CardTitle>
          <CardDescription className="text-xs">
            Nome do vendedor responsável (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="vendedorNome"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Nome do Vendedor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome do vendedor..."
                    className="h-9 text-sm"
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

