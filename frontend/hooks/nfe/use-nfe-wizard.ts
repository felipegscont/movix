"use client"

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { type NfeFormData } from '@/lib/schemas/nfe.schema'

// Tipos do Wizard
type WizardStep = 'geral' | 'itens' | 'cobranca' | 'revisao'

interface WizardState {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  canProceed: boolean
  errors: Record<string, string[]>
}

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

const WIZARD_STEPS: { key: WizardStep; label: string; description: string }[] = [
  { key: 'geral', label: 'Dados Gerais', description: 'Informações básicas da NFe' },
  { key: 'itens', label: 'Itens', description: 'Produtos e serviços' },
  { key: 'cobranca', label: 'Cobrança', description: 'Duplicatas e pagamentos' },
  { key: 'revisao', label: 'Revisão', description: 'Conferir dados antes de salvar' }
]

const INITIAL_FORM_DATA: NfeFormData = {
  clienteId: '',
  naturezaOperacao: '',
  tipoOperacao: 1,
  consumidorFinal: 1,
  presencaComprador: 1,
  modalidadeFrete: 9,
  valorFrete: 0,
  valorSeguro: 0,
  valorDesconto: 0,
  valorOutros: 0,
  valorICMSDesonerado: 0,
  valorFCP: 0,
  valorII: 0,
  valorOutrasDespesas: 0,
  itens: [],
  duplicatas: [],
  pagamentos: []
}

interface UseNfeWizardProps {
  initialData?: Partial<NfeFormData>
  onStepChange?: (step: WizardStep) => void
}

