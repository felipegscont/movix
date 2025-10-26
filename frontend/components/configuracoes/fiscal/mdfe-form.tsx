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
import { ConfiguracaoMdfeService } from "@/lib/services/configuracao-mdfe.service"
import { InutilizacaoMdfeService } from "@/lib/services/inutilizacao-mdfe.service"
import { NfeConfigFields, NfeInutilizacaoFields } from "./mdfe-form-tabs"

// Schema para Configurações NFe
const nfeConfigSchema = z.object({
  ambienteAtivoConfig: z.boolean(), // true = Homologação, false = Produção
  serieProducao: z.number().min(1).max(999),
  proximoNumeroProducao: z.number().min(1),
  tipoFreteProducao: z.number().optional(),
  indicadorPresencaProducao: z.number().optional(),
  orientacaoImpressaoProducao: z.number().optional(),
  ieSubstitutoProducao: z.string().optional(),
  observacoesProducao: z.string().optional(),
  documentosAutorizadosProducao: z.string().optional(),
  serieHomologacao: z.number().min(1).max(999),
  proximoNumeroHomologacao: z.number().min(1),
  tipoFreteHomologacao: z.number().optional(),
  indicadorPresencaHomologacao: z.number().optional(),
  orientacaoImpressaoHomologacao: z.number().optional(),
  ieSubstitutoHomologacao: z.string().optional(),
  observacoesHomologacao: z.string().optional(),
  documentosAutorizadosHomologacao: z.string().optional(),
  modeloMdfe: z.enum(["4.00"]).optional(),
})

// Schema para Inutilização NFe
const nfeInutilizacaoSchema = z.object({
  ambienteAtivoInutilizacao: z.boolean(), // true = Homologação, false = Produção
  numeroInicialInutilizarProducao: z.number().optional(),
  numeroFinalInutilizarProducao: z.number().optional(),
  serieInutilizarProducao: z.number().optional(),
  anoInutilizarProducao: z.number().min(2000, "Ano mínimo: 2000").max(2100, "Ano máximo: 2100").optional(),
  justificativaInutilizarProducao: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres").optional(),
  numeroInicialInutilizarHomologacao: z.number().optional(),
  numeroFinalInutilizarHomologacao: z.number().optional(),
  serieInutilizarHomologacao: z.number().optional(),
  anoInutilizarHomologacao: z.number().min(2000, "Ano mínimo: 2000").max(2100, "Ano máximo: 2100").optional(),
  justificativaInutilizarHomologacao: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres").optional(),
})

// Schema combinado
const nfeSchema = nfeConfigSchema.merge(nfeInutilizacaoSchema)

type MdfeFormData = z.infer<typeof nfeSchema>

