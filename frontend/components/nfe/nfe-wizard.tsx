"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconChevronLeft, IconChevronRight, IconDeviceFloppy, IconCheck, IconAlertCircle, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useNfeForm } from "@/hooks/nfe/use-nfe-form"
import { NfeStepGeral } from "./steps/nfe-step-geral"
import { NfeStepItens } from "./steps/nfe-step-itens"
import { NfeStepCobranca } from "./steps/nfe-step-cobranca"
import { NfeStepRevisao } from "./steps/nfe-step-revisao"
import { WizardProgressBar } from "@/components/shared/wizard-progress-bar"

interface NfeWizardProps {
  nfeId?: string
  pedidoId?: string
  onSuccess?: () => void
}

type WizardStep = 'geral' | 'itens' | 'cobranca' | 'revisao'

const WIZARD_STEPS: { key: WizardStep; label: string; description: string }[] = [
  { key: 'geral', label: 'Dados Gerais', description: 'Informações básicas da NFe' },
  { key: 'itens', label: 'Itens', description: 'Produtos e serviços' },
  { key: 'cobranca', label: 'Cobrança', description: 'Duplicatas e pagamentos' },
  { key: 'revisao', label: 'Revisão', description: 'Conferir dados antes de salvar' }
]

export function NfeWizard({ nfeId, pedidoId, onSuccess }: NfeWizardProps) {
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
    alertDialog,
  } = useNfeForm({ nfeId, pedidoId, onSuccess })

  const totals = calculateTotals()

  // Navegação entre steps
  const currentStepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1

  const goToNextStep = (e?: React.MouseEvent) => {
    // Prevenir propagação do evento para evitar submit acidental
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

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

  const goToStep = (step: WizardStep | string) => {
    const stepKey = typeof step === 'string' ? step : step
    setCurrentStep(stepKey as WizardStep)

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Só permitir submit se estiver no último step
    if (currentStep === 'revisao') {
      handleSubmit(e)
    }
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
    <>
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Barra de Progresso Visual - Compacta */}
        <WizardProgressBar
          steps={WIZARD_STEPS.map(s => ({
            key: s.key,
            label: s.label,
            description: s.description
          }))}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
          form={form}
          totals={totals}
          itemsCount={form.watch('itens')?.length || 0}
        />

        {/* Conteúdo do step atual */}
        <div>
          {renderCurrentStep()}
        </div>

        {/* Navegação inferior - Compacta */}
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Botão Anterior */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={isFirstStep || loading}
              >
                <IconChevronLeft className="h-3.5 w-3.5 mr-1.5" />
                Anterior
              </Button>

              {/* Indicador de progresso */}
              <div className="text-xs text-muted-foreground">
                {currentStepIndex + 1} / {WIZARD_STEPS.length}
              </div>

              {/* Botão Próximo/Salvar */}
              {isLastStep ? (
                <Button
                  type="submit"
                  size="sm"
                  disabled={!canAdvance() || loading}
                >
                  {loading ? (
                    <>
                      <IconLoader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy className="h-3.5 w-3.5 mr-1.5" />
                      {nfeId ? 'Atualizar' : 'Criar NFe'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={goToNextStep}
                  disabled={!canAdvance() || loading}
                >
                  Próximo
                  <IconChevronRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              )}
            </div>

            {/* Mensagem de validação - Compacta */}
            {!canAdvance() && !isLastStep && (
              <div className="mt-2 text-center">
                <p className="text-xs text-amber-600">
                  {getValidationMessages()[0]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>

    {/* Alert Dialog para erros de validação */}
    <AlertDialog open={alertDialog.open} onOpenChange={alertDialog.onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <IconAlertCircle className="h-5 w-5" />
            {alertDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {alertDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {alertDialog.errors.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Erros encontrados:</div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground max-h-[400px] overflow-y-auto">
              {alertDialog.errors.map((error, index) => (
                <li key={index} className="break-words">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogAction onClick={alertDialog.onClose}>
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}