export function useNfeWizard({ initialData, onStepChange }: UseNfeWizardProps = {}) {
  const [formData, setFormData] = useState<NfeFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData
  })

  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 'geral',
    completedSteps: [],
    canProceed: false,
    errors: {}
  })

  // Atualizar dados do formulário
  const updateFormData = useCallback((updates: Partial<NfeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    
    // Limpar erros relacionados aos campos atualizados
    setWizardState(prev => ({
      ...prev,
      errors: Object.keys(updates).reduce((acc, key) => {
        const { [key]: _, ...rest } = prev.errors
        return rest
      }, prev.errors)
    }))
  }, [])

  // Validar step atual
  const validateCurrentStep = useCallback((): ValidationResult => {
    const { currentStep } = wizardState
    const errors: Record<string, string[]> = {}

    switch (currentStep) {
      case 'geral':
        if (!formData.clienteId) {
          errors.clienteId = ['Cliente é obrigatório']
        }
        if (!formData.naturezaOperacao.trim()) {
          errors.naturezaOperacao = ['Natureza da operação é obrigatória']
        }
        break

      case 'itens':
        if (formData.itens.length === 0) {
          errors.itens = ['Adicione pelo menos um item à NFe']
        }
        
        // Validar cada item
        formData.itens.forEach((item, index) => {
          if (!item.pisCstId) {
            errors[`item_${index}_pisCstId`] = ['CST de PIS é obrigatório']
          }
          if (!item.cofinsCstId) {
            errors[`item_${index}_cofinsCstId`] = ['CST de COFINS é obrigatório']
          }
          if (item.quantidadeComercial <= 0) {
            errors[`item_${index}_quantidade`] = ['Quantidade deve ser maior que zero']
          }
          if (item.valorUnitario <= 0) {
            errors[`item_${index}_valor`] = ['Valor unitário deve ser maior que zero']
          }
        })
        break

      case 'cobranca':
        if (formData.duplicatas && formData.duplicatas.length > 0) {
          const totalDuplicatas = formData.duplicatas.reduce((sum, dup) => sum + dup.valor, 0)
          const totalNfe = formData.itens.reduce((sum, item) => sum + item.valorTotal, 0)
          
          if (Math.abs(totalDuplicatas - totalNfe) > 0.01) {
            errors.duplicatas = ['A soma das duplicatas deve ser igual ao valor total da NFe']
          }

          // Validar duplicatas individuais
          formData.duplicatas.forEach((dup, index) => {
            if (!dup.numero.trim()) {
              errors[`duplicata_${index}_numero`] = ['Número da duplicata é obrigatório']
            }
            if (!dup.dataVencimento) {
              errors[`duplicata_${index}_data`] = ['Data de vencimento é obrigatória']
            }
            if (dup.valor <= 0) {
              errors[`duplicata_${index}_valor`] = ['Valor deve ser maior que zero']
            }
          })
        }
        break

      case 'revisao':
        // Validar todos os steps anteriores
        const geralValidation = validateStep('geral')
        const itensValidation = validateStep('itens')
        const cobrancaValidation = validateStep('cobranca')
        
        Object.assign(errors, geralValidation.errors, itensValidation.errors, cobrancaValidation.errors)
        break
    }

    const isValid = Object.keys(errors).length === 0

    setWizardState(prev => ({
      ...prev,
      errors,
      canProceed: isValid
    }))

    return { isValid, errors }
  }, [wizardState.currentStep, formData])

  // Validar step específico (usado na revisão)
  const validateStep = useCallback((step: WizardStep): ValidationResult => {
    const currentStep = wizardState.currentStep
    setWizardState(prev => ({ ...prev, currentStep: step }))
    const result = validateCurrentStep()
    setWizardState(prev => ({ ...prev, currentStep }))
    return result
  }, [wizardState.currentStep, validateCurrentStep])

  // Navegar para próximo step
  const nextStep = useCallback(() => {
    const validation = validateCurrentStep()
    
    if (!validation.isValid) {
      toast.error('Corrija os erros antes de continuar')
      return false
    }

    const currentIndex = WIZARD_STEPS.findIndex(s => s.key === wizardState.currentStep)
    if (currentIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentIndex + 1].key
      
      setWizardState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
        errors: {}
      }))

      onStepChange?.(nextStep)
    }

    return true
  }, [wizardState.currentStep, validateCurrentStep, onStepChange])

  // Navegar para step anterior
  const previousStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.findIndex(s => s.key === wizardState.currentStep)
    if (currentIndex > 0) {
      const prevStep = WIZARD_STEPS[currentIndex - 1].key
      
      setWizardState(prev => ({
        ...prev,
        currentStep: prevStep,
        errors: {}
      }))

      onStepChange?.(prevStep)
    }
  }, [wizardState.currentStep, onStepChange])

  // Ir para step específico
  const goToStep = useCallback((step: WizardStep) => {
    setWizardState(prev => ({
      ...prev,
      currentStep: step,
      errors: {}
    }))

    onStepChange?.(step)
  }, [onStepChange])

  // Resetar wizard
  const resetWizard = useCallback(() => {
    setFormData({ ...INITIAL_FORM_DATA })
    setWizardState({
      currentStep: 'geral',
      completedSteps: [],
      canProceed: false,
      errors: {}
    })
  }, [])

  // Calcular totais
  const calculateTotals = useCallback(() => {
    const { itens, valorFrete = 0, valorSeguro = 0, valorDesconto = 0, valorOutros = 0 } = formData
    
    const subtotal = itens.reduce((sum, item) => sum + item.valorTotal, 0)
    const total = subtotal + valorFrete + valorSeguro - valorDesconto + valorOutros
    
    return {
      subtotal,
      total,
      totalItens: itens.length,
      totalImpostos: {
        icms: itens.reduce((sum, item) => sum + (item.icmsValor || 0), 0),
        pis: itens.reduce((sum, item) => sum + (item.pisValor || 0), 0),
        cofins: itens.reduce((sum, item) => sum + (item.cofinsValor || 0), 0)
      }
    }
  }, [formData])

  // Verificar se pode avançar
  const canAdvance = useCallback(() => {
    return wizardState.canProceed && wizardState.currentStep !== 'revisao'
  }, [wizardState])

  // Verificar se pode voltar
  const canGoBack = useCallback(() => {
    return wizardState.currentStep !== 'geral'
  }, [wizardState])

  return {
    // Estado
    formData,
    wizardState,
    
    // Ações
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    validateCurrentStep,
    
    // Utilitários
    calculateTotals,
    canAdvance,
    canGoBack,
    
    // Constantes
    WIZARD_STEPS
  }
}
