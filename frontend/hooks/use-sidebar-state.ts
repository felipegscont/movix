"use client"

import { useState, useEffect } from "react"

const SIDEBAR_STORAGE_KEY = "sidebar_state"

// Estado global para manter consistência entre navegações
let globalSidebarState: boolean | null = null
let isGlobalInitialized = false

/**
 * Hook para gerenciar o estado persistente do sidebar
 * Mantém estado consistente durante navegação com next/link
 * Evita erro de hidratação usando o mesmo valor inicial no servidor e cliente
 */
export function useSidebarState(defaultOpen: boolean = true) {
  // SEMPRE inicia com defaultOpen para evitar erro de hidratação
  // O valor do localStorage será carregado após a montagem
  const [open, setOpen] = useState<boolean>(defaultOpen)
  const [mounted, setMounted] = useState(false)

  // Carrega o valor do localStorage após a montagem (apenas no cliente)
  useEffect(() => {
    setMounted(true)

    // Se já temos estado global, usa ele
    if (globalSidebarState !== null) {
      setOpen(globalSidebarState)
      return
    }

    // Senão, tenta carregar do localStorage
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        const storedValue = stored === "true"
        setOpen(storedValue)
        globalSidebarState = storedValue
      } else {
        globalSidebarState = defaultOpen
      }
      isGlobalInitialized = true
    } catch (error) {
      console.error("Erro ao ler estado do sidebar:", error)
      globalSidebarState = defaultOpen
      isGlobalInitialized = true
    }
  }, [defaultOpen])

  // Sincroniza com estado global e localStorage quando muda
  useEffect(() => {
    if (!mounted) return

    globalSidebarState = open

    // Salva no localStorage
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
    } catch (error) {
      console.error("Erro ao salvar estado do sidebar:", error)
    }
  }, [open, mounted])

  return [open, setOpen] as const
}
