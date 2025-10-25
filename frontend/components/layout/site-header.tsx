"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconHome } from "@tabler/icons-react"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Mapear pathname para título da página
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/vendas")) return "Vendas"
    if (pathname.startsWith("/nfes")) return "Faturamento"
    if (pathname.startsWith("/cadastros")) return "Cadastros"
    if (pathname.startsWith("/relatorios")) return "Relatórios"
    if (pathname.startsWith("/configuracoes")) return "Configurações"
    return "Dashboard"
  }

  return (
    <header className="bg-background sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">
              <IconHome className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

