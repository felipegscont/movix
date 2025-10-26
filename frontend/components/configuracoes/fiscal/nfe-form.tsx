"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StaticCombobox, AMBIENTE_NFE_OPTIONS } from "@/components/shared/combobox/static-combobox"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconFileText, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"
import { ConfiguracaoNfeService } from "@/lib/services/configuracao-nfe.service"

const TIPO_FRETE_OPTIONS = [
  { value: 0, label: "0 - Contratação do Frete por conta do Remetente (CIF)" },
  { value: 1, label: "1 - Contratação do Frete por conta do Destinatário (FOB)" },
  { value: 2, label: "2 - Contratação do Frete por conta de Terceiros" },
  { value: 3, label: "3 - Transporte Próprio por conta do Remetente" },
  { value: 4, label: "4 - Transporte Próprio por conta do Destinatário" },
  { value: 9, label: "9 - Sem Ocorrência de Transporte" },
]

const INDICADOR_PRESENCA_OPTIONS = [
  { value: 0, label: "0 - Não se aplica" },
  { value: 1, label: "1 - Operação presencial" },
  { value: 2, label: "2 - Operação não presencial, pela Internet" },
  { value: 3, label: "3 - Operação não presencial, Teleatendimento" },
  { value: 4, label: "4 - NFC-e em operação com entrega a domicílio" },
  { value: 5, label: "5 - Operação presencial, fora do estabelecimento" },
  { value: 9, label: "9 - Operação não presencial, outros" },
]

const ORIENTACAO_IMPRESSAO_OPTIONS = [
  { value: 1, label: "Retrato" },
  { value: 2, label: "Paisagem" },
]

const nfeSchema = z.object({
  ambienteNfe: z.number().min(1).max(2),
  serieNfe: z.number().min(1).max(999),
  proximoNumeroNfe: z.number().min(1),
  tipoFrete: z.number().min(0).max(9).optional(),
  indicadorPresenca: z.number().min(0).max(9).optional(),
  orientacaoImpressao: z.number().min(1).max(2).optional(),
  ieSubstitutoTributario: z.string().optional(),
  observacoesNfe: z.string().optional(),
  documentosAutorizados: z.string().optional(),
})

type NfeFormData = z.infer<typeof nfeSchema>

export function NfeForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)

  const form = useForm<NfeFormData>({
    resolver: zodResolver(nfeSchema),
    defaultValues: {
      ambienteNfe: 2,
      serieNfe: 1,
      proximoNumeroNfe: 1,
      tipoFrete: 1,
      indicadorPresenca: 2,
      orientacaoImpressao: 1,
      ieSubstitutoTributario: "",
      observacoesNfe: "",
      documentosAutorizados: "",
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true)

        // Buscar emitente ativo
        const emitente = await EmitenteService.getEmitenteAtivo()

        if (!emitente) {
          toast.error("Nenhum emitente encontrado")
          return
        }

        setEmitenteId(emitente.id)

        // Buscar configuração de NFe
        const response = await ConfiguracaoNfeService.getByEmitente(emitente.id)

        if (response.success && response.data) {
          form.reset({
            ambienteNfe: response.data.ambiente,
            serieNfe: response.data.serie,
            proximoNumeroNfe: response.data.proximoNumero,
            tipoFrete: response.data.tipoFrete || 1,
            indicadorPresenca: response.data.indicadorPresenca || 2,
            orientacaoImpressao: response.data.orientacaoImpressao || 1,
            ieSubstitutoTributario: response.data.ieSubstitutoTributario || "",
            observacoesNfe: response.data.observacoesPadrao || "",
            documentosAutorizados: response.data.documentosAutorizados || "",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast.error("Erro ao carregar dados")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [form])

  const onSubmit = async (data: NfeFormData) => {
    if (!emitenteId) {
      toast.error("Configure os dados da empresa primeiro")
      return
    }

    try {
      setLoading(true)

      const response = await ConfiguracaoNfeService.upsert(emitenteId, {
        ambiente: data.ambienteNfe,
        serie: data.serieNfe,
        proximoNumero: data.proximoNumeroNfe,
        tipoFrete: data.tipoFrete,
        indicadorPresenca: data.indicadorPresenca,
        orientacaoImpressao: data.orientacaoImpressao,
        ieSubstitutoTributario: data.ieSubstitutoTributario,
        observacoesPadrao: data.observacoesNfe,
        documentosAutorizados: data.documentosAutorizados,
      })

      if (response.success) {
        toast.success("Configurações de NF-e salvas com sucesso!")
      } else {
        toast.error(response.error || "Erro ao salvar configurações")
      }
    } catch (error: any) {
      console.error("Erro ao salvar:", error)
      toast.error(error.message || "Erro ao salvar configurações")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <Skeleton className="h-[600px] w-full" />
  }

  if (!emitenteId) {
    return (
      <Alert variant="destructive">
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Empresa não configurada</AlertTitle>
        <AlertDescription>
          Configure os dados da empresa em{" "}
          <a href="/configuracoes/empresa/geral" className="underline font-medium">
            Configurações &gt; Empresa &gt; Geral
          </a>
        </AlertDescription>
      </Alert>
    )
  }

  const ambienteAtual = form.watch("ambienteNfe")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Alerta de Ambiente */}
        {ambienteAtual === 1 && (
          <Alert variant="destructive">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle>Ambiente de Produção</AlertTitle>
            <AlertDescription>
              Você está no ambiente de <strong>PRODUÇÃO</strong>. As notas emitidas terão validade fiscal.
            </AlertDescription>
          </Alert>
        )}

        {ambienteAtual === 2 && (
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertTitle>Ambiente de Homologação</AlertTitle>
            <AlertDescription>
              Você está no ambiente de <strong>HOMOLOGAÇÃO</strong>. Use para testes.
            </AlertDescription>
          </Alert>
        )}

        {/* Card Principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Configurações da NF-e
            </CardTitle>
            <CardDescription>
              Configure ambiente, numeração e parâmetros da Nota Fiscal Eletrônica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ambiente e Numeração */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ambienteNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente *</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={AMBIENTE_NFE_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serieNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={999}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proximoNumeroNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Número *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Frete e Indicador de Presença */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipoFrete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Frete Padrão</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={TIPO_FRETE_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indicadorPresenca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicador de Presença</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={INDICADOR_PRESENCA_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Orientação e IE Substituto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orientacaoImpressao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientação da Impressão</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={ORIENTACAO_IMPRESSAO_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ieSubstitutoTributario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IE do Substituto Tributário</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Inscrição Estadual" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoesNfe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Padrão na NF-e</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observações que aparecerão em todas as notas"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Texto que será incluído automaticamente em todas as NF-e
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Documentos Autorizados */}
            <FormField
              control={form.control}
              name="documentosAutorizados"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentos Autorizados (CNPJ/CPF)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Digite os CNPJ ou CPF autorizados, separados por vírgula"
                      rows={2}
                    />
                  </FormControl>
                  <FormDescription>
                    Documentos autorizados a fazer download do XML da NF-e
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

