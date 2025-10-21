"use client"

import { useState, useEffect } from "react"

const SIDEBAR_STORAGE_KEY = "sidebar_state"

// Estado global para manter consistência entre navegações
let globalSidebarState: boolean | null = null
let isGlobalInitialized = false

/**
 * Hook para gerenciar o estado persistente do sidebar
 * Mantém estado consistente durante navegação com next/link
 */
export function useSidebarState(defaultOpen: boolean = true) {
  // Inicializa com estado global se já foi carregado, senão usa o valor do localStorage ou padrão
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return defaultOpen
    }

    // Se já temos estado global, usa ele
    if (globalSidebarState !== null) {
      return globalSidebarState
    }

    // Senão, tenta carregar do localStorage
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      const initialValue = stored !== null ? stored === "true" : defaultOpen
      globalSidebarState = initialValue
      isGlobalInitialized = true
      return initialValue
    } catch (error) {
      console.error("Erro ao ler estado do sidebar:", error)
      globalSidebarState = defaultOpen
      isGlobalInitialized = true
      return defaultOpen
    }
  })

  // Sincroniza com estado global quando muda
  useEffect(() => {
    globalSidebarState = open

    // Salva no localStorage
    if (typeof window !== "undefined" && isGlobalInitialized) {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
      } catch (error) {
        console.error("Erro ao salvar estado do sidebar:", error)
      }
    }
  }, [open])

  return [open, setOpen] as const
}
