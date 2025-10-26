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
  anoInutilizarProducao: z.number().min(2000, "Ano mínimo: 2000").max(2100, "Ano máximo: 2100").optional(),
  justificativaInutilizarProducao: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres").optional(),
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
  anoInutilizarHomologacao: z.number().min(2000, "Ano mínimo: 2000").max(2100, "Ano máximo: 2100").optional(),
  justificativaInutilizarHomologacao: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres").optional(),
  modeloNfe: z.enum(["4.00"]).optional(),
})

type NfeFormData = z.infer<typeof nfeSchema>

export function NfeForm() {
  const [loading, setLoading] = useState(false)
  const [loadingInutilizacao, setLoadingInutilizacao] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)
  const [activeTabConfig, setActiveTabConfig] = useState<"producao" | "homologacao">("homologacao")
  const [activeTabInutilizacao, setActiveTabInutilizacao] = useState<"producao" | "homologacao">("homologacao")

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
      modeloNfe: "4.00",
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
            modeloNfe: d.modeloNfe || "4.00",
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

  // Não precisa mais sincronizar - cada card é independente
  const habilitarHomologacao = form.watch("habilitarHomologacao")

  // Salvar apenas configurações de NFe
  const onSubmitConfig = async () => {
    if (!emitenteId) return toast.error("Configure os dados da empresa primeiro")

    const data = form.getValues()
    const ambiente = activeTabConfig === "homologacao" ? "Homologacao" : "Producao"

    try {
      setLoading(true)

      const payload: any = {
        // Salvar ambiente ativo
        ambienteAtivo: data.habilitarHomologacao ? 2 : 1,
        // Salvar modelo NFe
        modeloNfe: data.modeloNfe || "4.00",
      }

      // Adicionar campos do ambiente sendo editado
      if (ambiente === "Producao") {
        payload.serieProducao = data.serieProducao
        payload.proximoNumeroProducao = data.proximoNumeroProducao
        payload.tipoFreteProducao = data.tipoFreteProducao
        payload.indicadorPresencaProducao = data.indicadorPresencaProducao
        payload.orientacaoImpressaoProducao = data.orientacaoImpressaoProducao
        payload.ieSubstitutoProducao = data.ieSubstitutoProducao
        payload.observacoesProducao = data.observacoesProducao
        payload.documentosAutorizadosProducao = data.documentosAutorizadosProducao
      } else {
        payload.serieHomologacao = data.serieHomologacao
        payload.proximoNumeroHomologacao = data.proximoNumeroHomologacao
        payload.tipoFreteHomologacao = data.tipoFreteHomologacao
        payload.indicadorPresencaHomologacao = data.indicadorPresencaHomologacao
        payload.orientacaoImpressaoHomologacao = data.orientacaoImpressaoHomologacao
        payload.ieSubstitutoHomologacao = data.ieSubstitutoHomologacao
        payload.observacoesHomologacao = data.observacoesHomologacao
        payload.documentosAutorizadosHomologacao = data.documentosAutorizadosHomologacao
      }

      const response = await ConfiguracaoNfeService.upsert(emitenteId, payload)
      response.success ? toast.success("Configurações de NFe salvas!") : toast.error(response.error || "Erro ao salvar")
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar")
    } finally {
      setLoading(false)
    }
  }

  // Salvar apenas inutilização
  const onSubmitInutilizacao = async () => {
    if (!emitenteId) return toast.error("Configure os dados da empresa primeiro")

    const data = form.getValues()
    const ambiente = activeTabInutilizacao === "homologacao" ? "Homologacao" : "Producao"

    try {
      setLoadingInutilizacao(true)

      const payload: any = {}

      // Adicionar campos de inutilização do ambiente ativo
      if (ambiente === "Producao") {
        payload.numeroInicialInutilizarProducao = data.numeroInicialInutilizarProducao
        payload.numeroFinalInutilizarProducao = data.numeroFinalInutilizarProducao
        payload.serieInutilizarProducao = data.serieInutilizarProducao
        payload.anoInutilizarProducao = data.anoInutilizarProducao
        payload.justificativaInutilizarProducao = data.justificativaInutilizarProducao
      } else {
        payload.numeroInicialInutilizarHomologacao = data.numeroInicialInutilizarHomologacao
        payload.numeroFinalInutilizarHomologacao = data.numeroFinalInutilizarHomologacao
        payload.serieInutilizarHomologacao = data.serieInutilizarHomologacao
        payload.anoInutilizarHomologacao = data.anoInutilizarHomologacao
        payload.justificativaInutilizarHomologacao = data.justificativaInutilizarHomologacao
      }

      const response = await ConfiguracaoNfeService.upsert(emitenteId, payload)
      response.success ? toast.success("Configurações de inutilização salvas!") : toast.error(response.error || "Erro ao salvar")
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar")
    } finally {
      setLoadingInutilizacao(false)
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

  return (
    <Form {...form}>
      <div className="space-y-4">
        {/* Ambiente Ativo Global - Compacto */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="habilitarHomologacao"
              render={({ field }) => (
                <>
                  {field.value ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-500">
                      <IconFlask className="h-3.5 w-3.5" />
                      Ambiente Ativo: Homologação
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-500">
                      <IconCloud className="h-3.5 w-3.5" />
                      Ambiente Ativo: Produção
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="habilitarHomologacao"
            render={({ field }) => (
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            )}
          />
        </div>

        {/* Configurações */}
        <Card className={activeTabConfig === "producao" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-orange-500"}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Configurações de NFe</h3>
                {habilitarHomologacao === (activeTabConfig === "homologacao") && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Ambiente Ativo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {activeTabConfig === "producao" ? "Produção" : "Homologação"}
                </span>
                <Switch
                  checked={activeTabConfig === "homologacao"}
                  onCheckedChange={(checked) => setActiveTabConfig(checked ? "homologacao" : "producao")}
                />
              </div>
            </div>

            <Tabs value={activeTabConfig} onValueChange={(value) => setActiveTabConfig(value as "producao" | "homologacao")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger
                  value="producao"
                  className="text-xs gap-1.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <IconCloud className="h-3 w-3" />
                  Produção
                </TabsTrigger>
                <TabsTrigger
                  value="homologacao"
                  className="text-xs gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <IconFlask className="h-3 w-3" />
                  Homologação
                </TabsTrigger>
              </TabsList>

              <TabsContent value="producao" className="mt-4">
                <div className="rounded-md border-l-2 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 p-3">
                  <NfeConfigFields form={form} prefix="Producao" showInutilizacao={false} />
                </div>
              </TabsContent>

              <TabsContent value="homologacao" className="mt-4">
                <div className="rounded-md border-l-2 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 p-3">
                  <NfeConfigFields form={form} prefix="Homologacao" showInutilizacao={false} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-3 border-t">
              <Button
                type="button"
                onClick={onSubmitConfig}
                disabled={loading}
                size="sm"
                className={activeTabConfig === "producao"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {loading ? (
                  <>
                    <IconLoader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="mr-1.5 h-3.5 w-3.5" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inutilização */}
        <Card className={activeTabInutilizacao === "producao" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-orange-500"}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Inutilizar Numeração</h3>
                {habilitarHomologacao === (activeTabInutilizacao === "homologacao") && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Ambiente Ativo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {activeTabInutilizacao === "producao" ? "Produção" : "Homologação"}
                </span>
                <Switch
                  checked={activeTabInutilizacao === "homologacao"}
                  onCheckedChange={(checked) => setActiveTabInutilizacao(checked ? "homologacao" : "producao")}
                />
              </div>
            </div>

            <Tabs value={activeTabInutilizacao} onValueChange={(value) => setActiveTabInutilizacao(value as "producao" | "homologacao")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger
                  value="producao"
                  className="text-xs gap-1.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <IconCloud className="h-3 w-3" />
                  Produção
                </TabsTrigger>
                <TabsTrigger
                  value="homologacao"
                  className="text-xs gap-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <IconFlask className="h-3 w-3" />
                  Homologação
                </TabsTrigger>
              </TabsList>

              <TabsContent value="producao" className="mt-4">
                <div className="rounded-md border-l-2 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 p-3">
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-green-700 dark:text-green-400">Inutilizar Numeração</h4>
                    <NfeInutilizacaoFields form={form} prefix="Producao" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="homologacao" className="mt-4">
                <div className="rounded-md border-l-2 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 p-3">
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-orange-700 dark:text-orange-400">Inutilizar Numeração</h4>
                    <NfeInutilizacaoFields form={form} prefix="Homologacao" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-3 border-t">
              <Button
                type="button"
                onClick={onSubmitInutilizacao}
                disabled={loadingInutilizacao}
                size="sm"
                className={activeTabInutilizacao === "producao"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {loadingInutilizacao ? (
                  <>
                    <IconLoader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="mr-1.5 h-3.5 w-3.5" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
