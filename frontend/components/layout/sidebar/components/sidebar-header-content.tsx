import { Search } from "lucide-react"
import { SearchResult } from "../types"

interface SidebarHeaderContentProps {
  searchQuery: string
  globalSearchResults: SearchResult[] | null
  activeItemTitle?: string
}

/**
 * Conteúdo do cabeçalho do sidebar (título ou busca)
 */
export function SidebarHeaderContent({
  searchQuery,
  globalSearchResults,
  activeItemTitle,
}: SidebarHeaderContentProps) {
  if (searchQuery.trim()) {
    return (
      <span className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span>Busca Global</span>
        {globalSearchResults && (
          <span className="text-xs text-muted-foreground">
            ({globalSearchResults.length}{" "}
            {globalSearchResults.length === 1 ? "resultado" : "resultados"})
          </span>
        )}
      </span>
    )
  }

  return <>{activeItemTitle}</>
}

