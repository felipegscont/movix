"use client"

import { useState, useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { IconArrowLeft, IconArrowRight, IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react"
import { useOrcamentoForm } from "@/hooks/vendas/use-orcamento-form"
import { OrcamentoStepCabecalho } from "./steps/orcamento-step-cabecalho"
import { OrcamentoStepItens } from "./steps/orcamento-step-itens"
import { OrcamentoStepTotais } from "./steps/orcamento-step-totais"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"

interface OrcamentoWizardProps {
  pedidoId?: string
  onSuccess?: () => void
}

const STEPS = [
  { id: 1, name: "Cabeçalho", description: "Dados gerais do orçamento" },
  { id: 2, name: "Itens", description: "Produtos e serviços" },
  { id: 3, name: "Totais", description: "Valores e observações" },
]

export function OrcamentoWizard({ pedidoId, onSuccess }: OrcamentoWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const {
    form,
    loading,
    loadingOrcamento,
    proximoNumero,
    handleSubmit,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateTotals,
  } = useOrcamentoForm({ pedidoId, onSuccess })

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
    } else {
      console.log('⚠️ Submit bloqueado - não está no último step')
    }
  }

  const totals = calculateTotals()

  if (loadingOrcamento) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb de navegação */}
      <Card className="py-3">
        <CardContent className="py-3">
          <Breadcrumb>
            <BreadcrumbList>
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <BreadcrumbItem>
                    {currentStep === step.id ? (
                      <BreadcrumbPage className="font-semibold">
                        {step.name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => handleStepClick(step.id)}
                        className={`cursor-pointer ${
                          completedSteps.includes(step.id) || step.id < currentStep
                            ? 'text-primary hover:text-primary/80'
                            : 'text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {step.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < STEPS.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Resumo rápido */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {STEPS[currentStep - 1].description}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground">
                Itens: <span className="font-semibold text-foreground">{form.watch('itens')?.length || 0}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-muted-foreground">
                Total: <span className="font-semibold text-foreground">
                  {totals.valorTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Step 1: Cabeçalho */}
          {currentStep === 1 && (
            <OrcamentoStepCabecalho form={form} proximoNumero={proximoNumero} />
          )}

          {/* Step 2: Itens */}
          {currentStep === 2 && (
            <OrcamentoStepItens
              form={form}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}

          {/* Step 3: Totais */}
          {currentStep === 3 && (
            <OrcamentoStepTotais
              form={form}
              subtotal={totals.subtotal}
              valorTotal={totals.valorTotal}
            />
          )}

          {/* Botões de navegação */}
          <Card className="py-3">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                >
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                <div className="text-sm text-muted-foreground">
                  Passo {currentStep} de {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Próximo
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="mr-2 h-4 w-4" />
                        Salvar Pedido
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Erros do formulário */}
          {Object.keys(form.formState.errors).length > 0 && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                Corrija os erros no formulário antes de continuar
              </AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  )
}

