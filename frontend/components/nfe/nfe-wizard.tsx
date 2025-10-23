"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { NfeWizardBreadcrumb } from "./nfe-wizard-breadcrumb"

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
    // Validar antes de avançar
    if (!canAdvance()) {
      const messages = getValidationMessages()
      if (messages.length > 0) {
        toast.error(messages[0])
      }
      return
    }

    if (!isLastStep) {
      const nextStepKey = WIZARD_STEPS[currentStepIndex + 1].key

      // Marcar step atual como completo
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      // Ir para próximo step
      setCurrentStep(nextStepKey)

      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      const previousStepKey = WIZARD_STEPS[currentStepIndex - 1].key
      setCurrentStep(previousStepKey)

      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step)

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Watch dos campos para validação em tempo real
  const clienteId = form.watch('clienteId')
  const naturezaOperacao = form.watch('naturezaOperacao')
  const itens = form.watch('itens')

  // Force re-render quando os campos mudarem
  const [, forceUpdate] = useState({})
  useEffect(() => {
    forceUpdate({})
  }, [clienteId, naturezaOperacao, itens])

  // Validação básica antes de avançar
  const canAdvance = () => {
    switch (currentStep) {
      case 'geral':
        return !!clienteId && !!naturezaOperacao
      case 'itens':
        return itens && itens.length > 0
      case 'cobranca':
        return true // Cobrança é opcional
      case 'revisao':
        // No step de revisão, sempre pode salvar se chegou até aqui
        return !!clienteId && !!naturezaOperacao && itens?.length > 0
      default:
        return false
    }
  }

  // Mensagens de validação
  const getValidationMessages = () => {
    const messages: string[] = []

    switch (currentStep) {
      case 'geral':
        if (!clienteId) messages.push('Selecione um cliente')
        if (!naturezaOperacao) messages.push('Informe a natureza da operação')
        break
      case 'itens':
        if (!itens || itens.length === 0) {
          messages.push('Adicione pelo menos um item')
        }
        break
    }

    return messages
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
            emitenteRegime={emitente?.regimeTributario}
          />
        )
      case 'cobranca':
        return <NfeStepCobranca form={form} />
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

        {/* Breadcrumb de navegação */}
        <Card>
          <CardContent className="pt-6">
            <NfeWizardBreadcrumb
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          </CardContent>
        </Card>

        {/* Conteúdo do step atual */}
        <div>
          {renderCurrentStep()}
        </div>

        {/* Navegação inferior */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {/* Botão Anterior */}
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep || loading}
                size="lg"
              >
                <IconChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {/* Indicador de progresso */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Passo {currentStepIndex + 1} de {WIZARD_STEPS.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {WIZARD_STEPS[currentStepIndex].label}
                </div>
              </div>

              {/* Botão Próximo/Salvar */}
              <div className="flex gap-2">
                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={!canAdvance() || loading}
                    size="lg"
                    className="min-w-[180px]"
                  >
                    {loading ? (
                      <>
                        <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="h-4 w-4 mr-2" />
                        {nfeId ? 'Atualizar NFe' : 'Criar NFe'}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canAdvance() || loading}
                    size="lg"
                    className="min-w-[150px]"
                  >
                    Próximo
                    <IconChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Mensagem de validação */}
            {!canAdvance() && !isLastStep && (
              <div className="mt-4 text-center">
                <p className="text-sm text-amber-600">
                  {getValidationMessages()[0]}
                </p>
              </div>
            )}

            {/* Debug info (remover depois) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Cliente: {clienteId || 'não selecionado'} |
                Natureza: {naturezaOperacao || 'não preenchida'} |
                Pode avançar: {canAdvance() ? 'Sim' : 'Não'}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
