"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Command } from "lucide-react"

import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

// Importar dados e hooks modularizados
import { sidebarData } from "./sidebar/data"
import { useActiveItem, useOpenGroups, useGlobalSearch } from "./sidebar/hooks"
import {
  SidebarHeaderContent,
  SidebarMainMenu,
  SidebarContentArea,
} from "./sidebar/components"
import type { NavMainItem } from "./sidebar/types"

/**
 * Componente principal do Sidebar da aplicação
 *
 * Estrutura modular:
 * - Dados: ./sidebar/data.ts
 * - Tipos: ./sidebar/types.ts
 * - Hooks: ./sidebar/hooks/
 * - Componentes: ./sidebar/components/
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpen } = useSidebar()

  // Hooks customizados para gerenciar estado
  const { activeItem, setActiveItem, setManuallySetActiveItem } = useActiveItem(pathname)
  const { openGroups, setOpenGroups } = useOpenGroups(pathname, activeItem)
  const { searchQuery, setSearchQuery, globalSearchResults } = useGlobalSearch()

  // Handler para clique em item do menu principal
  const handleMainMenuItemClick = (item: NavMainItem) => {
    setActiveItem(item)
    setManuallySetActiveItem(true)
    setOpen(true)
    setSearchQuery("")
  }

  // Handler para clique em resultado de busca
  const handleSearchResultClick = (module: NavMainItem, parentTitle?: string) => {
    setActiveItem(module)
    setManuallySetActiveItem(true)

    // Se o item está dentro de um grupo, expandir o grupo
    if (parentTitle) {
      setOpenGroups((prev) => ({
        ...prev,
        [parentTitle]: true,
      }))
    }

    // Limpar a busca
    setSearchQuery("")
  }

  // Handler para toggle de grupo
  const handleToggleGroup = (title: string, open: boolean) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: open,
    }))
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* Sidebar principal (ícones) */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Movix</span>
                    <span className="truncate text-xs">Sistema</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMainMenu
                navItems={sidebarData.navMain}
                activeItem={activeItem}
                onItemClick={handleMainMenuItemClick}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
      </Sidebar>

      {/* Sidebar secundário (conteúdo) */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              <SidebarHeaderContent
                searchQuery={searchQuery}
                globalSearchResults={globalSearchResults}
                activeItemTitle={activeItem?.title}
              />
            </div>
          </div>
          <SidebarInput
            placeholder="Buscar em todo o sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <SidebarContentArea
                searchQuery={searchQuery}
                globalSearchResults={globalSearchResults}
                activeItem={activeItem}
                pathname={pathname}
                openGroups={openGroups}
                onToggleGroup={handleToggleGroup}
                onSearchResultClick={handleSearchResultClick}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
