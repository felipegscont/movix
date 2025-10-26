import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavItem } from "../types"

interface NavItemLinkProps {
  item: NavItem
  pathname: string
  allItems: NavItem[]
}

/**
 * Link de item de navegação normal
 */
export function NavItemLink({ item, pathname, allItems }: NavItemLinkProps) {
  // Lógica de ativação mais precisa:
  // 1. Comparação exata com a URL
  // 2. OU pathname começa com a URL + '/' (para rotas filhas)
  // 3. MAS não ativa se houver uma URL mais específica que também combina
  const exactMatch = pathname === item.url
  const childMatch = pathname.startsWith(item.url + "/")

  // Verifica se existe outro item com URL mais específica que também combina
  const hasMoreSpecificMatch = allItems.some(
    (otherItem) =>
      otherItem.url !== item.url &&
      otherItem.url.startsWith(item.url) &&
      (pathname === otherItem.url || pathname.startsWith(otherItem.url + "/"))
  )

  const isActive = (exactMatch || childMatch) && !hasMoreSpecificMatch

  return (
    <Link
      href={item.url}
      className={cn(
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-0.5 border-b px-4 py-2 text-sm leading-tight last:border-b-0",
        isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      )}
    >
      <span className="font-medium">{item.title}</span>
      {item.description && (
        <span className="text-[11px] text-muted-foreground/80 font-normal leading-tight">
          {item.description}
        </span>
      )}
    </Link>
  )
}

