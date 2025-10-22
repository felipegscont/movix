"use client"

import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

const SIDEBAR_COOKIE_NAME = "sidebar_state"

interface SidebarLayoutProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

/**
 * Wrapper do SidebarProvider que persiste o estado do sidebar
 * entre navegações usando cookies
 *
 * Usa useState com função inicializadora para ler o cookie apenas no cliente,
 * evitando hydration mismatch ao garantir que o servidor sempre use o valor padrão.
 */
export function SidebarLayout({ children, style, className }: SidebarLayoutProps) {
  const [mounted, setMounted] = React.useState(false)
  const [defaultOpen, setDefaultOpen] = React.useState(true)

  // Marca como montado e lê o cookie apenas no cliente
  React.useEffect(() => {
    setMounted(true)

    try {
      const cookies = document.cookie.split(';')
      const sidebarCookie = cookies.find(c => c.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`))

      if (sidebarCookie) {
        const value = sidebarCookie.split('=')[1]
        setDefaultOpen(value === 'true')
      }
    } catch (error) {
      console.error("Erro ao ler cookie do sidebar:", error)
    }
  }, [])

  // Durante SSR e primeira renderização, não renderiza nada
  // Isso evita completamente o hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          ...style,
        } as React.CSSProperties
      }
      className={className}
    >
      {children}
    </SidebarProvider>
  )
}

