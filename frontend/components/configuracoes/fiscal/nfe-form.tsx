"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconAlertTriangle, IconCloud, IconFlask } from "@tabler/icons-react"
import { EmitenteService } from "@/lib/services/emitente.service"
import { ConfiguracaoNfeService } from "@/lib/services/configuracao-nfe.service"
import { NfeConfigFields, NfeInutilizacaoFields } from "./nfe-form-tabs"

const nfeSchema = z.object({
  habilitarHomologacao: z.boolean(),
  serieProducao: z.number().min(1).max(999),
  proximoNumeroProducao: z.number().min(1),
  tipoFreteProducao: z.number().optional(),
  indicadorPresencaProducao: z.number().optional(),
  orientacaoImpressaoProducao: z.number().optional(),
  ieSubstitutoProducao: z.string().optional(),
  observacoesProducao: z.string().optional(),
  documentosAutorizadosProducao: z.string().optional(),
  numeroInicialInutilizarProducao: z.number().optional(),
  numeroFinalInutilizarProducao: z.number().optional(),
  serieInutilizarProducao: z.number().optional(),
  anoInutilizarProducao: z.number().optional(),
  justificativaInutilizarProducao: z.string().optional(),
  serieHomologacao: z.number().min(1).max(999),
  proximoNumeroHomologacao: z.number().min(1),
  tipoFreteHomologacao: z.number().optional(),
  indicadorPresencaHomologacao: z.number().optional(),
  orientacaoImpressaoHomologacao: z.number().optional(),
  ieSubstitutoHomologacao: z.string().optional(),
  observacoesHomologacao: z.string().optional(),
  documentosAutorizadosHomologacao: z.string().optional(),
  numeroInicialInutilizarHomologacao: z.number().optional(),
  numeroFinalInutilizarHomologacao: z.number().optional(),
  serieInutilizarHomologacao: z.number().optional(),
  anoInutilizarHomologacao: z.number().optional(),
  justificativaInutilizarHomologacao: z.string().optional(),
})

type NfeFormData = z.infer<typeof nfeSchema>

