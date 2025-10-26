"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react"
import { NfeBreadcrumb } from "@/components/nfe/nfe-breadcrumb"
import { NfeDetails } from "@/components/nfe/nfe-details"
import { useNfeWorkflow } from "@/hooks/nfe/use-nfe-workflow"
import { NfeService, Nfe } from "@/lib/services/nfe.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"

export default function RevisarNfePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const workflow = useNfeWorkflow(params.id)
  const [nfe, setNfe] = useState<Nfe | null>(null)
  const [loading, setLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    loadNfe()
  }, [params.id])

  const loadNfe = async () => {
    try {
      setLoading(true)
      const data = await NfeService.getById(params.id)
      setNfe(data)
      
      workflow.updateNfeInfo(data.id, data.numero, data.serie)
      
      // Validar NFe
      const errors = validateNfe(data)
      setValidationErrors(errors)
      
      // Permitir avançar apenas se não houver erros
      workflow.setCanGoNext(errors.length === 0)
      workflow.setCanGoPrevious(true)
    } catch (error) {
      console.error("Erro ao carregar NFe:", error)
      toast.error("Erro ao carregar NFe")
      router.push("/nfes")
    } finally {
      setLoading(false)
    }
  }

  const validateNfe = (nfe: Nfe): string[] => {
    const errors: string[] = []

    // Validar dados básicos
    if (!nfe.emitenteId) errors.push("Emitente não informado")
    if (!nfe.clienteId) errors.push("Cliente não informado")
    if (!nfe.naturezaOperacao) errors.push("Natureza da operação não informada")

    // Validar itens
    if (!nfe.itens || nfe.itens.length === 0) {
      errors.push("NFe sem itens")
    }

    // Validar totais
    if (nfe.valorTotal <= 0) {
      errors.push("Valor total deve ser maior que zero")
    }

    // Validar duplicatas (se houver)
    if (nfe.duplicatas && nfe.duplicatas.length > 0) {
      const somaDuplicatas = nfe.duplicatas.reduce((sum, dup) => sum + dup.valor, 0)
      if (Math.abs(somaDuplicatas - nfe.valorTotal) > 0.01) {
        errors.push("Soma das duplicatas não confere com o valor total")
      }
    }

    return errors
  }

  const handleVoltar = () => {
    workflow.goToPrevious()
  }

  const handleAvancar = () => {
    if (validationErrors.length > 0) {
      toast.error("Corrija os erros antes de continuar")
      return
    }
    workflow.goToNext()
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
                currentStep="revisao"
              />

              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Revisão da NFe</h1>
                <p className="text-muted-foreground">
                  Confira todos os dados antes de transmitir
                </p>
              </div>

              {/* Alertas de Validação */}
              {validationErrors.length > 0 ? (
                <Alert variant="destructive">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertTitle>Erros encontrados</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <IconCircleCheck className="h-4 w-4" />
                  <AlertTitle>NFe válida</AlertTitle>
                  <AlertDescription>
                    Todos os dados estão corretos. Você pode prosseguir para a transmissão.
                  </AlertDescription>
                </Alert>
              )}

              {/* Detalhes da NFe */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados da NFe</CardTitle>
                  <CardDescription>
                    Revise cuidadosamente todas as informações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NfeDetails nfeId={params.id} />
                </CardContent>
              </Card>

              {/* Botões de Navegação */}
              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVoltar}
                  disabled={workflow.state.isProcessing}
                >
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Edição
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/nfes")}
                    disabled={workflow.state.isProcessing}
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={handleAvancar}
                    disabled={validationErrors.length > 0 || workflow.state.isProcessing}
                  >
                    Prosseguir para Transmissão
                    <IconArrowRight className="h-4 w-4 ml-2" />
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

