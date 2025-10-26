"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StaticCombobox, AMBIENTE_NFE_OPTIONS } from "@/components/shared/combobox/static-combobox"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconReceipt, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"

const numeracaoNfeSchema = z.object({
  ambienteNfe: z.number().min(1).max(2),
  serieNfe: z.number().min(1).max(999),
  proximoNumeroNfe: z.number().min(1),
})

type NumeracaoNfeFormData = z.infer<typeof numeracaoNfeSchema>

export function NumeracaoNfeForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)

  const form = useForm<NumeracaoNfeFormData>({
    resolver: zodResolver(numeracaoNfeSchema),
    defaultValues: {
      ambienteNfe: 2, // Homologação por padrão
      serieNfe: 1,
      proximoNumeroNfe: 1,
    },
  })

  // Carregar dados do emitente
  useEffect(() => {
    async function loadEmitente() {
      try {
        setLoadingData(true)
        const response = await EmitenteService.getFirst()
        
        if (response.data) {
          setEmitenteId(response.data.id)
          
          // Preencher formulário com dados existentes
          form.reset({
            ambienteNfe: response.data.ambienteNfe || 2,
            serieNfe: response.data.serieNfe || 1,
            proximoNumeroNfe: response.data.proximoNumeroNfe || 1,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar emitente:", error)
        toast.error("Erro ao carregar dados do emitente")
      } finally {
        setLoadingData(false)
      }
    }

    loadEmitente()
  }, [form])

  const onSubmit = async (data: NumeracaoNfeFormData) => {
    if (!emitenteId) {
      toast.error("Emitente não encontrado. Configure os dados da empresa primeiro.")
      return
    }

    try {
      setLoading(true)

      const response = await EmitenteService.update(emitenteId, {
        ambienteNfe: data.ambienteNfe,
        serieNfe: data.serieNfe,
        proximoNumeroNfe: data.proximoNumeroNfe,
      })

      if (response.success) {
        toast.success("Configurações de numeração salvas com sucesso!")
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
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!emitenteId) {
    return (
      <Alert variant="destructive">
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Emitente não configurado</AlertTitle>
        <AlertDescription>
          Configure os dados da empresa em{" "}
          <a href="/configuracoes/geral/emitente" className="underline font-medium">
            Configurações &gt; Geral &gt; Emitente
          </a>
          {" "}antes de configurar a numeração de NFe.
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
              Você está configurando o ambiente de <strong>PRODUÇÃO</strong>. 
              As notas emitidas terão validade fiscal. Use apenas quando estiver pronto para emitir notas reais.
            </AlertDescription>
          </Alert>
        )}

        {ambienteAtual === 2 && (
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertTitle>Ambiente de Homologação</AlertTitle>
            <AlertDescription>
              Você está no ambiente de <strong>HOMOLOGAÇÃO</strong>. 
              Use este ambiente para testes. As notas emitidas não têm validade fiscal.
            </AlertDescription>
          </Alert>
        )}

        {/* Card de Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconReceipt className="h-5 w-5" />
              Configurações de NFe
            </CardTitle>
            <CardDescription>
              Defina o ambiente, série e numeração das Notas Fiscais Eletrônicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ambiente NFe */}
              <FormField
                control={form.control}
                name="ambienteNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente NFe *</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={AMBIENTE_NFE_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione o ambiente"
                      />
                    </FormControl>
                    <FormDescription>
                      Use Homologação para testes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Série NFe */}
              <FormField
                control={form.control}
                name="serieNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série NFe *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={999}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Série padrão das NFes (1-999)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Próximo Número NFe */}
              <FormField
                control={form.control}
                name="proximoNumeroNfe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Número NFe *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Próxima numeração a ser usada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Informações Adicionais */}
            <Alert>
              <IconAlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>A série identifica diferentes pontos de emissão ou tipos de operação</li>
                  <li>O próximo número é incrementado automaticamente a cada emissão</li>
                  <li>Não altere o próximo número sem necessidade para evitar problemas de sequência</li>
                  <li>Mudanças no ambiente (Produção/Homologação) podem exigir numeração separada</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
          >
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

