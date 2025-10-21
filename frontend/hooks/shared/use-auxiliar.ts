"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { AuxiliarService, type Estado, type Municipio } from "@/lib/services/auxiliar.service"

interface UseAuxiliarReturn {
  // Data
  estados: Estado[]
  municipios: Municipio[]
  
  // Loading states
  loadingEstados: boolean
  loadingMunicipios: boolean
  
  // Actions
  loadEstados: () => Promise<void>
  loadMunicipios: (estadoId: string) => Promise<void>
  clearMunicipios: () => void
}

export function useAuxiliar(): UseAuxiliarReturn {
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)

  const loadEstados = useCallback(async () => {
    if (estados.length > 0) return // Já carregados

    try {
      setLoadingEstados(true)
      const data = await AuxiliarService.getEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
      toast.error("Erro ao carregar estados")
    } finally {
      setLoadingEstados(false)
    }
  }, [estados.length])

  const loadMunicipios = useCallback(async (estadoId: string) => {
    if (!estadoId) return

    try {
      setLoadingMunicipios(true)
      const data = await AuxiliarService.getMunicipiosByEstado(estadoId)
      setMunicipios(data)
    } catch (error) {
      console.error("Erro ao carregar municípios:", error)
      toast.error("Erro ao carregar municípios")
    } finally {
      setLoadingMunicipios(false)
    }
  }, [])

  const clearMunicipios = useCallback(() => {
    setMunicipios([])
  }, [])

  // Auto-load estados on mount
  useEffect(() => {
    loadEstados()
  }, [loadEstados])

  return {
    estados,
    municipios,
    loadingEstados,
    loadingMunicipios,
    loadEstados,
    loadMunicipios,
    clearMunicipios,
  }
}
