"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { IconAlertCircle } from "@tabler/icons-react"
import Link from "next/link"
import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

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
    <div className="space-y-6">
      {/* Card do Emitente */}
      <Card>
        <CardHeader>
          <CardTitle>Emitente</CardTitle>
          <CardDescription>
            Dados da empresa que está emitindo a NFe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emitente</p>
                <p className="text-lg font-semibold">{emitente.razaoSocial}</p>
                <p className="text-sm text-muted-foreground">
                  CNPJ: {emitente.cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Série NFe</p>
                <p className="text-2xl font-bold">{emitente.serieNfe || 1}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
          <CardDescription>
            Informações básicas da nota fiscal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cliente */}
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <FormControl>
                  <ClienteCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Natureza da Operação */}
          <FormField
            control={form.control}
            name="naturezaOperacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Natureza da Operação *</FormLabel>
                <FormControl>
                  <NaturezaOperacaoCombobox
                    value={field.value}
                    onValueChange={(descricao, naturezaId) => {
                      field.onChange(descricao)
                      if (naturezaId) {
                        form.setValue('naturezaOperacaoId', naturezaId)
                      }
                    }}
                    allowCustom={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Operação */}
            <FormField
              control={form.control}
              name="tipoOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Operação *</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
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

            {/* Finalidade */}
            <FormField
              control={form.control}
              name="finalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finalidade *</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Consumidor Final */}
            <FormField
              control={form.control}
              name="consumidorFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumidor Final *</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
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

            {/* Presença do Comprador */}
            <FormField
              control={form.control}
              name="presencaComprador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presença do Comprador *</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            {/* Data de Emissão */}
            <FormField
              control={form.control}
              name="dataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data de Saída */}
            <FormField
              control={form.control}
              name="dataSaida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Saída</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Modalidade de Frete */}
          <FormField
            control={form.control}
            name="modalidadeFrete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade de Frete *</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Por conta do emitente</SelectItem>
                    <SelectItem value="1">Por conta do destinatário</SelectItem>
                    <SelectItem value="2">Por conta de terceiros</SelectItem>
                    <SelectItem value="3">Transporte próprio por conta do remetente</SelectItem>
                    <SelectItem value="4">Transporte próprio por conta do destinatário</SelectItem>
                    <SelectItem value="9">Sem frete</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Card de Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
          <CardDescription>
            Informações complementares da nota fiscal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="informacoesAdicionais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações Adicionais</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informações de interesse do contribuinte" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="informacoesFisco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações ao Fisco</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informações de interesse do fisco" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