export function MdfeForm() {
  const [loading, setLoading] = useState(false)
  const [loadingInutilizacao, setLoadingInutilizacao] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)
  const [activeTabConfig, setActiveTabConfig] = useState<"producao" | "homologacao">("homologacao")
  const [activeTabInutilizacao, setActiveTabInutilizacao] = useState<"producao" | "homologacao">("homologacao")

  const form = useForm<MdfeFormData>({
    resolver: zodResolver(nfeSchema),
    defaultValues: {
      ambienteAtivoConfig: false, // Produção por padrão
      ambienteAtivoInutilizacao: false, // Produção por padrão
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
      modeloMdfe: "4.00",
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true)
        const emitente = await EmitenteService.getEmitenteAtivo()
        if (!emitente) return toast.error("Nenhum emitente encontrado")

        setEmitenteId(emitente.id)

        // Buscar configurações NFe
        const responseConfig = await ConfiguracaoMdfeService.getByEmitente(emitente.id)
        // Buscar inutilizações NFe
        const responseInutilizacao = await InutilizacaoMdfeService.getByEmitente(emitente.id)

        const config = responseConfig.success && responseConfig.data ? responseConfig.data : null
        const inutilizacao = responseInutilizacao.success && responseInutilizacao.data ? responseInutilizacao.data : null

        form.reset({
          // Ambientes Ativos
          ambienteAtivoConfig: config?.ambienteAtivo === 2,
          ambienteAtivoInutilizacao: config?.ambienteAtivo === 2, // Inicialmente igual
          // Configurações
          serieProducao: config?.serieProducao || 1,
          proximoNumeroProducao: config?.proximoNumeroProducao || 1,
          tipoFreteProducao: config?.tipoFreteProducao || 1,
          indicadorPresencaProducao: config?.indicadorPresencaProducao || 2,
          orientacaoImpressaoProducao: config?.orientacaoImpressaoProducao || 1,
          ieSubstitutoProducao: config?.ieSubstitutoProducao || "",
          observacoesProducao: config?.observacoesProducao || "",
          documentosAutorizadosProducao: config?.documentosAutorizadosProducao || "",
          serieHomologacao: config?.serieHomologacao || 1,
          proximoNumeroHomologacao: config?.proximoNumeroHomologacao || 1,
          tipoFreteHomologacao: config?.tipoFreteHomologacao || 1,
          indicadorPresencaHomologacao: config?.indicadorPresencaHomologacao || 2,
          orientacaoImpressaoHomologacao: config?.orientacaoImpressaoHomologacao || 1,
          ieSubstitutoHomologacao: config?.ieSubstitutoHomologacao || "",
          observacoesHomologacao: config?.observacoesHomologacao || "",
          documentosAutorizadosHomologacao: config?.documentosAutorizadosHomologacao || "",
          modeloMdfe: config?.modeloMdfe || "4.00",
          // Inutilizações
          numeroInicialInutilizarProducao: inutilizacao?.numeroInicialInutilizarProducao,
          numeroFinalInutilizarProducao: inutilizacao?.numeroFinalInutilizarProducao,
          serieInutilizarProducao: inutilizacao?.serieInutilizarProducao,
          anoInutilizarProducao: inutilizacao?.anoInutilizarProducao,
          justificativaInutilizarProducao: inutilizacao?.justificativaInutilizarProducao || "",
          numeroInicialInutilizarHomologacao: inutilizacao?.numeroInicialInutilizarHomologacao,
          numeroFinalInutilizarHomologacao: inutilizacao?.numeroFinalInutilizarHomologacao,
          serieInutilizarHomologacao: inutilizacao?.serieInutilizarHomologacao,
          anoInutilizarHomologacao: inutilizacao?.anoInutilizarHomologacao,
          justificativaInutilizarHomologacao: inutilizacao?.justificativaInutilizarHomologacao || "",
        })
      } catch (error) {
        toast.error("Erro ao carregar dados")
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [form])

  // Observar ambientes ativos independentes
  const ambienteAtivoConfig = form.watch("ambienteAtivoConfig")
  const ambienteAtivoInutilizacao = form.watch("ambienteAtivoInutilizacao")

  // Salvar apenas configurações de NFe
  const onSubmitConfig = async () => {
    if (!emitenteId) return toast.error("Configure os dados da empresa primeiro")

    const data = form.getValues()
    const ambiente = activeTabConfig === "homologacao" ? "Homologacao" : "Producao"

    try {
      setLoading(true)

      const payload: any = {
        // Salvar ambiente ativo (do switch de Configurações)
        ambienteAtivo: data.ambienteAtivoConfig ? 2 : 1,
        // Salvar modelo NFe
        modeloMdfe: data.modeloMdfe || "4.00",
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

      const response = await ConfiguracaoMdfeService.upsert(emitenteId, payload)
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

      // Adicionar campos de inutilização do ambiente sendo editado
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

      const response = await InutilizacaoMdfeService.upsert(emitenteId, payload)
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
        {/* Configurações */}
        <Card className={activeTabConfig === "producao" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-orange-500"}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex flex-col gap-3 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">Configurações de NFe</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure série, numeração e parâmetros para emissão de notas fiscais
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium">
                    Habilitar emissões em ambiente de homologação?
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ambienteAtivoConfig
                      ? "✓ Sim - Notas serão emitidas em homologação (testes)"
                      : "✗ Não - Notas serão emitidas em produção (válidas)"}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="ambienteAtivoConfig"
                  render={({ field }) => (
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
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
            <div className="flex flex-col gap-3 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">Inutilizar Numeração</h3>
                  <p className="text-xs text-muted-foreground">
                    Inutilize faixas de numeração que não serão utilizadas
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium">
                    Habilitar inutilizações em ambiente de homologação?
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ambienteAtivoInutilizacao
                      ? "✓ Sim - Inutilizações serão feitas em homologação (testes)"
                      : "✗ Não - Inutilizações serão feitas em produção (válidas)"}
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="ambienteAtivoInutilizacao"
                  render={({ field }) => (
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
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
