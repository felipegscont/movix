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

interface CircleStepIndicatorProps {
  currentStep: number
  totalSteps: number
  size?: number
  strokeWidth?: number
}

// ============================================================================
// Circle Step Indicator Component
// ============================================================================

const CircleStepIndicator = ({
  currentStep,
  totalSteps,
  size = 80,
  strokeWidth = 6,
}: CircleStepIndicatorProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const fillPercentage = (currentStep / totalSteps) * 100
  const dashOffset = circumference - (circumference * fillPercentage) / 100

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size}>
        <title>Step Indicator</title>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-300 ease-in-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" aria-live="polite">
          {currentStep} / {totalSteps}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component - Using circular progress indicator
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
      <CardContent className="pt-6 pb-6">
        {/* Barra de Steps - Círculos Padrão */}
        <div className="w-full mb-4" role="navigation" aria-label="Progress">
          <ol className="flex items-center justify-between w-full">
            {steps.map((step, index) => {
              const stepId = step.id ?? step.key ?? index + 1
              const stepLabel = step.name ?? step.label ?? `Step ${index + 1}`

              const isActive = index <= currentStepIndex
              const isCompleted = index < currentStepIndex || completedSteps.includes(stepId)
              const isCurrent = stepId === currentStep
              const isClickable = isActive || isCompleted

              return (
                <li key={stepId} className="flex flex-col items-center gap-2 flex-1 relative">
                  {/* Linha conectora */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 transition-all duration-300",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}

                  {/* Círculo do Step */}
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(stepId)}
                    disabled={!isClickable}
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                      isCurrent && "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20",
                      isCompleted && !isCurrent && "bg-primary text-primary-foreground hover:bg-primary/90",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground border-2 border-muted-foreground/30",
                      isClickable && "cursor-pointer hover:scale-110",
                      !isClickable && "cursor-not-allowed"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-disabled={!isClickable}
                  >
                    {isCompleted && !isCurrent ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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

                  {/* Label */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && !isCurrent && "text-primary",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {stepLabel}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Resumo rápido */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {steps[currentStepIndex]?.description}
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-normal">
              <span className="text-muted-foreground">Itens:</span>
              <span className="ml-1 font-semibold text-foreground">{itemsCount}</span>
            </Badge>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary" className="font-normal">
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-1 font-semibold text-foreground">
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

