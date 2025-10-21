"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { ExternalApiService, type CnpjData, type CepData } from "@/lib/services/external-api.service"

interface UseExternalApisReturn {
  // Loading states
  loadingCnpj: boolean
  loadingCep: boolean
  error: string | null

  // Actions
  consultarCnpj: (cnpj: string) => Promise<CnpjData | null>
  consultarCep: (cep: string) => Promise<CepData | null>
  autoFillByCnpj: (cnpj: string) => Promise<CnpjData | null>
  clearError: () => void
}

export function useExternalApis(): UseExternalApisReturn {
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const consultarCnpj = useCallback(async (cnpj: string): Promise<CnpjData | null> => {
    if (!cnpj || !ExternalApiService.validateCnpj(cnpj)) {
      setError('CNPJ inválido')
      toast.error("CNPJ inválido")
      return null
    }

    if (loadingCnpj) return null

    setLoadingCnpj(true)
    setError(null)

    try {
      const data = await ExternalApiService.consultarCnpj(cnpj)
      if (data) {
        toast.success("Dados do CNPJ carregados com sucesso!")
        return data
      }
      toast.warning("CNPJ não encontrado")
      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao consultar CNPJ'
      setError(errorMessage)
      toast.error("Erro ao consultar CNPJ. Verifique se o CNPJ está correto.")
      return null
    } finally {
      setLoadingCnpj(false)
    }
  }, [loadingCnpj])

  const consultarCep = useCallback(async (cep: string): Promise<CepData | null> => {
    if (!cep || !ExternalApiService.validateCep(cep)) {
      setError('CEP inválido')
      toast.error("CEP inválido")
      return null
    }

    if (loadingCep) return null

    setLoadingCep(true)
    setError(null)

    try {
      const data = await ExternalApiService.consultarCep(cep)
      if (data) {
        toast.success("Endereço encontrado!")
        return data
      }
      toast.warning("CEP não encontrado")
      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao consultar CEP'
      setError(errorMessage)
      toast.error("Erro ao consultar CEP. Verifique se o CEP está correto.")
      return null
    } finally {
      setLoadingCep(false)
    }
  }, [loadingCep])

  const autoFillByCnpj = useCallback(async (cnpj: string): Promise<CnpjData | null> => {
    if (!cnpj || !ExternalApiService.validateCnpj(cnpj)) {
      setError('CNPJ inválido')
      return null
    }

    setLoadingCnpj(true)
    setError(null)

    try {
      const data = await ExternalApiService.autoFillByCnpj(cnpj)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na consulta do CNPJ'
      setError(errorMessage)
      return null
    } finally {
      setLoadingCnpj(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loadingCnpj,
    loadingCep,
    error,
    consultarCnpj,
    consultarCep,
    autoFillByCnpj,
    clearError,
  }
}
