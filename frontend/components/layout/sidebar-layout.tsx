"use client"

import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarState } from "@/hooks/shared/use-sidebar-state"

interface SidebarLayoutProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

/**
 * Wrapper do SidebarProvider que persiste o estado do sidebar
 * entre navegações usando localStorage
 */
export function SidebarLayout({ children, style, className }: SidebarLayoutProps) {
  const [open, setOpen] = useSidebarState(true)

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
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

