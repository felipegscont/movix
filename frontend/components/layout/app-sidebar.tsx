"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBuilding,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileInvoice,
  IconInnerShadowTop,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react"

import { NavUser } from "@/components/layout/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Dados do sistema Movix
const data = {
  user: {
    name: "Usuário",
    email: "usuario@movix.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Vendas",
      url: "/vendas/orcamentos",
      icon: IconShoppingCart,
    },
    {
      title: "Faturamento",
      url: "/nfes",
      icon: IconFileInvoice,
    },
    {
      title: "Cadastros",
      url: "/cadastros/clientes",
      icon: IconDatabase,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: IconChartBar,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: IconSettings,
    },
  ],
  menuItems: {
    "/dashboard": [],
    "/vendas/orcamentos": [
      { title: "Orçamentos", url: "/vendas/orcamentos" },
      { title: "Novo Orçamento", url: "/vendas/orcamentos/novo" },
      { title: "Pedidos", url: "/vendas/pedidos" },
      { title: "Novo Pedido", url: "/vendas/pedidos/novo" },
    ],
    "/nfes": [
      { title: "Todas as NFes", url: "/nfes" },
      { title: "Nova NFe", url: "/nfes/nova" },
      { title: "Em Digitação", url: "/nfes?status=DIGITACAO" },
      { title: "Autorizadas", url: "/nfes?status=AUTORIZADA" },
      { title: "Canceladas", url: "/nfes?status=CANCELADA" },
    ],
    "/cadastros/clientes": [
      { title: "Clientes", url: "/cadastros/clientes" },
      { title: "Fornecedores", url: "/cadastros/fornecedores" },
      { title: "Produtos", url: "/cadastros/produtos" },
      { title: "Emitentes", url: "/cadastros/emitentes" },
      { title: "NCM", url: "/cadastros/ncm" },
      { title: "CEST", url: "/cadastros/cest" },
      { title: "CFOP", url: "/cadastros/cfop" },
      { title: "Natureza de Operação", url: "/cadastros/natureza-operacao" },
      { title: "Forma de Pagamento", url: "/cadastros/forma-pagamento" },
      { title: "Matriz Fiscal", url: "/cadastros/matriz-fiscal" },
    ],
    "/relatorios": [
      { title: "Vendas", url: "/relatorios/vendas" },
      { title: "Estoque", url: "/relatorios/estoque" },
      { title: "Fiscal", url: "/relatorios/fiscal" },
    ],
    "/configuracoes": [
      { title: "Geral", url: "/configuracoes/geral" },
      { title: "Emitente", url: "/cadastros/emitentes" },
      { title: "Usuários", url: "/configuracoes/usuarios" },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpen } = useSidebar()

  // Encontrar o item ativo baseado na URL atual
  const getActiveItem = React.useCallback(() => {
    return data.navMain.find(item => {
      const items = data.menuItems[item.url] || []
      if (items.length > 0) {
        return items.some((subItem: any) => pathname.startsWith(subItem.url))
      }
      return pathname.startsWith(item.url)
    }) || data.navMain[0]
  }, [pathname])

  const [activeItem, setActiveItem] = React.useState(getActiveItem())
  const [menuItems, setMenuItems] = React.useState(data.menuItems[activeItem.url] || [])

  // Atualizar activeItem quando a URL mudar
  React.useEffect(() => {
    const newActiveItem = getActiveItem()
    setActiveItem(newActiveItem)
    setMenuItems(data.menuItems[newActiveItem.url] || [])
  }, [pathname, getActiveItem])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <IconInnerShadowTop className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Movix</span>
                    <span className="truncate text-xs">NFe</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setMenuItems(data.menuItems[item.url] || [])
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {menuItems.length > 0 ? (
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + '/')}>
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  Nenhum item disponível
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
