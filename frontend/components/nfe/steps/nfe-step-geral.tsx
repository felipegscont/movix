"use client"

import Link from "next/link"
import { UseFormReturn } from "react-hook-form"
import { IconAlertCircle } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { ClienteCombobox } from "@/components/shared/combobox/cliente-combobox"
import { NaturezaOperacaoCombobox } from "@/components/shared/combobox/natureza-operacao-combobox"

interface NfeStepGeralProps {
  form: UseFormReturn<any>
  emitente: any
}

export function NfeStepGeral({ form, emitente }: NfeStepGeralProps) {
  if (!emitente) {
    return (
      <Alert>
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Emitente não configurado</AlertTitle>
        <AlertDescription>
          Configure o emitente antes de criar NFes.{" "}
          <Link href="/configuracoes/emitente" className="underline font-medium">
            Clique aqui para configurar
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Card do Emitente - Compacto */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Emitente</CardTitle>
          <CardDescription className="text-xs">
            Dados da empresa que está emitindo a NFe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Emitente</p>
                <p className="text-sm font-semibold">{emitente.razaoSocial}</p>
                <p className="text-xs text-muted-foreground">
                  CNPJ: {emitente.cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground">Série NFe</p>
                <p className="text-xl font-bold">{emitente.serieNfe || 1}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Dados Gerais - Compacto */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dados Gerais</CardTitle>
          <CardDescription className="text-xs">
            Informações básicas da nota fiscal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {/* Cliente e Natureza da Operação */}
          <div className="grid grid-cols-2 gap-2.5">
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem className="space-y-1 min-w-0 overflow-hidden">
                  <FormLabel className="text-xs font-medium">Cliente *</FormLabel>
                  <FormControl>
                    <div className="overflow-hidden">
                      <ClienteCombobox value={field.value} onValueChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="naturezaOperacao"
              render={({ field }) => (
                <FormItem className="space-y-1 min-w-0 overflow-hidden">
                  <FormLabel className="text-xs font-medium">Natureza da Operação *</FormLabel>
                  <FormControl>
                    <div className="overflow-hidden">
                      <NaturezaOperacaoCombobox
                        value={field.value}
                        onValueChange={(descricao, naturezaId) => {
                          field.onChange(descricao)
                          if (naturezaId) form.setValue('naturezaOperacaoId', naturezaId)
                        }}
                        allowCustom={true}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tipo, Finalidade, Consumidor Final e Presença */}
          <div className="grid grid-cols-4 gap-2">
            <FormField
              control={form.control}
              name="tipoOperacao"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Tipo *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Entrada</SelectItem>
                      <SelectItem value="1">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="finalidade"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Finalidade *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Normal</SelectItem>
                      <SelectItem value="1">Complementar</SelectItem>
                      <SelectItem value="2">Ajuste</SelectItem>
                      <SelectItem value="3">Devolução</SelectItem>
                      <SelectItem value="4">Devolução de Mercadoria</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consumidorFinal"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Cons. Final *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Não</SelectItem>
                      <SelectItem value="1">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presencaComprador"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Presença *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Não se aplica</SelectItem>
                      <SelectItem value="1">Presencial</SelectItem>
                      <SelectItem value="2">Internet</SelectItem>
                      <SelectItem value="3">Teleatendimento</SelectItem>
                      <SelectItem value="4">Entrega em domicílio</SelectItem>
                      <SelectItem value="9">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Datas e Frete */}
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="dataEmissao"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-9 text-sm w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataSaida"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Data de Saída</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-9 text-sm w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modalidadeFrete"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Modalidade de Frete *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Por conta do emitente</SelectItem>
                      <SelectItem value="1">Por conta do destinatário</SelectItem>
                      <SelectItem value="2">Por conta de terceiros</SelectItem>
                      <SelectItem value="3">Transporte próprio remetente</SelectItem>
                      <SelectItem value="4">Transporte próprio destinatário</SelectItem>
                      <SelectItem value="9">Sem frete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card de Informações Adicionais - Compacto */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Informações Adicionais</CardTitle>
          <CardDescription className="text-xs">Informações complementares da nota fiscal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="informacoesAdicionais"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Informações Adicionais</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Informações de interesse do contribuinte" className="h-9 text-sm w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="informacoesFisco"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-medium">Informações ao Fisco</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Informações de interesse do fisco" className="h-9 text-sm w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
