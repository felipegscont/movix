"use client"

import { useState, useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IconArrowLeft, IconArrowRight, IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react"
import { usePedidoForm } from "@/hooks/vendas/use-pedido-form"
import { PedidoStepCabecalho } from "./steps/pedido-step-cabecalho"
import { PedidoStepItens } from "./steps/pedido-step-itens"
import { PedidoStepTotais } from "./steps/pedido-step-totais"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"
import { WizardProgressBar } from "@/components/shared/wizard-progress-bar"

interface PedidoWizardProps {
  pedidoId?: string
  onSuccess?: () => void
}

const STEPS = [
  { id: 1, name: "Cabeçalho", description: "Dados gerais do pedido" },
  { id: 2, name: "Itens", description: "Produtos e serviços" },
  { id: 3, name: "Totais", description: "Valores e observações" },
]

export function PedidoWizard({ pedidoId, onSuccess }: PedidoWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const {
    form,
    loading,
    loadingPedido,
    proximoNumero,
    handleSubmit,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateTotals,
  } = usePedidoForm({ pedidoId, onSuccess })

  // Recalcular totais quando valores mudarem
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'valorDesconto' || name === 'valorFrete' || name === 'valorOutros' || name === 'itens') {
        const totals = calculateTotals()
        form.setValue('subtotal', totals.subtotal, { shouldValidate: false })
        form.setValue('valorTotal', totals.valorTotal, { shouldValidate: false })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, calculateTotals])

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: string[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ['clienteId', 'dataEmissao']
        break
      case 2:
        fieldsToValidate = ['itens']
        break
      case 3:
        fieldsToValidate = ['valorDesconto', 'valorFrete', 'valorOutros']
        break
    }

    const result = await form.trigger(fieldsToValidate as any)
    return result
  }

  const handleNext = async (e?: React.MouseEvent) => {
    // Prevenir propagação do evento para evitar submit acidental
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const isValid = await validateStep(currentStep)

    if (!isValid) {
      return
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStepClick = async (step: number) => {
    if (step < currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Só permitir submit se estiver no último step
    if (currentStep === STEPS.length) {
      handleSubmit(e)
    }
  }

  const totals = calculateTotals()

  if (loadingPedido) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de Progresso Visual - Compacta */}
      <WizardProgressBar
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        form={form}
        totals={totals}
        itemsCount={form.watch('itens')?.length || 0}
      />

      {/* Formulário */}
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Step 1: Cabeçalho */}
          {currentStep === 1 && (
            <PedidoStepCabecalho form={form} proximoNumero={proximoNumero} />
          )}

          {/* Step 2: Itens */}
          {currentStep === 2 && (
            <PedidoStepItens
              form={form}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}

          {/* Step 3: Totais */}
          {currentStep === 3 && (
            <PedidoStepTotais
              form={form}
              subtotal={totals.subtotal}
              valorTotal={totals.valorTotal}
            />
          )}

          {/* Botões de navegação - Compactos */}
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                >
                  <IconArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Anterior
                </Button>

                <div className="text-xs text-muted-foreground">
                  {currentStep} / {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Próximo
                    <IconArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading}
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Erros do formulário - Compacto */}
          {Object.keys(form.formState.errors).length > 0 && (
            <Alert variant="destructive" className="py-2">
              <IconAlertCircle className="h-3.5 w-3.5" />
              <AlertDescription className="text-xs">
                Corrija os erros no formulário antes de continuar
              </AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  )
}

