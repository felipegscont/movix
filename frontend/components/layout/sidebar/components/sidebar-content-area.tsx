import { SidebarMenu } from "@/components/ui/sidebar"
import { NavMainItem, SubItem, isSectionHeader, isNavGroup, isNavItem } from "../types"
import { SearchResult } from "../types"
import { SearchResultItem } from "./search-result-item"
import { SectionHeader } from "./section-header"
import { NavItemLink } from "./nav-item-link"
import { NavGroupCollapsible } from "./nav-group-collapsible"
import { sidebarData } from "../data"

interface SidebarContentAreaProps {
  searchQuery: string
  globalSearchResults: SearchResult[] | null
  activeItem: NavMainItem | null
  pathname: string
  openGroups: Record<string, boolean>
  onToggleGroup: (title: string, open: boolean) => void
  onSearchResultClick: (module: NavMainItem, parentTitle?: string) => void
}

/**
 * Área de conteúdo do sidebar (resultados de busca ou itens do módulo)
 */
export function SidebarContentArea({
  searchQuery,
  globalSearchResults,
  activeItem,
  pathname,
  openGroups,
  onToggleGroup,
  onSearchResultClick,
}: SidebarContentAreaProps) {
  // Resultados da busca global
  if (globalSearchResults && globalSearchResults.length > 0) {
    return (
      <div>
        {globalSearchResults.map((result, index) => {
          const resultModule = sidebarData.navMain.find(
            (item) => item.title === result.section
          )

          return (
            <SearchResultItem
              key={`${result.url}-${index}`}
              result={result}
              resultModule={resultModule}
              onResultClick={onSearchResultClick}
            />
          )
        })}
      </div>
    )
  }

  // Itens do módulo ativo
  if (activeItem && activeItem.items.length > 0 && !searchQuery.trim()) {
    // Filtrar apenas NavItems para passar para NavItemLink
    const navItems = activeItem.items.filter(isNavItem)

    return (
      <SidebarMenu>
        {activeItem.items.map((subItem) => {
          // Grupo colapsável
          if (isNavGroup(subItem) && subItem.items.length > 0) {
            const isOpen = openGroups[subItem.title] || false

            return (
              <NavGroupCollapsible
                key={subItem.url || `group-${subItem.title}`}
                group={subItem}
                pathname={pathname}
                isOpen={isOpen}
                onToggle={(open) => onToggleGroup(subItem.title, open)}
              />
            )
          }

          // Cabeçalho de seção
          if (isSectionHeader(subItem)) {
            return <SectionHeader key={`section-${subItem.title}`} title={subItem.title} />
          }

          // Item normal
          if (isNavItem(subItem)) {
            return (
              <NavItemLink
                key={subItem.url || `item-${subItem.title}`}
                item={subItem}
                pathname={pathname}
                allItems={navItems}
              />
            )
          }

          return null
        })}
      </SidebarMenu>
    )
  }

  // Mensagem quando não há resultados
  return (
    <div className="p-4 text-sm text-muted-foreground text-center">
      {searchQuery.trim() ? (
        <>
          <p className="font-medium">Nenhum resultado encontrado</p>
          <p className="text-xs mt-1">Tente buscar com outros termos</p>
        </>
      ) : (
        "Nenhum subitem disponível"
      )}
    </div>
  )
}

