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
    <div className="space-y-6">{
      try {
        const emitenteAtivo = await EmitenteService.getEmitenteAtivo()
        setEmitente(emitenteAtivo)
      } catch (error) {
        console.error("Erro ao carregar emitente:", error)
      } finally {
        setLoadingEmitente(false)
      }
    }

    loadEmitente()
  }, [])

  // Atualizar data de emissão para hoje se não estiver definida
  useEffect(() => {
    if (!formData.dataEmissao) {
      const hoje = new Date().toISOString().split('T')[0]
      updateFormData({ dataEmissao: hoje })
    }
  }, [formData.dataEmissao, updateFormData])

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
          {loadingEmitente ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : emitente ? (
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
          ) : (
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
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <ClienteCombobox
                value={formData.clienteId}
                onValueChange={(value) => updateFormData({ clienteId: value || "" })}
              />
              {errors.clienteId && (
                <p className="text-sm text-red-600">{errors.clienteId[0]}</p>
              )}
            </div>

            {/* Natureza da Operação */}
            <div className="space-y-2">
              <Label htmlFor="natureza">Natureza da Operação *</Label>
              <NaturezaOperacaoCombobox
                value={formData.naturezaOperacao}
                onValueChange={(value) => updateFormData({ naturezaOperacao: value || "" })}
              />
              {errors.naturezaOperacao && (
                <p className="text-sm text-red-600">{errors.naturezaOperacao[0]}</p>
              )}
            </div>

            {/* Série */}
            <div className="space-y-2">
              <Label htmlFor="serie">Série</Label>
              <Input
                id="serie"
                type="number"
                value={formData.serie || emitente?.serieNfe || 1}
                onChange={(e) => updateFormData({ serie: parseInt(e.target.value) || 1 })}
                min="1"
                max="999"
              />
            </div>

            {/* Tipo de Operação */}
            <div className="space-y-2">
              <Label htmlFor="tipoOperacao">Tipo de Operação</Label>
              <Select
                value={formData.tipoOperacao.toString()}
                onValueChange={(value) => updateFormData({ tipoOperacao: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Entrada</SelectItem>
                  <SelectItem value="1">1 - Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Consumidor Final */}
            <div className="space-y-2">
              <Label htmlFor="consumidorFinal">Consumidor Final</Label>
              <Select
                value={formData.consumidorFinal.toString()}
                onValueChange={(value) => updateFormData({ consumidorFinal: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Não</SelectItem>
                  <SelectItem value="1">1 - Sim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Presença do Comprador */}
            <div className="space-y-2">
              <Label htmlFor="presencaComprador">Presença do Comprador</Label>
              <Select
                value={formData.presencaComprador.toString()}
                onValueChange={(value) => updateFormData({ presencaComprador: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Não se aplica</SelectItem>
                  <SelectItem value="1">1 - Presencial</SelectItem>
                  <SelectItem value="2">2 - Internet</SelectItem>
                  <SelectItem value="3">3 - Teleatendimento</SelectItem>
                  <SelectItem value="4">4 - NFCe em operação com entrega a domicílio</SelectItem>
                  <SelectItem value="5">5 - Operação presencial, fora do estabelecimento</SelectItem>
                  <SelectItem value="9">9 - Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data de Emissão */}
            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={formData.dataEmissao || ""}
                onChange={(e) => updateFormData({ dataEmissao: e.target.value })}
              />
            </div>

            {/* Data de Saída */}
            <div className="space-y-2">
              <Label htmlFor="dataSaida">Data de Saída</Label>
              <Input
                id="dataSaida"
                type="date"
                value={formData.dataSaida || ""}
                onChange={(e) => updateFormData({ dataSaida: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Transporte */}
      <Card>
        <CardHeader>
          <CardTitle>Transporte</CardTitle>
          <CardDescription>
            Informações sobre o transporte da mercadoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modalidade do Frete */}
            <div className="space-y-2">
              <Label htmlFor="modalidadeFrete">Modalidade do Frete</Label>
              <Select
                value={formData.modalidadeFrete?.toString() || "9"}
                onValueChange={(value) => updateFormData({ modalidadeFrete: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Contratação do Frete por conta do Remetente (CIF)</SelectItem>
                  <SelectItem value="1">1 - Contratação do Frete por conta do Destinatário (FOB)</SelectItem>
                  <SelectItem value="2">2 - Contratação do Frete por conta de Terceiros</SelectItem>
                  <SelectItem value="3">3 - Transporte Próprio por conta do Remetente</SelectItem>
                  <SelectItem value="4">4 - Transporte Próprio por conta do Destinatário</SelectItem>
                  <SelectItem value="9">9 - Sem Ocorrência de Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor do Frete */}
            <div className="space-y-2">
              <Label htmlFor="valorFrete">Valor do Frete</Label>
              <Input
                id="valorFrete"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorFrete || 0}
                onChange={(e) => updateFormData({ valorFrete: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Valor do Seguro */}
            <div className="space-y-2">
              <Label htmlFor="valorSeguro">Valor do Seguro</Label>
              <Input
                id="valorSeguro"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorSeguro || 0}
                onChange={(e) => updateFormData({ valorSeguro: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Outras Despesas */}
            <div className="space-y-2">
              <Label htmlFor="valorOutros">Outras Despesas</Label>
              <Input
                id="valorOutros"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorOutros || 0}
                onChange={(e) => updateFormData({ valorOutros: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
