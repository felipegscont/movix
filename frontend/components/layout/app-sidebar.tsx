"use client"

import * as React from "react"
import Link from "next/link"
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
  Command,
  ChevronRight,
  Database
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

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
      title: "Clientes",
      url: "/clientes",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Todos os Clientes",
          url: "/clientes",
        },
        {
          title: "Funil de Vendas",
          url: "/clientes/funil",
        },
        {
          title: "Segmentação",
          url: "/clientes/segmentacao",
        },
        {
          title: "Histórico de Compras",
          url: "/clientes/historico",
        },
        {
          title: "Análise de Clientes",
          url: "/clientes/analise",
        },
        {
          title: "Comunicação",
          url: "/clientes/comunicacao",
        },
      ],
    },
    {
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Building2,
      isActive: false,
      items: [
        {
          title: "Lista de Fornecedores",
          url: "/fornecedores",
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
          url: "/produtos",
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
          title: "Serviços",
          url: "/produtos/servicos",
        },
        {
          title: "Combos",
          url: "/produtos/combos",
        },
        {
          title: "Etiquetas",
          url: "/produtos/etiquetas",
        },
      ],
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
        {
          title: "Lista de Preços",
          url: "/vendas/precos",
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
          title: "NF-e",
          url: "/fiscal/nfe",
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
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "EMPRESA",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Dados da Empresa",
          url: "/configuracoes/empresa/geral",
        },
        {
          title: "Funcionários",
          url: "/configuracoes/empresa/funcionarios",
        },
        {
          title: "Usuários",
          url: "/configuracoes/empresa/usuarios",
        },
        {
          title: "Permissões",
          url: "/configuracoes/empresa/permissoes",
        },
        {
          title: "FISCAL",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Configurações Fiscais",
          url: "/configuracoes/fiscal/geral",
        },
        {
          title: "NF-e",
          url: "/configuracoes/fiscal/nfe",
        },
        {
          title: "NFC-e",
          url: "/configuracoes/fiscal/nfce",
        },
        {
          title: "CT-e",
          url: "/configuracoes/fiscal/cte",
        },
        {
          title: "MDF-e",
          url: "/configuracoes/fiscal/mdfe",
        },
        {
          title: "NFS-e",
          url: "/configuracoes/fiscal/nfse",
        },
        {
          title: "Matrizes Fiscais",
          url: "/configuracoes/fiscal/matrizes-fiscais",
        },
        {
          title: "Naturezas de Operação",
          url: "/configuracoes/fiscal/naturezas-operacao",
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
          // Verificar se o subitem tem subitens aninhados (grupos)
          if (subItem.items && subItem.items.length > 0) {
            for (const nestedItem of subItem.items) {
              if (pathname.startsWith(nestedItem.url)) {
                return item
              }
            }
          }
        }
      }
    }
    // Se não encontrar, retornar o primeiro item (Dashboard)
    return data.navMain[0]
  }, [pathname])

  const [activeItem, setActiveItem] = React.useState(getActiveItem())
  const [previousActiveItem, setPreviousActiveItem] = React.useState(getActiveItem())

  // Estado para controlar quais grupos estão abertos
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    activeItem?.items?.forEach((subItem) => {
      if (subItem.isGroup && subItem.items) {
        const isGroupActive = subItem.items.some(
          (item) => pathname === item.url || pathname.startsWith(item.url + '/')
        )
        initial[subItem.title] = isGroupActive
      }
    })
    return initial
  })

  // Atualizar o item ativo quando a rota mudar
  React.useEffect(() => {
    const newActiveItem = getActiveItem()
    const hasSubitems = newActiveItem.items.length > 0
    const itemChanged = previousActiveItem?.title !== newActiveItem.title

    setActiveItem(newActiveItem)

    // Atualizar grupos abertos baseado na rota atual
    const newOpenGroups: Record<string, boolean> = {}
    newActiveItem?.items?.forEach((subItem) => {
      if (subItem.isGroup && subItem.items) {
        const isGroupActive = subItem.items.some(
          (item) => pathname === item.url || pathname.startsWith(item.url + '/')
        )
        newOpenGroups[subItem.title] = isGroupActive
      }
    })
    setOpenGroups(newOpenGroups)

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
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
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
                    // Se o subitem é um grupo colapsável
                    if (subItem.isGroup && subItem.items && subItem.items.length > 0) {
                      const isOpen = openGroups[subItem.title] || false

                      const handleToggle = (open: boolean) => {
                        setOpenGroups(prev => ({
                          ...prev,
                          [subItem.title]: open
                        }))
                      }

                      return (
                        <Collapsible
                          key={subItem.url || `group-${subItem.title}`}
                          open={isOpen}
                          onOpenChange={handleToggle}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between gap-2 px-4 py-3 text-sm leading-tight"
                              >
                                <span className="font-medium">{subItem.title}</span>
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
                                {subItem.items.map((nestedItem) => {
                                  // Lógica de ativação mais precisa:
                                  // 1. Comparação exata com a URL
                                  // 2. OU pathname começa com a URL + '/' (para rotas filhas como /produtos/[id])
                                  // 3. MAS não ativa se houver uma URL mais específica que também combina
                                  const exactMatch = pathname === nestedItem.url
                                  const childMatch = pathname.startsWith(nestedItem.url + '/')

                                  // Verifica se existe outro item com URL mais específica que também combina
                                  const hasMoreSpecificMatch = subItem.items.some(
                                    (otherItem) =>
                                      otherItem.url !== nestedItem.url &&
                                      otherItem.url.startsWith(nestedItem.url) &&
                                      (pathname === otherItem.url || pathname.startsWith(otherItem.url + '/'))
                                  )

                                  const isActive = (exactMatch || childMatch) && !hasMoreSpecificMatch

                                  return (
                                    <SidebarMenuItem key={nestedItem.url || `nested-${nestedItem.title}`}>
                                      <SidebarMenuButton asChild isActive={isActive}>
                                        <Link
                                          href={nestedItem.url}
                                          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 py-3 pl-3 pr-4 text-sm leading-tight"
                                        >
                                          <span>{nestedItem.title}</span>
                                        </Link>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  )
                                })}
                              </SidebarMenu>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      )
                    }

                    // Cabeçalho de seção
                    if (subItem.isSectionHeader) {
                      return (
                        <div key={`section-${subItem.title}`} className="px-4 pt-4 pb-2">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {subItem.title}
                          </div>
                        </div>
                      )
                    }

                    // Subitem normal (sem grupo)
                    // Lógica de ativação mais precisa:
                    // 1. Comparação exata com a URL
                    // 2. OU pathname começa com a URL + '/' (para rotas filhas)
                    // 3. MAS não ativa se houver uma URL mais específica que também combina
                    const exactMatch = pathname === subItem.url
                    const childMatch = pathname.startsWith(subItem.url + '/')

                    // Verifica se existe outro item com URL mais específica que também combina
                    const hasMoreSpecificMatch = activeItem.items.some(
                      (otherItem) =>
                        !otherItem.isSectionHeader &&
                        otherItem.url !== subItem.url &&
                        otherItem.url.startsWith(subItem.url) &&
                        (pathname === otherItem.url || pathname.startsWith(otherItem.url + '/'))
                    )

                    const isActive = (exactMatch || childMatch) && !hasMoreSpecificMatch

                    return (
                      <SidebarMenuItem key={subItem.url || `item-${subItem.title}`}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={subItem.url}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 border-b px-4 py-3 text-sm leading-tight last:border-b-0"
                          >
                            <span className="font-medium">{subItem.title}</span>
                          </Link>
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
