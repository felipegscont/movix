import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavGroup } from "../types"

interface NavGroupCollapsibleProps {
  group: NavGroup
  pathname: string
  isOpen: boolean
  onToggle: (open: boolean) => void
}

/**
 * Grupo colapsável de itens de navegação
 */
export function NavGroupCollapsible({
  group,
  pathname,
  isOpen,
  onToggle,
}: NavGroupCollapsibleProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between gap-2 px-4 py-3 text-sm leading-tight">
            <span className="font-medium">{group.title}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="border-l-2 border-sidebar-border ml-3">
            {group.items.map((nestedItem) => {
              // Lógica de ativação mais precisa
              const exactMatch = pathname === nestedItem.url
              const childMatch = pathname.startsWith(nestedItem.url + "/")

              // Verifica se existe outro item com URL mais específica que também combina
              const hasMoreSpecificMatch = group.items.some(
                (otherItem) =>
                  otherItem.url !== nestedItem.url &&
                  otherItem.url.startsWith(nestedItem.url) &&
                  (pathname === otherItem.url ||
                    pathname.startsWith(otherItem.url + "/"))
              )

              const isActive = (exactMatch || childMatch) && !hasMoreSpecificMatch

              return (
                <Link
                  key={nestedItem.url || `nested-${nestedItem.title}`}
                  href={nestedItem.url}
                  className={cn(
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-0.5 py-2 pl-3 pr-4 text-sm leading-tight",
                    isActive &&
                      "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  )}
                >
                  <span>{nestedItem.title}</span>
                  {nestedItem.description && (
                    <span className="text-[11px] text-muted-foreground/80 font-normal leading-tight">
                      {nestedItem.description}
                    </span>
                  )}
                </Link>
              )
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

