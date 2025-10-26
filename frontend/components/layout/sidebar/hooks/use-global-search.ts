import { useState, useMemo } from "react"
import { SearchResult, isNavGroup, isSectionHeader } from "../types"
import { sidebarData } from "../data"

/**
 * Hook para busca global no sidebar
 */
export function useGlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  // Busca global em todos os itens do menu
  const globalSearchResults = useMemo((): SearchResult[] | null => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Buscar em todos os itens do menu principal
    sidebarData.navMain.forEach((mainItem) => {
      // Buscar nos subitens
      mainItem.items.forEach((subItem) => {
        // Ignorar cabeçalhos de seção
        if (isSectionHeader(subItem)) return

        // Busca no título e descrição do subitem
        const matchTitle = subItem.title.toLowerCase().includes(query)
        const matchDescription = subItem.description?.toLowerCase().includes(query)

        if (matchTitle || matchDescription) {
          results.push({
            section: mainItem.title,
            sectionUrl: mainItem.url,
            title: subItem.title,
            url: subItem.url,
            description: subItem.description,
          })
        }

        // Se for um grupo, buscar nos itens aninhados
        if (isNavGroup(subItem) && subItem.items) {
          subItem.items.forEach((nestedItem) => {
            const matchNestedTitle = nestedItem.title.toLowerCase().includes(query)
            const matchNestedDescription = nestedItem.description
              ?.toLowerCase()
              .includes(query)

            if (matchNestedTitle || matchNestedDescription) {
              results.push({
                section: mainItem.title,
                sectionUrl: mainItem.url,
                title: nestedItem.title,
                url: nestedItem.url,
                description: nestedItem.description,
                parentTitle: subItem.title,
              })
            }
          })
        }
      })
    })

    return results
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    globalSearchResults,
  }
}

