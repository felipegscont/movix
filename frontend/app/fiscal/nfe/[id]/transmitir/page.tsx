"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconSend, IconX, IconLoader2, IconCircleCheck, IconAlertCircle } from "@tabler/icons-react"
import { NfeBreadcrumb } from "@/components/nfe/nfe-breadcrumb"
import { useNfeWorkflow } from "@/hooks/nfe/use-nfe-workflow"
import { NfeService, Nfe } from "@/lib/services/nfe.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function TransmitirNfePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const workflow = useNfeWorkflow(params.id)
  const [nfe, setNfe] = useState<Nfe | null>(null)
  const [loading, setLoading] = useState(true)
  const [transmitting, setTransmitting] = useState(false)
  const [transmissionStatus, setTransmissionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [transmissionMessage, setTransmissionMessage] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    loadNfe()
  }, [params.id])

  const loadNfe = async () => {
    try {
      setLoading(true)
      const data = await NfeService.getById(params.id)
      setNfe(data)
      
      workflow.updateNfeInfo(data.id, data.numero, data.serie)
      workflow.setCanGoPrevious(true)
      workflow.setCanGoNext(false)
    } catch (error) {
      console.error("Erro ao carregar NFe:", error)
      toast.error("Erro ao carregar NFe")
      router.push("/nfes")
    } finally {
      setLoading(false)
    }
  }

  const handleTransmitir = async () => {
    if (!nfe) return

    try {
      setTransmitting(true)
      setTransmissionStatus('processing')
      setProgress(0)

      // Simular progresso
      setTransmissionMessage('Validando dados da NFe...')
      setProgress(20)
      await new Promise(resolve => setTimeout(resolve, 500))

      setTransmissionMessage('Gerando XML...')
      setProgress(40)
      await new Promise(resolve => setTimeout(resolve, 500))

      setTransmissionMessage('Assinando digitalmente...')
      setProgress(60)
      await new Promise(resolve => setTimeout(resolve, 500))

      setTransmissionMessage('Enviando para SEFAZ...')
      setProgress(80)

      // Transmitir NFe
      await NfeService.transmitir(params.id)

      setProgress(100)
      setTransmissionStatus('success')
      setTransmissionMessage('NFe autorizada com sucesso!')

      toast.success("NFe transmitida e autorizada!")

      // Aguardar 2 segundos e redirecionar
      setTimeout(() => {
        router.push(`/nfes/${params.id}`)
      }, 2000)
    } catch (error: any) {
      setTransmissionStatus('error')
      setTransmissionMessage(error.message || 'Erro ao transmitir NFe')
      toast.error(error.message || "Erro ao transmitir NFe")
    } finally {
      setTransmitting(false)
    }
  }

  const handleVoltar = () => {
    if (transmitting) {
      toast.error("Aguarde a transmissão finalizar")
      return
    }
    workflow.goToPrevious()
  }

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!nfe) {
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              {/* Breadcrumb */}
              <NfeBreadcrumb
                nfeNumero={nfe.numero.toString()}
                nfeSerie={nfe.serie}
                currentStep="transmissao"
              />

              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Transmitir NFe</h1>
                <p className="text-muted-foreground">
                  Enviar NFe para autorização da SEFAZ
                </p>
              </div>

              {/* Card de Transmissão */}
              <Card>
                <CardHeader>
                  <CardTitle>Transmissão para SEFAZ</CardTitle>
                  <CardDescription>
                    A NFe será enviada para autorização da Secretaria da Fazenda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informações da NFe */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Número</p>
                      <p className="text-lg font-semibold">{nfe.numero.toString().padStart(6, '0')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Série</p>
                      <p className="text-lg font-semibold">{nfe.serie}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                      <p className="text-lg font-semibold">{nfe.cliente?.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-lg font-semibold">
                        {nfe.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  {/* Status da Transmissão */}
                  {transmissionStatus === 'processing' && (
                    <div className="space-y-4">
                      <Alert>
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>Transmitindo...</AlertTitle>
                        <AlertDescription>{transmissionMessage}</AlertDescription>
                      </Alert>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  {transmissionStatus === 'success' && (
                    <Alert>
                      <IconCircleCheck className="h-4 w-4 text-green-600" />
                      <AlertTitle>Sucesso!</AlertTitle>
                      <AlertDescription>{transmissionMessage}</AlertDescription>
                    </Alert>
                  )}

                  {transmissionStatus === 'error' && (
                    <Alert variant="destructive">
                      <IconAlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro na Transmissão</AlertTitle>
                      <AlertDescription>{transmissionMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* Avisos */}
                  {transmissionStatus === 'idle' && (
                    <Alert>
                      <IconAlertCircle className="h-4 w-4" />
                      <AlertTitle>Atenção</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li>Certifique-se de que todos os dados estão corretos</li>
                          <li>Após a autorização, a NFe não poderá ser alterada</li>
                          <li>O processo pode levar alguns segundos</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Botões de Navegação */}
              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVoltar}
                  disabled={transmitting || transmissionStatus === 'success'}
                >
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Revisão
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/nfes")}
                    disabled={transmitting || transmissionStatus === 'success'}
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={handleTransmitir}
                    disabled={transmitting || transmissionStatus === 'success'}
                  >
                    {transmitting && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {!transmitting && <IconSend className="h-4 w-4 mr-2" />}
                    {transmitting ? 'Transmitindo...' : 'Transmitir NFe'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

