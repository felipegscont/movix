import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  Package,
  Building2,
  Settings,
  BarChart3,
  HelpCircle,
  Command,
} from "lucide-react"
import { SidebarData } from "./types"

/**
 * Dados de navegação do sistema
 */
export const sidebarData: SidebarData = {
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
      items: [
        {
          title: "ACESSO RÁPIDO",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Visão Geral",
          url: "/dashboard",
          description: "Dashboard principal do sistema",
        },
        {
          title: "VENDAS",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Orçamentos",
          url: "/vendas/orcamentos",
          description: "Gerenciar propostas de venda",
        },
        {
          title: "Pedidos",
          url: "/vendas/pedidos",
          description: "Gerenciar pedidos de venda",
        },
        {
          title: "FISCAL",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Notas Fiscais",
          url: "/fiscal/nfe",
          description: "Gerenciar NF-e emitidas",
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
          title: "Todos os Clientes",
          url: "/clientes",
          description: "Listagem e gestão de clientes",
        },
        {
          title: "Funil de Vendas",
          url: "/clientes/funil",
          description: "Pipeline e estágios de vendas",
        },
        {
          title: "Segmentação",
          url: "/clientes/segmentacao",
          description: "Grupos e filtros de clientes",
        },
        {
          title: "Histórico de Compras",
          url: "/clientes/historico",
          description: "Timeline de interações e pedidos",
        },
        {
          title: "Análise de Clientes",
          url: "/clientes/analise",
          description: "Métricas e relatórios de clientes",
        },
        {
          title: "Comunicação",
          url: "/clientes/comunicacao",
          description: "Emails, mensagens e notificações",
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
          description: "Cadastro e gestão de fornecedores",
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
          description: "Cadastro e gestão de produtos",
        },
        {
          title: "Categorias",
          url: "/produtos/categorias",
          description: "Organização por categorias",
        },
        {
          title: "Marcas",
          url: "/produtos/marcas",
          description: "Marcas e fabricantes",
        },
        {
          title: "Unidades de Medida",
          url: "/produtos/unidades",
          description: "UN, KG, M, L, etc",
        },
        {
          title: "Serviços",
          url: "/produtos/servicos",
          description: "Cadastro de serviços",
        },
        {
          title: "Combos",
          url: "/produtos/combos",
          description: "Kits e pacotes de produtos",
        },
        {
          title: "Etiquetas",
          url: "/produtos/etiquetas",
          description: "Tags e etiquetas de produtos",
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
          description: "Propostas e cotações de vendas",
        },
        {
          title: "Pedidos",
          url: "/vendas/pedidos",
          description: "Pedidos de venda confirmados",
        },
        {
          title: "Cupons",
          url: "/vendas/cupons",
          description: "Cupons fiscais e promoções",
        },
        {
          title: "Consignados",
          url: "/vendas/consignados",
          description: "Produtos em consignação",
        },
        {
          title: "Devoluções",
          url: "/vendas/devolucoes",
          description: "Devoluções e trocas",
        },
        {
          title: "Comissões",
          url: "/vendas/comissoes",
          description: "Comissões de vendedores",
        },
        {
          title: "Lista de Preços",
          url: "/vendas/precos",
          description: "Tabelas de preços e descontos",
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
          description: "Emissão de Notas Fiscais Eletrônicas",
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
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
      isActive: false,
      items: [
        {
          title: "Vendas",
          url: "/relatorios/vendas",
          description: "Relatórios de vendas",
        },
        {
          title: "Financeiro",
          url: "/relatorios/financeiro",
          description: "Relatórios financeiros",
        },
        {
          title: "Estoque",
          url: "/relatorios/estoque",
          description: "Relatórios de estoque",
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
          description: "Informações cadastrais e endereço",
        },
        {
          title: "Funcionários",
          url: "/configuracoes/empresa/funcionarios",
          description: "Cadastro de colaboradores",
        },
        {
          title: "Usuários",
          url: "/configuracoes/empresa/usuarios",
          description: "Usuários do sistema",
        },
        {
          title: "Permissões",
          url: "/configuracoes/empresa/permissoes",
          description: "Perfis e permissões de acesso",
        },
        {
          title: "FISCAL",
          url: "",
          isSectionHeader: true,
        },
        {
          title: "Configurações Fiscais",
          url: "/configuracoes/fiscal/geral",
          description: "Configurações gerais fiscais",
        },
        {
          title: "NF-e",
          url: "/configuracoes/fiscal/nfe",
          description: "Configurar emissão de NF-e",
        },
        {
          title: "NFC-e",
          url: "/configuracoes/fiscal/nfce",
          description: "Configurar emissão de NFC-e",
        },
        {
          title: "CT-e",
          url: "/configuracoes/fiscal/cte",
          description: "Configurar emissão de CT-e",
        },
        {
          title: "MDF-e",
          url: "/configuracoes/fiscal/mdfe",
          description: "Configurar emissão de MDF-e",
        },
        {
          title: "NFS-e",
          url: "/configuracoes/fiscal/nfse",
          description: "Configurar emissão de NFS-e",
        },
        {
          title: "Matrizes Fiscais",
          url: "/configuracoes/fiscal/matrizes-fiscais",
          description: "Regras de tributação por operação",
        },
        {
          title: "Naturezas de Operação",
          url: "/configuracoes/fiscal/naturezas-operacao",
          description: "CFOPs e naturezas de operação",
        },
      ],
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

