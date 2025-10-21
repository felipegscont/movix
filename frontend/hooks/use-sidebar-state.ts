"use client"

import { useState, useEffect } from "react"

const SIDEBAR_STORAGE_KEY = "sidebar_state"

/**
 * Hook para gerenciar o estado persistente do sidebar
 * Usa localStorage para persistir o estado entre navegações
 */
export function useSidebarState(defaultOpen: boolean = true) {
  // Sempre inicia com o valor padrão para evitar erro de hidratação
  const [open, setOpen] = useState<boolean>(defaultOpen)
  const [isInitialized, setIsInitialized] = useState(false)

  // Carrega o valor do localStorage apenas no cliente após a hidratação
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      try {
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
        if (stored !== null) {
          setOpen(stored === "true")
        }
      } catch (error) {
        console.error("Erro ao ler estado do sidebar:", error)
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Salva no localStorage sempre que mudar (apenas após inicialização)
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
      } catch (error) {
        console.error("Erro ao salvar estado do sidebar:", error)
      }
    }
  }, [open, isInitialized])

  return [open, setOpen] as const
}
