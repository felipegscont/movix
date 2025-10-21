"use client"

import { useState, useEffect } from "react"

const SIDEBAR_STORAGE_KEY = "sidebar_state"

// Estado global para manter consistência entre navegações
let globalSidebarState: boolean | null = null

/**
 * Função para obter o estado inicial do sidebar de forma síncrona
 * Evita a animação de abrir/fechar ao navegar entre páginas
 */
function getInitialSidebarState(defaultOpen: boolean): boolean {
  // Se já temos estado global (navegação entre páginas), usa ele
  if (globalSidebarState !== null) {
    return globalSidebarState
  }

  // Se estamos no cliente, tenta ler do localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        const storedValue = stored === "true"
        globalSidebarState = storedValue
        return storedValue
      }
    } catch (error) {
      console.error("Erro ao ler estado do sidebar:", error)
    }
  }

  // Fallback para defaultOpen
  globalSidebarState = defaultOpen
  return defaultOpen
}

/**
 * Hook para gerenciar o estado persistente do sidebar
 * Mantém estado consistente durante navegação com next/link
 * Evita animação de abrir/fechar ao trocar de página
 */
export function useSidebarState(defaultOpen: boolean = true) {
  // Inicia com o valor correto do localStorage/global para evitar animação
  const [open, setOpen] = useState<boolean>(() => getInitialSidebarState(defaultOpen))

  // Sincroniza com estado global e localStorage quando muda
  useEffect(() => {
    globalSidebarState = open

    // Salva no localStorage
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
    } catch (error) {
      console.error("Erro ao salvar estado do sidebar:", error)
    }
  }, [open])

  return [open, setOpen] as const
}
