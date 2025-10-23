"use client"

import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type WizardStep = 'geral' | 'itens' | 'cobranca' | 'revisao'

interface Step {
  key: WizardStep
  label: string
  description: string
}

interface NfeWizardBreadcrumbProps {
  steps: Step[]
  currentStep: WizardStep
  completedSteps: WizardStep[]
  onStepClick: (step: WizardStep) => void
}

export function NfeWizardBreadcrumb({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: NfeWizardBreadcrumbProps) {
  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <nav aria-label="Progress" className="py-4">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key)
          const isCurrent = currentStep === step.key
          const isPast = index < currentStepIndex
          const isClickable = isPast || isCompleted

          return (
            <li key={step.key} className="relative flex-1">
              <div className="flex items-center">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.key)}
                  disabled={!isClickable}
                  className={cn(
                    "group relative flex items-center transition-all",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="flex items-center">
                    <span
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all shadow-sm",
                        isCurrent && "border-primary bg-primary text-primary-foreground shadow-lg scale-110",
                        isCompleted && !isCurrent && "border-green-600 bg-green-600 text-white hover:shadow-md",
                        !isCurrent && !isCompleted && "border-muted-foreground/30 bg-background text-muted-foreground"
                      )}
                    >
                      {isCompleted && !isCurrent ? (
                        <IconCheck className="h-6 w-6" />
                      ) : (
                        <span className="text-base font-bold">{index + 1}</span>
                      )}
                    </span>
                    <span className="ml-3 flex flex-col items-start">
                      <span
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isCurrent && "text-primary",
                          isCompleted && !isCurrent && "text-green-600",
                          !isCurrent && !isCompleted && "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                      <span className={cn(
                        "text-xs transition-colors hidden sm:block",
                        isCurrent ? "text-primary/70" : "text-muted-foreground"
                      )}>
                        {step.description}
                      </span>
                    </span>
                  </span>
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 hidden sm:block">
                    <div
                      className={cn(
                        "h-1 rounded-full transition-all",
                        (isCompleted || isPast) ? "bg-green-600" : "bg-muted-foreground/20"
                      )}
                    />
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

