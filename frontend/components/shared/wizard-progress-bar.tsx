"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

// ============================================================================
// Types & Interfaces
// ============================================================================

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
  className?: string
}

// ============================================================================
// Main Component - Círculos Padrão
// ============================================================================

export function WizardProgressBar({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  form,
  totals,
  itemsCount,
  className,
}: WizardProgressBarProps) {
  // Calcular índice do step atual
  const currentStepIndex = steps.findIndex((s) => (s.id ?? s.key) === currentStep)

  return (
    <Card className={cn("", className)}>
      <CardContent className="py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Steps - Compactos */}
          <ol className="flex items-center gap-2" role="navigation" aria-label="Progress">
            {steps.map((step, index) => {
              const stepId = step.id ?? step.key ?? index + 1
              const stepLabel = step.name ?? step.label ?? `Step ${index + 1}`

              const isActive = index <= currentStepIndex
              const isCompleted = index < currentStepIndex || completedSteps.includes(stepId)
              const isCurrent = stepId === currentStep
              const isClickable = isActive || isCompleted

              return (
                <React.Fragment key={stepId}>
                  <li className="flex items-center gap-1.5">
                    {/* Círculo do Step - Compacto */}
                    <button
                      type="button"
                      onClick={() => isClickable && onStepClick(stepId)}
                      disabled={!isClickable}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                        isCurrent && "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30",
                        isCompleted && !isCurrent && "bg-primary text-primary-foreground hover:bg-primary/90",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground border border-muted-foreground/30",
                        isClickable && "cursor-pointer hover:scale-105",
                        !isClickable && "cursor-not-allowed"
                      )}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-disabled={!isClickable}
                      title={`${stepLabel}: ${step.description}`}
                    >
                      {isCompleted && !isCurrent ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </button>

                    {/* Label - Compacto */}
                    <span
                      className={cn(
                        "text-xs font-medium transition-colors hidden sm:inline",
                        isCurrent && "text-primary",
                        isCompleted && !isCurrent && "text-primary",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {stepLabel}
                    </span>
                  </li>

                  {/* Linha conectora - Compacta */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-px w-4 transition-all",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </ol>

          {/* Resumo - Compacto */}
          <div className="flex items-center gap-3 text-xs">
            <Badge variant="secondary" className="h-6 px-2 font-normal">
              <span className="text-muted-foreground">Itens:</span>
              <span className="ml-1 font-semibold">{itemsCount}</span>
            </Badge>
            <Separator orientation="vertical" className="h-3" />
            <Badge variant="secondary" className="h-6 px-2 font-normal">
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-1 font-semibold">
                {totals.valorTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

