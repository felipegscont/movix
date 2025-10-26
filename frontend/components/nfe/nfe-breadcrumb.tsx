"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconHome, IconFileInvoice, IconPlus, IconEye, IconEdit, IconSend } from "@tabler/icons-react"

interface NfeBreadcrumbProps {
  nfeNumero?: string
  nfeSerie?: number
  currentStep?: 'digitacao' | 'revisao' | 'transmissao' | 'autorizada' | 'visualizacao'
}

export function NfeBreadcrumb({ nfeNumero, nfeSerie, currentStep }: NfeBreadcrumbProps) {
  const pathname = usePathname()

  // Determinar a estrutura do breadcrumb baseado na URL
  const isNova = pathname?.includes('/nova')
  const isEditar = pathname?.includes('/editar')
  const isTransmitir = pathname?.includes('/transmitir')
  const isVisualizacao = pathname?.match(/\/nfes\/[^/]+$/)

  const steps = [
    {
      key: 'digitacao',
      label: 'Digitação',
      icon: IconPlus,
      description: 'Preenchimento dos dados',
    },
    {
      key: 'revisao',
      label: 'Revisão',
      icon: IconEye,
      description: 'Conferência dos dados',
    },
    {
      key: 'transmissao',
      label: 'Transmissão',
      icon: IconSend,
      description: 'Envio para SEFAZ',
    },
    {
      key: 'autorizada',
      label: 'Autorizada',
      icon: IconFileInvoice,
      description: 'NFe autorizada',
    },
  ]

  const getCurrentStepIndex = () => {
    if (currentStep) {
      return steps.findIndex(s => s.key === currentStep)
    }
    if (isNova) return 0
    if (isEditar) return 0
    if (isTransmitir) return 2
    if (isVisualizacao) return 3
    return -1
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="space-y-4">
      {/* Breadcrumb de Navegação */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <IconHome className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/fiscal/nfe">
                <IconFileInvoice className="h-4 w-4 mr-1" />
                NFes
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNova && "Nova NFe"}
              {isEditar && `Editar NFe ${nfeNumero ? `#${nfeNumero}` : ''}`}
              {isTransmitir && `Transmitir NFe ${nfeNumero ? `#${nfeNumero}` : ''}`}
              {isVisualizacao && `NFe ${nfeNumero ? `#${nfeNumero}` : ''}`}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Steps de Progresso (apenas para criação/edição/transmissão) */}
      {(isNova || isEditar || isTransmitir || currentStep) && (
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex
              const isDisabled = index > currentStepIndex

              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {/* Linha de Conexão */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}

                  {/* Círculo do Step */}
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-all
                      ${isActive ? 'bg-primary border-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                      ${isDisabled ? 'bg-muted border-muted-foreground/20 text-muted-foreground' : ''}
                      ${!isActive && !isCompleted && !isDisabled ? 'bg-background border-muted-foreground/50' : ''}
                    `}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>

                  {/* Label do Step */}
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? 'text-primary' : ''
                      } ${isCompleted ? 'text-primary' : ''} ${
                        isDisabled ? 'text-muted-foreground' : ''
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Informações da NFe */}
      {nfeNumero && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Número:</span>
            <span>{nfeNumero.toString().padStart(6, '0')}</span>
          </div>
          {nfeSerie && (
            <>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">Série:</span>
                <span>{nfeSerie}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

