"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  Package,
  Building2,
  Table2,
  Settings,
  BarChart3,
  HelpCircle,
  Command
} from "lucide-react"

import { NavUser } from "@/components/layout/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

// Dados do sistema
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Building2,
      isActive: false,
      items: [],
    },
    {
      title: "Vendas",
      url: "/vendas",
      icon: ShoppingCart,
      isActive: false,
      items: [
        {
          title: "Orçamentos",
          url: "/vendas/orcamentos",
        },
        {
          title: "Pedidos",
          url: "/vendas/pedidos",
        },
        {
          title: "Cupons",
          url: "/vendas/cupons",
        },
        {
          title: "Consignados",
          url: "/vendas/consignados",
        },
        {
          title: "Devoluções",
          url: "/vendas/devolucoes",
        },
        {
          title: "Comissões",
          url: "/vendas/comissoes",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Lista de Clientes",
          url: "/clientes/lista",
        },
        {
          title: "CRM",
          url: "/clientes/crm",
        },
      ],
    },
    {
      title: "Produtos",
      url: "/produtos",
      icon: Package,
      isActive: false,
      items: [
        {
          title: "Lista de Produtos",
          url: "/produtos/lista",
        },
        {
          title: "Serviços",
          url: "/produtos/servicos",
        },
        {
          title: "Combos",
          url: "/produtos/combos",
        },
        {
          title: "Categorias",
          url: "/produtos/categorias",
        },
        {
          title: "Marcas",
          url: "/produtos/marcas",
        },
        {
          title: "Unidades de Medida",
          url: "/produtos/unidades",
        },
        {
          title: "Etiquetas",
          url: "/produtos/etiquetas",
        },
        {
          title: "Lista de Preços",
          url: "/produtos/precos",
        },
      ],
    },
    {
      title: "Serviços",
      url: "/servicos",
      icon: Command,
      isActive: false,
      items: [
        {
          title: "Ordem de Serviço (O.S.)",
          url: "/servicos/os",
        },
        {
          title: "Serviços Prestados",
          url: "/servicos/prestados",
        },
      ],
    },
    {
      title: "Fiscal",
      url: "/fiscal",
      icon: FileText,
      isActive: false,
      items: [
        {
          title: "Notas Fiscais (NFe)",
          url: "/fiscal/nfe/nfes",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "Emitente",
          url: "/configuracoes/emitente",
        },
        {
          title: "Naturezas de Operação",
          url: "/configuracoes/fiscal/naturezas-operacao",
        },
        {
          title: "Matrizes Fiscais",
          url: "/configuracoes/fiscal/matrizes-fiscais",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
      isActive: false,
      items: [],
    },
    {
      title: "Ajuda",
      url: "/ajuda",
      icon: HelpCircle,
      isActive: false,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpen, open } = useSidebar()

  // Função para encontrar o item ativo baseado na URL atual
  const getActiveItem = React.useCallback(() => {
    // Encontrar o item que corresponde à rota atual
    for (const item of data.navMain) {
      // Verificar se a URL atual começa com a URL do item
      if (pathname.startsWith(item.url)) {
        return item
      }
      // Verificar se algum subitem corresponde à URL atual
      if (item.items.length > 0) {
        for (const subItem of item.items) {
          if (pathname.startsWith(subItem.url)) {
            return item
          }
        }
      }
    }
    // Se não encontrar, retornar o primeiro item (Dashboard)
    return data.navMain[0]
  }, [pathname])

  const [activeItem, setActiveItem] = React.useState(getActiveItem())
  const [previousActiveItem, setPreviousActiveItem] = React.useState(getActiveItem())

  // Atualizar o item ativo quando a rota mudar
  React.useEffect(() => {
    const newActiveItem = getActiveItem()
    const hasSubitems = newActiveItem.items.length > 0
    const itemChanged = previousActiveItem?.title !== newActiveItem.title

    setActiveItem(newActiveItem)

    // Só alterar o estado do sidebar se mudou de item principal
    if (itemChanged) {
      if (hasSubitems) {
        // Se o novo item tem subitens, abrir o sidebar
        setOpen(true)
      } else {
        // Se o novo item não tem subitens, fechar o sidebar
        setOpen(false)
      }
      setPreviousActiveItem(newActiveItem)
    }
    // Se não mudou de item, manter o estado atual (open) escolhido pelo usuário
  }, [pathname, getActiveItem, setOpen, previousActiveItem])

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
                <a href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Movix</span>
                    <span className="truncate text-xs">Sistema</span>
                  </div>
                </a>
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
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                      asChild={item.items.length === 0}
                    >
                      {item.items.length === 0 ? (
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      ) : (
                        <>
                          <item.icon />
                          <span>{item.title}</span>
                        </>
                      )}
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
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
          </div>
          <SidebarInput placeholder="Buscar..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {activeItem?.items && activeItem.items.length > 0 ? (
                <SidebarMenu>
                  {activeItem.items.map((subItem) => {
                    const isActive = pathname === subItem.url || pathname.startsWith(subItem.url + '/')
                    return (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <a
                            href={subItem.url}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                          >
                            <span className="font-medium">{subItem.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  Nenhum subitem disponível
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
