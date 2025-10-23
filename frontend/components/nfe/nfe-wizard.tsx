"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconCheck,
  IconAlertCircle,
  IconLoader2
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useNfeForm } from "@/hooks/nfe/use-nfe-form"

// Importar componentes dos steps
import { NfeStepGeral } from "./steps/nfe-step-geral"
import { NfeStepItens } from "./steps/nfe-step-itens"
import { NfeStepCobranca } from "./steps/nfe-step-cobranca"
import { NfeStepRevisao } from "./steps/nfe-step-revisao"

interface NfeWizardProps {
  nfeId?: string
  onSuccess?: () => void
}

type WizardStep = 'geral' | 'itens' | 'cobranca' | 'revisao'

const WIZARD_STEPS: { key: WizardStep; label: string; description: string }[] = [
  { key: 'geral', label: 'Dados Gerais', description: 'Informações básicas da NFe' },
  { key: 'itens', label: 'Itens', description: 'Produtos e serviços' },
  { key: 'cobranca', label: 'Cobrança', description: 'Duplicatas e pagamentos' },
  { key: 'revisao', label: 'Revisão', description: 'Conferir dados antes de salvar' }
]

export function NfeWizard({ nfeId, onSuccess }: NfeWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>('geral')
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([])

  const {
    form,
    loading,
    loadingNfe,
    loadingEmitente,
    emitente,
    handleSubmit,
    addItem,
    updateItem,
    removeItem,
    calculateTotals,
  } = useNfeForm({ nfeId, onSuccess })

  const totals = calculateTotals()

  // Navegação entre steps
  const currentStepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1

  const goToNextStep = () => {
    if (!isLastStep) {
      const nextStepKey = WIZARD_STEPS[currentStepIndex + 1].key
      setCurrentStep(nextStepKey)
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      const previousStepKey = WIZARD_STEPS[currentStepIndex - 1].key
      setCurrentStep(previousStepKey)
    }
  }

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step)
  }

  // Validação básica antes de avançar
  const canAdvance = () => {
    const formValues = form.getValues()

    switch (currentStep) {
      case 'geral':
        return !!formValues.clienteId && !!formValues.naturezaOperacao
      case 'itens':
        return formValues.itens && formValues.itens.length > 0
      case 'cobranca':
        return true // Cobrança é opcional
      case 'revisao':
        return true
      default:
        return false
    }
  }

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'geral':
        return <NfeStepGeral form={form} emitente={emitente} />
      case 'itens':
        return (
          <NfeStepItens
            form={form}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        )
      case 'cobranca':
        return <NfeStepCobranca form={form} />
      case 'revisao':
        return <NfeStepRevisao form={form} emitente={emitente} totals={totals} />
      default:
        return null
    }
  }

  if (loadingNfe || loadingEmitente) {
    return (
      <div className="flex items-center justify-center p-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  {totals.valorTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {form.watch('itens')?.length || 0} {form.watch('itens')?.length === 1 ? 'item' : 'itens'}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navegação do wizard */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={currentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {WIZARD_STEPS.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.key)
                  const isCurrent = currentStep === step.key

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
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep}
              >
                <IconChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={!canAdvance() || loading}
                  >
                    {loading ? (
                      <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <IconDeviceFloppy className="h-4 w-4 mr-2" />
                    )}
                    {nfeId ? 'Atualizar NFe' : 'Criar NFe'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
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
      </form>
    </Form>
  )
}
