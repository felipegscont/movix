"use client"

import { useState, useEffect } from "react"

const SIDEBAR_STORAGE_KEY = "sidebar_state"

/**
 * Hook para gerenciar o estado persistente do sidebar
 * Usa localStorage para persistir o estado entre navegações
 */
export function useSidebarState(defaultOpen: boolean = true) {
  const [open, setOpen] = useState<boolean>(() => {
    // Só acessa localStorage no cliente
    if (typeof window === "undefined") {
      return defaultOpen
    }

    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        return stored === "true"
      }
    } catch (error) {
      console.error("Erro ao ler estado do sidebar:", error)
    }

    return defaultOpen
  })

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
      } catch (error) {
        console.error("Erro ao salvar estado do sidebar:", error)
      }
    }
  }, [open])

  return [open, setOpen] as const
}

