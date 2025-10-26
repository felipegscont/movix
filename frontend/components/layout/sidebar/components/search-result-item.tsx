import Link from "next/link"
import { SearchResult, NavMainItem } from "../types"

interface SearchResultItemProps {
  result: SearchResult
  resultModule: NavMainItem | undefined
  onResultClick: (module: NavMainItem, parentTitle?: string) => void
}

/**
 * Item de resultado de busca global
 */
export function SearchResultItem({
  result,
  resultModule,
  onResultClick,
}: SearchResultItemProps) {
  return (
    <Link
      href={result.url}
      onClick={() => {
        // Ativar o módulo correto
        if (resultModule) {
          onResultClick(resultModule, result.parentTitle)
        }
      }}
      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-0.5 border-b px-4 py-2 leading-tight last:border-b-0"
    >
      <span className="font-medium text-sm">{result.title}</span>
      {result.description && (
        <span className="text-[11px] text-muted-foreground/80 font-normal leading-tight">
          {result.description}
        </span>
      )}
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-0.5">
        <span>{result.section}</span>
        {result.parentTitle && (
          <>
            <span>›</span>
            <span>{result.parentTitle}</span>
          </>
        )}
      </div>
    </Link>
  )
}