export function NfeForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)

  const form = useForm<NfeFormData>({
    resolver: zodResolver(nfeSchema),
    defaultValues: {
      habilitarHomologacao: true,
      serieProducao: 1, proximoNumeroProducao: 1, tipoFreteProducao: 1,
      indicadorPresencaProducao: 2, orientacaoImpressaoProducao: 1,
      ieSubstitutoProducao: "", observacoesProducao: "", documentosAutorizadosProducao: "",
      numeroInicialInutilizarProducao: undefined, numeroFinalInutilizarProducao: undefined,
      serieInutilizarProducao: undefined, anoInutilizarProducao: undefined, justificativaInutilizarProducao: "",
      serieHomologacao: 1, proximoNumeroHomologacao: 1, tipoFreteHomologacao: 1,
      indicadorPresencaHomologacao: 2, orientacaoImpressaoHomologacao: 1,
      ieSubstitutoHomologacao: "", observacoesHomologacao: "", documentosAutorizadosHomologacao: "",
      numeroInicialInutilizarHomologacao: undefined, numeroFinalInutilizarHomologacao: undefined,
      serieInutilizarHomologacao: undefined, anoInutilizarHomologacao: undefined, justificativaInutilizarHomologacao: "",
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true)
        const emitente = await EmitenteService.getEmitenteAtivo()
        if (!emitente) return toast.error("Nenhum emitente encontrado")

        setEmitenteId(emitente.id)
        const response = await ConfiguracaoNfeService.getByEmitente(emitente.id)

        if (response.success && response.data) {
          const d = response.data
          form.reset({
            habilitarHomologacao: d.ambienteAtivo === 2,
            serieProducao: d.serieProducao || 1, proximoNumeroProducao: d.proximoNumeroProducao || 1,
            tipoFreteProducao: d.tipoFreteProducao || 1, indicadorPresencaProducao: d.indicadorPresencaProducao || 2,
            orientacaoImpressaoProducao: d.orientacaoImpressaoProducao || 1, ieSubstitutoProducao: d.ieSubstitutoProducao || "",
            observacoesProducao: d.observacoesProducao || "", documentosAutorizadosProducao: d.documentosAutorizadosProducao || "",
            numeroInicialInutilizarProducao: d.numeroInicialInutilizarProducao, numeroFinalInutilizarProducao: d.numeroFinalInutilizarProducao,
            serieInutilizarProducao: d.serieInutilizarProducao, anoInutilizarProducao: d.anoInutilizarProducao,
            justificativaInutilizarProducao: d.justificativaInutilizarProducao || "",
            serieHomologacao: d.serieHomologacao || 1, proximoNumeroHomologacao: d.proximoNumeroHomologacao || 1,
            tipoFreteHomologacao: d.tipoFreteHomologacao || 1, indicadorPresencaHomologacao: d.indicadorPresencaHomologacao || 2,
            orientacaoImpressaoHomologacao: d.orientacaoImpressaoHomologacao || 1, ieSubstitutoHomologacao: d.ieSubstitutoHomologacao || "",
            observacoesHomologacao: d.observacoesHomologacao || "", documentosAutorizadosHomologacao: d.documentosAutorizadosHomologacao || "",
            numeroInicialInutilizarHomologacao: d.numeroInicialInutilizarHomologacao, numeroFinalInutilizarHomologacao: d.numeroFinalInutilizarHomologacao,
            serieInutilizarHomologacao: d.serieInutilizarHomologacao, anoInutilizarHomologacao: d.anoInutilizarHomologacao,
            justificativaInutilizarHomologacao: d.justificativaInutilizarHomologacao || "",
          })
        }
      } catch (error) {
        toast.error("Erro ao carregar dados")
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [form])

  const onSubmit = async (data: NfeFormData) => {
    if (!emitenteId) return toast.error("Configure os dados da empresa primeiro")
    try {
      setLoading(true)
      // Remover habilitarHomologacao e adicionar ambienteAtivo
      const { habilitarHomologacao, ...rest } = data
      const payload = { ...rest, ambienteAtivo: habilitarHomologacao ? 2 : 1 }
      const response = await ConfiguracaoNfeService.upsert(emitenteId, payload)
      response.success ? toast.success("Configurações salvas!") : toast.error(response.error || "Erro ao salvar")
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar")
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
          Configure em <a href="/configuracoes/empresa/geral" className="underline font-medium">Empresa &gt; Geral</a>
        </AlertDescription>
      </Alert>
    )
  }

  const habilitarHomologacao = form.watch("habilitarHomologacao")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Card de Ambiente Ativo */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="habilitarHomologacao"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">
                      Ambiente Ativo
                    </FormLabel>
                    <FormDescription>
                      {habilitarHomologacao ? (
                        <span className="flex items-center gap-2 text-orange-600">
                          <IconFlask className="h-4 w-4" />
                          Homologação - Ambiente de testes
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-green-600">
                          <IconCloud className="h-4 w-4" />
                          Produção - Notas com validade fiscal
                        </span>
                      )}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Card de Configurações com Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="producao" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="producao" className="flex items-center gap-2">
                  <IconCloud className="h-4 w-4" />
                  Produção
                </TabsTrigger>
                <TabsTrigger value="homologacao" className="flex items-center gap-2">
                  <IconFlask className="h-4 w-4" />
                  Homologação
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="producao" className="w-full">
              <TabsContent value="producao" className="mt-0">
                <NfeConfigFields form={form} prefix="Producao" showInutilizacao={false} />
              </TabsContent>

              <TabsContent value="homologacao" className="mt-0">
                <NfeConfigFields form={form} prefix="Homologacao" showInutilizacao={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Card de Inutilização com Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="producao" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="producao" className="flex items-center gap-2">
                  <IconCloud className="h-4 w-4" />
                  Produção
                </TabsTrigger>
                <TabsTrigger value="homologacao" className="flex items-center gap-2">
                  <IconFlask className="h-4 w-4" />
                  Homologação
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="producao" className="w-full">
              <TabsContent value="producao" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inutilizar Numeração de Nota Fiscal</h3>
                  <NfeInutilizacaoFields form={form} prefix="Producao" />
                </div>
              </TabsContent>

              <TabsContent value="homologacao" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inutilizar Numeração de Nota Fiscal</h3>
                  <NfeInutilizacaoFields form={form} prefix="Homologacao" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : <><IconDeviceFloppy className="mr-2 h-4 w-4" />Salvar</>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
