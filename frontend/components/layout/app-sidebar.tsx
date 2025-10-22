"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconBuilding,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileInvoice,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconPackage,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@movix.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "NFe",
      icon: IconFileInvoice,
      isActive: true,
      url: "/nfes",
      items: [
        {
          title: "Todas as NFes",
          url: "/nfes",
        },
        {
          title: "Nova NFe",
          url: "/nfes/nova",
        },
        {
          title: "Em Digitação",
          url: "/nfes?status=DIGITACAO",
        },
        {
          title: "Autorizadas",
          url: "/nfes?status=AUTORIZADA",
        },
        {
          title: "Canceladas",
          url: "/nfes?status=CANCELADA",
        },
      ],
    },
    {
      title: "Cadastros",
      icon: IconDatabase,
      url: "/cadastros/clientes",
      items: [
        {
          title: "Clientes",
          url: "/cadastros/clientes",
          icon: IconUsers,
        },
        {
          title: "Fornecedores",
          url: "/cadastros/fornecedores",
          icon: IconBuilding,
        },
        {
          title: "Produtos",
          url: "/cadastros/produtos",
          icon: IconPackage,
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: IconChartBar,
    },
    {
      title: "Configurações",
      icon: IconSettings,
      url: "/configuracoes/emitente",
      items: [
        {
          title: "Emitente",
          url: "/configuracoes/emitente",
        },
        {
          title: "Naturezas de Operação",
          url: "/configuracoes/naturezas-operacao",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Ajuda",
      url: "/ajuda",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Movix NFe</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex-1">
            <NavUser user={data.user} />
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
