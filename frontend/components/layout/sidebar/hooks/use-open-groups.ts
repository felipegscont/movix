import { useState, useEffect } from "react"
import { NavMainItem, isNavGroup } from "../types"

/**
 * Hook para gerenciar grupos colapsáveis abertos/fechados
 */
export function useOpenGroups(pathname: string, activeItem: NavMainItem | null) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    activeItem?.items?.forEach((subItem) => {
      if (isNavGroup(subItem) && subItem.items) {
        const isGroupActive = subItem.items.some(
          (item) => pathname === item.url || pathname.startsWith(item.url + "/")
        )
        initial[subItem.title] = isGroupActive
      }
    })
    return initial
  })

  // Atualizar grupos abertos quando a rota ou item ativo mudar
  useEffect(() => {
    const newOpenGroups: Record<string, boolean> = {}
    activeItem?.items?.forEach((subItem) => {
      if (isNavGroup(subItem) && subItem.items) {
        const isGroupActive = subItem.items.some(
          (item) => pathname === item.url || pathname.startsWith(item.url + "/")
        )
        newOpenGroups[subItem.title] = isGroupActive
      }
    })
    setOpenGroups(newOpenGroups)
  }, [pathname, activeItem])

  return {
    openGroups,
    setOpenGroups,
  }
}

