"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconCheck } from "@tabler/icons-react"
import { UseFormReturn } from "react-hook-form"

export interface WizardStep {
  id?: number
  key?: string
  name?: string
  label?: string
  description: string
}

interface WizardProgressBarProps {
  steps: WizardStep[]
  currentStep: number | string
  completedSteps: (number | string)[]
  onStepClick: (stepId: number | string) => void
  form: UseFormReturn<any>
  totals: {
    subtotal: number
    valorTotal: number
  }
  itemsCount: number
}

export function WizardProgressBar({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  form,
  totals,
  itemsCount,
}: WizardProgressBarProps) {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        {/* Barra de Steps com Setas */}
        <div className="w-full flex items-center gap-1 mb-4">
          {steps.map((step, index) => {
            const stepId = step.id ?? step.key ?? index + 1
            const stepLabel = step.name ?? step.label ?? `Step ${index + 1}`
            const currentStepIndex = steps.findIndex(s => (s.id ?? s.key) === currentStep)
            const stepIndex = index

            const isActive = stepIndex <= currentStepIndex
            const isCompleted = stepIndex < currentStepIndex || completedSteps.includes(stepId)
            const isCurrent = stepId === currentStep
            
            return (
              <div key={stepId} className="flex-1 relative">
                {/* Faixa do Step */}
                <button
                  type="button"
                  onClick={() => onStepClick(stepId)}
                  disabled={!isActive && !isCompleted}
                  className={`
                    w-full h-14 flex items-center justify-center gap-2 font-semibold text-sm
                    rounded-md transition-all duration-300 relative z-10
                    ${isCurrent ? 'bg-primary text-primary-foreground shadow-lg scale-105' : ''}
                    ${isCompleted && !isCurrent ? 'bg-primary/80 text-primary-foreground' : ''}
                    ${!isActive ? 'bg-muted text-muted-foreground' : ''}
                    ${!isActive && !isCompleted
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105 hover:shadow-md'}
                  `}
                >
                  {/* Ícone/Número */}
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${isCurrent ? 'bg-primary-foreground text-primary' : ''}
                    ${isCompleted && !isCurrent ? 'bg-primary-foreground/90 text-primary' : ''}
                    ${!isActive ? 'bg-muted-foreground/20 text-muted-foreground' : ''}
                  `}>
                    {isCompleted && !isCurrent ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Label */}
                  <span className="hidden sm:inline">{stepLabel}</span>
                  <span className="sm:hidden">{stepLabel.split(' ')[0]}</span>
                </button>

                {/* Seta entre steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-0 right-[-4px] w-0 h-0 z-20 pointer-events-none">
                    <div
                      className={`
                        w-0 h-0 transition-all duration-300
                        border-t-[28px] border-b-[28px] border-l-[8px]
                        ${isActive 
                          ? isCurrent 
                            ? 'border-l-primary' 
                            : 'border-l-primary/80'
                          : 'border-l-muted'}
                        border-t-transparent border-b-transparent
                      `}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Resumo rápido */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {steps[steps.findIndex(s => (s.id ?? s.key) === currentStep)]?.description}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground">
              Itens: <span className="font-semibold text-foreground">{itemsCount}</span>
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
  )
}

