"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { NfeService } from "@/lib/services/nfe.service"
import { toast } from "sonner"

export type NfeWorkflowStep = 'digitacao' | 'revisao' | 'transmissao' | 'autorizada'

export interface NfeWorkflowState {
  currentStep: NfeWorkflowStep
  nfeId?: string
  nfeNumero?: number
  nfeSerie?: number
  canGoNext: boolean
  canGoPrevious: boolean
  isProcessing: boolean
}

export function useNfeWorkflow(initialNfeId?: string) {
  const router = useRouter()
  const [state, setState] = useState<NfeWorkflowState>({
    currentStep: 'digitacao',
    nfeId: initialNfeId,
    canGoNext: false,
    canGoPrevious: false,
    isProcessing: false,
  })

  /**
   * Avançar para o próximo passo
   */
  const goToNext = useCallback(async () => {
    if (!state.canGoNext || state.isProcessing) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      switch (state.currentStep) {
        case 'digitacao':
          // Validar NFe antes de ir para revisão
          if (!state.nfeId) {
            toast.error("NFe não foi salva ainda")
            return
          }
          
          setState(prev => ({
            ...prev,
            currentStep: 'revisao',
            canGoPrevious: true,
            canGoNext: true,
          }))
          
          router.push(`/nfes/${state.nfeId}/revisar`)
          break

        case 'revisao':
          // Ir para transmissão
          setState(prev => ({
            ...prev,
            currentStep: 'transmissao',
            canGoPrevious: true,
            canGoNext: false,
          }))
          
          router.push(`/nfes/${state.nfeId}/transmitir`)
          break

        case 'transmissao':
          // Transmitir NFe
          if (!state.nfeId) return
          
          await NfeService.transmitir(state.nfeId)
          
          setState(prev => ({
            ...prev,
            currentStep: 'autorizada',
            canGoPrevious: false,
            canGoNext: false,
          }))
          
          toast.success("NFe transmitida com sucesso!")
          router.push(`/nfes/${state.nfeId}`)
          break

        default:
          break
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao avançar")
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }))
    }
  }, [state, router])

  /**
   * Voltar para o passo anterior
   */
  const goToPrevious = useCallback(() => {
    if (!state.canGoPrevious || state.isProcessing) return

    switch (state.currentStep) {
      case 'revisao':
        setState(prev => ({
          ...prev,
          currentStep: 'digitacao',
          canGoPrevious: false,
          canGoNext: true,
        }))
        
        router.push(`/nfes/${state.nfeId}/editar`)
        break

      case 'transmissao':
        setState(prev => ({
          ...prev,
          currentStep: 'revisao',
          canGoPrevious: true,
          canGoNext: true,
        }))
        
        router.push(`/nfes/${state.nfeId}/revisar`)
        break

      default:
        break
    }
  }, [state, router])

  /**
   * Ir para um passo específico
   */
  const goToStep = useCallback((step: NfeWorkflowStep) => {
    if (state.isProcessing) return

    setState(prev => ({
      ...prev,
      currentStep: step,
      canGoPrevious: step !== 'digitacao' && step !== 'autorizada',
      canGoNext: step !== 'autorizada',
    }))

    switch (step) {
      case 'digitacao':
        router.push(`/nfes/${state.nfeId}/editar`)
        break
      case 'revisao':
        router.push(`/nfes/${state.nfeId}/revisar`)
        break
      case 'transmissao':
        router.push(`/nfes/${state.nfeId}/transmitir`)
        break
      case 'autorizada':
        router.push(`/nfes/${state.nfeId}`)
        break
    }
  }, [state, router])

  /**
   * Atualizar informações da NFe
   */
  const updateNfeInfo = useCallback((nfeId: string, numero?: number, serie?: number) => {
    setState(prev => ({
      ...prev,
      nfeId,
      nfeNumero: numero,
      nfeSerie: serie,
    }))
  }, [])

  /**
   * Habilitar/desabilitar navegação
   */
  const setCanGoNext = useCallback((canGo: boolean) => {
    setState(prev => ({ ...prev, canGoNext: canGo }))
  }, [])

  const setCanGoPrevious = useCallback((canGo: boolean) => {
    setState(prev => ({ ...prev, canGoPrevious: canGo }))
  }, [])

  /**
   * Cancelar processo e voltar para listagem
   */
  const cancel = useCallback(() => {
    if (state.isProcessing) {
      toast.error("Aguarde o processamento atual")
      return
    }

    router.push('/nfes')
  }, [state.isProcessing, router])

  /**
   * Salvar NFe em digitação
   */
  const saveDigitacao = useCallback(async (data: any) => {
    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      let nfeId = state.nfeId

      if (nfeId) {
        // Atualizar NFe existente
        await NfeService.update(nfeId, data)
        toast.success("NFe atualizada com sucesso!")
      } else {
        // Criar nova NFe
        const nfe = await NfeService.create(data)
        nfeId = nfe.id
        
        setState(prev => ({
          ...prev,
          nfeId: nfe.id,
          nfeNumero: nfe.numero,
          nfeSerie: nfe.serie,
        }))
        
        toast.success("NFe criada com sucesso!")
      }

      setState(prev => ({ ...prev, canGoNext: true }))
      
      return nfeId
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar NFe")
      throw error
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }))
    }
  }, [state.nfeId])

  return {
    state,
    goToNext,
    goToPrevious,
    goToStep,
    updateNfeInfo,
    setCanGoNext,
    setCanGoPrevious,
    cancel,
    saveDigitacao,
  }
}

