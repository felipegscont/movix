"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconDeviceFloppy, 
  IconCheck,
  IconAlertCircle,
  IconLoader2
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useNfeWizard } from "@/hooks/nfe/use-nfe-wizard"
import { NfeService } from "@/lib/services/nfe.service"
import { NfeWizardProps, WizardStep } from "./types"

// Importar componentes dos steps (serão criados depois)
import { NfeStepGeral } from "./steps/nfe-step-geral"
import { NfeStepItens } from "./steps/nfe-step-itens"
import { NfeStepCobranca } from "./steps/nfe-step-cobranca"
import { NfeStepRevisao } from "./steps/nfe-step-revisao"

export function NfeWizard({ nfeId, onSuccess }: NfeWizardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    formData,
    wizardState,
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    calculateTotals,
    canAdvance,
    canGoBack,
    WIZARD_STEPS
  } = useNfeWizard({
    onStepChange: (step) => {
      console.log('Step changed to:', step)
    }
  })

  const totals = calculateTotals()

  // Submeter formulário
  const handleSubmit = async () => {
    const validation = validateCurrentStep()
    
    if (!validation.isValid) {
      toast.error('Corrija os erros antes de salvar')
      return
    }

    try {
      setIsLoading(true)

      // Preparar dados para envio (seguindo o DTO do backend)
      const submitData = {
        // emitenteId será buscado automaticamente no backend
        clienteId: formData.clienteId,
        serie: formData.serie || 1,
        naturezaOperacao: formData.naturezaOperacao,
        tipoOperacao: formData.tipoOperacao,
        consumidorFinal: formData.consumidorFinal,
        presencaComprador: formData.presencaComprador,
        dataEmissao: formData.dataEmissao,
        dataSaida: formData.dataSaida,
        modalidadeFrete: formData.modalidadeFrete,
        valorFrete: formData.valorFrete,
        valorSeguro: formData.valorSeguro,
        valorDesconto: formData.valorDesconto,
        valorOutros: formData.valorOutros,
        valorICMSDesonerado: formData.valorICMSDesonerado,
        valorFCP: formData.valorFCP,
        valorII: formData.valorII,
        valorOutrasDespesas: formData.valorOutrasDespesas,
        informacoesAdicionais: formData.informacoesAdicionais,
        informacoesFisco: formData.informacoesFisco,

        // Itens - enviar apenas campos necessários
        itens: formData.itens.map((item, index) => ({
          produtoId: item.produtoId,
          numeroItem: index + 1,
          cfopId: item.cfopId,
          quantidadeComercial: item.quantidadeComercial,
          valorUnitario: item.valorUnitario,
          valorDesconto: item.valorDesconto || 0,
          icmsCstId: item.icmsCstId,
          icmsCsosnId: item.icmsCsosnId,
          icmsBaseCalculo: item.icmsBaseCalculo,
          icmsAliquota: item.icmsAliquota,
          icmsValor: item.icmsValor,
          pisCstId: item.pisCstId,
          pisBaseCalculo: item.pisBaseCalculo,
          pisAliquota: item.pisAliquota,
          pisValor: item.pisValor,
          cofinsCstId: item.cofinsCstId,
          cofinsBaseCalculo: item.cofinsBaseCalculo,
          cofinsAliquota: item.cofinsAliquota,
          cofinsValor: item.cofinsValor,
        })),

        duplicatas: formData.duplicatas?.length ? formData.duplicatas : undefined,
        // Remover pagamentos por enquanto até implementar corretamente
        // pagamentos: formData.pagamentos?.length ? formData.pagamentos : undefined,
      }

      if (nfeId) {
        await NfeService.update(nfeId, submitData)
        toast.success("NFe atualizada com sucesso!")
      } else {
        await NfeService.create(submitData)
        toast.success("NFe criada com sucesso!")
      }

      onSuccess?.()
      router.push('/nfes')
    } catch (error: any) {
      console.error('Erro ao salvar NFe:', error)
      toast.error(error.message || "Erro ao salvar NFe")
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar step atual
  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors: wizardState.errors
    }

    switch (wizardState.currentStep) {
      case 'geral':
        return <NfeStepGeral {...stepProps} />
      case 'itens':
        return <NfeStepItens {...stepProps} />
      case 'cobranca':
        return <NfeStepCobranca {...stepProps} />
      case 'revisao':
        return <NfeStepRevisao {...stepProps} totals={totals} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {nfeId ? 'Editar NFe' : 'Nova NFe'}
              </CardTitle>
              <CardDescription>
                Preencha os dados da nota fiscal eletrônica
              </CardDescription>
            </div>
            
            {/* Resumo rápido */}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">
                {totals.total.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {totals.totalItens} {totals.totalItens === 1 ? 'item' : 'itens'}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navegação do wizard */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={wizardState.currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {WIZARD_STEPS.map((step, index) => {
                const isCompleted = wizardState.completedSteps.includes(step.key)
                const isCurrent = wizardState.currentStep === step.key
                const hasErrors = Object.keys(wizardState.errors).some(key => 
                  key.startsWith(step.key) || 
                  (step.key === 'itens' && key.startsWith('item_')) ||
                  (step.key === 'cobranca' && key.startsWith('duplicata_'))
                )

                return (
                  <TabsTrigger
                    key={step.key}
                    value={step.key}
                    onClick={() => goToStep(step.key)}
                    className="relative"
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted && !isCurrent && (
                        <IconCheck className="h-4 w-4 text-green-600" />
                      )}
                      {hasErrors && (
                        <IconAlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span>{step.label}</span>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Conteúdo do step atual */}
            <div className="mt-6">
              {renderCurrentStep()}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navegação inferior */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={!canGoBack()}
            >
              <IconChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {Object.keys(wizardState.errors).length > 0 && (
                <Alert className="w-auto">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Corrija os erros antes de continuar
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-2">
              {wizardState.currentStep === 'revisao' ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!wizardState.canProceed || isLoading}
                >
                  {isLoading ? (
                    <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <IconDeviceFloppy className="h-4 w-4 mr-2" />
                  )}
                  {nfeId ? 'Atualizar NFe' : 'Criar NFe'}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canAdvance()}
                >
                  Próximo
                  <IconChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
