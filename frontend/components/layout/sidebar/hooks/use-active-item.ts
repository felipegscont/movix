import { useCallback, useState, useEffect } from "react"
import { NavMainItem, isNavGroup, isSectionHeader } from "../types"
import { sidebarData } from "../data"

/**
 * Hook para gerenciar o item ativo do sidebar baseado na URL atual
 */
export function useActiveItem(pathname: string) {
  /**
   * Encontra o item ativo baseado na URL atual
   */
  const getActiveItem = useCallback((): NavMainItem => {
    let bestMatch: NavMainItem | null = null
    let bestMatchLength = 0

    // Primeiro, tentar encontrar correspondência exata na URL principal do item
    for (const item of sidebarData.navMain) {
      // Verificar correspondência exata ou se pathname começa com a URL do item + /
      if (pathname === item.url || pathname.startsWith(item.url + "/")) {
        const matchLength = item.url.length
        if (matchLength > bestMatchLength) {
          bestMatch = item
          bestMatchLength = matchLength
        }
      }
    }

    // Se encontrou correspondência na URL principal, retornar
    if (bestMatch) {
      return bestMatch
    }

    // Se não encontrou, verificar nos subitens (priorizar URLs mais longas)
    for (const item of sidebarData.navMain) {
      if (item.items.length > 0) {
        for (const subItem of item.items) {
          // Ignorar cabeçalhos de seção
          if (isSectionHeader(subItem)) continue

          // Verificar se o subitem corresponde
          if (
            subItem.url &&
            (pathname === subItem.url || pathname.startsWith(subItem.url + "/"))
          ) {
            const matchLength = subItem.url.length
            if (matchLength > bestMatchLength) {
              bestMatch = item
              bestMatchLength = matchLength
            }
          }

          // Verificar se o subitem tem subitens aninhados (grupos)
          if (isNavGroup(subItem) && subItem.items.length > 0) {
            for (const nestedItem of subItem.items) {
              if (
                nestedItem.url &&
                (pathname === nestedItem.url ||
                  pathname.startsWith(nestedItem.url + "/"))
              ) {
                const matchLength = nestedItem.url.length
                if (matchLength > bestMatchLength) {
                  bestMatch = item
                  bestMatchLength = matchLength
                }
              }
            }
          }
        }
      }
    }

    // Se encontrou alguma correspondência, retornar
    if (bestMatch) {
      return bestMatch
    }

    // Se não encontrar, retornar o primeiro item (Dashboard)
    return sidebarData.navMain[0]
  }, [pathname])

  const [activeItem, setActiveItem] = useState<NavMainItem>(getActiveItem())
  const [previousActiveItem, setPreviousActiveItem] = useState<NavMainItem>(getActiveItem())
  const [manuallySetActiveItem, setManuallySetActiveItem] = useState(false)

  // Atualizar o item ativo quando a rota mudar
  useEffect(() => {
    const newActiveItem = getActiveItem()
    const itemChanged = previousActiveItem?.title !== newActiveItem.title

    // Se foi definido manualmente, não sobrescrever imediatamente
    if (manuallySetActiveItem) {
      // Resetar flag após navegação completar
      const timer = setTimeout(() => {
        setManuallySetActiveItem(false)
      }, 300)
      return () => clearTimeout(timer)
    }

    // Sempre atualizar quando o módulo mudar de verdade
    if (itemChanged) {
      setActiveItem(newActiveItem)
      setPreviousActiveItem(newActiveItem)
    }
  }, [pathname, getActiveItem, previousActiveItem, manuallySetActiveItem])

  return {
    activeItem,
    setActiveItem,
    setManuallySetActiveItem,
  }
}

