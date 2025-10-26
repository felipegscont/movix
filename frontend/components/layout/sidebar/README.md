# Sidebar Modular - Documentação

## 📁 Estrutura de Arquivos

```
components/layout/
├── app-sidebar.tsx                     # ⭐ Componente principal (MANTIDO)
└── sidebar/                            # Módulos auxiliares
    ├── README.md                       # Esta documentação
    ├── types.ts                        # Definições de tipos TypeScript
    ├── data.ts                         # Dados de navegação do sistema
    ├── hooks/                          # Hooks customizados
    │   ├── index.ts                    # Exportações dos hooks
    │   ├── use-active-item.ts          # Gerencia item ativo baseado na URL
    │   ├── use-open-groups.ts          # Gerencia grupos colapsáveis
    │   └── use-global-search.ts        # Busca global no sidebar
    └── components/                     # Componentes reutilizáveis
        ├── index.ts                    # Exportações dos componentes
        ├── sidebar-header-content.tsx  # Conteúdo do cabeçalho
        ├── search-result-item.tsx      # Item de resultado de busca
        ├── section-header.tsx          # Cabeçalho de seção
        ├── nav-item-link.tsx           # Link de item de navegação
        ├── nav-group-collapsible.tsx   # Grupo colapsável
        ├── sidebar-main-menu.tsx       # Menu principal (ícones)
        └── sidebar-content-area.tsx    # Área de conteúdo principal
```

## 🎯 Filosofia da Modularização

O arquivo principal `app-sidebar.tsx` foi **mantido** como ponto de entrada, mas agora:
- ✅ É limpo e legível (~170 linhas vs ~870 linhas)
- ✅ Importa lógica de módulos auxiliares
- ✅ Mantém a estrutura JSX principal visível
- ✅ Não quebra importações existentes

## 🎯 Benefícios da Modularização

### 1. **Separação de Responsabilidades**
- **Types**: Tipos TypeScript bem definidos com type guards
- **Data**: Dados de navegação isolados e fáceis de manter
- **Hooks**: Lógica de estado reutilizável e testável
- **Components**: Componentes pequenos e focados

### 2. **Manutenibilidade**
- Código organizado em arquivos pequenos (<150 linhas)
- Fácil localizar e modificar funcionalidades específicas
- Reduz acoplamento entre componentes

### 3. **Testabilidade**
- Hooks podem ser testados isoladamente
- Componentes pequenos são mais fáceis de testar
- Type guards facilitam testes de tipos

### 4. **Reutilização**
- Componentes podem ser usados em outros contextos
- Hooks podem ser compartilhados
- Types garantem consistência

### 5. **Type Safety**
- Tipos bem definidos eliminam erros de TypeScript
- Type guards (`isSectionHeader`, `isNavGroup`, `isNavItem`)
- Autocompletar melhorado no IDE

## 📚 Guia de Uso

### Importação Básica

```typescript
// O componente principal continua sendo importado do mesmo lugar
import { AppSidebar } from "@/components/layout/app-sidebar"

// Usar no layout
<AppSidebar />
```

### Tipos Disponíveis

```typescript
// Importar tipos dos módulos auxiliares
import {
  NavItem,           // Item de navegação básico
  SectionHeader,     // Cabeçalho de seção
  NavGroup,          // Grupo colapsável
  SubItem,           // União de todos os tipos
  NavMainItem,       // Item principal do menu
  SearchResult,      // Resultado de busca
  isSectionHeader,   // Type guard
  isNavGroup,        // Type guard
  isNavItem          // Type guard
} from "@/components/layout/sidebar/types"
```

### Modificar Dados de Navegação

Edite o arquivo `data.ts`:

```typescript
// frontend/components/layout/sidebar/data.ts
export const sidebarData: SidebarData = {
  user: { ... },
  navMain: [
    {
      title: "Novo Módulo",
      url: "/novo-modulo",
      icon: IconComponent,
      isActive: false,
      items: [
        {
          title: "Item 1",
          url: "/novo-modulo/item1",
          description: "Descrição do item"
        }
      ]
    }
  ]
}
```

### Criar Novo Hook

```typescript
// frontend/components/layout/sidebar/hooks/use-custom-hook.ts
import { useState } from "react"

export function useCustomHook() {
  const [state, setState] = useState()
  
  // Lógica do hook
  
  return { state, setState }
}
```

### Criar Novo Componente

```typescript
// frontend/components/layout/sidebar/components/custom-component.tsx
import { NavItem } from "../types"

interface CustomComponentProps {
  item: NavItem
}

export function CustomComponent({ item }: CustomComponentProps) {
  return <div>{item.title}</div>
}
```

## 🔧 Hooks Disponíveis

### `useActiveItem(pathname: string)`
Gerencia o item ativo do sidebar baseado na URL atual.

**Retorna:**
- `activeItem`: Item atualmente ativo
- `setActiveItem`: Função para definir item ativo
- `setManuallySetActiveItem`: Marca se foi definido manualmente

### `useOpenGroups(pathname: string, activeItem: NavMainItem | null)`
Gerencia quais grupos colapsáveis estão abertos/fechados.

**Retorna:**
- `openGroups`: Record com estado de cada grupo
- `setOpenGroups`: Função para atualizar grupos

### `useGlobalSearch()`
Implementa busca global em todos os itens do menu.

**Retorna:**
- `searchQuery`: Query de busca atual
- `setSearchQuery`: Função para atualizar query
- `globalSearchResults`: Resultados da busca

## 🧩 Componentes Disponíveis

### `SidebarHeaderContent`
Exibe título do módulo ativo ou resultados de busca.

### `SearchResultItem`
Renderiza um item de resultado de busca.

### `SectionHeader`
Cabeçalho de seção no menu.

### `NavItemLink`
Link de item de navegação com lógica de ativação.

### `NavGroupCollapsible`
Grupo colapsável de itens.

### `SidebarMainMenu`
Menu principal com ícones laterais.

### `SidebarContentArea`
Área principal de conteúdo (busca ou itens).

## 🎨 Customização

### Adicionar Novo Tipo de Item

1. Defina o tipo em `types.ts`:
```typescript
export interface CustomItem {
  title: string
  url: string
  isCustom: true
  customProp: string
}
```

2. Adicione ao union type:
```typescript
export type SubItem = NavItem | SectionHeader | NavGroup | CustomItem
```

3. Crie type guard:
```typescript
export function isCustomItem(item: SubItem): item is CustomItem {
  return 'isCustom' in item && item.isCustom === true
}
```

4. Use no componente:
```typescript
if (isCustomItem(subItem)) {
  return <CustomItemComponent item={subItem} />
}
```

## 🚀 Próximos Passos

1. **Testes**: Adicionar testes unitários para hooks e componentes
2. **Storybook**: Documentar componentes visualmente
3. **Performance**: Memoização adicional se necessário
4. **Acessibilidade**: Melhorar ARIA labels e navegação por teclado
5. **Animações**: Adicionar transições suaves

## 📝 Estrutura do Código

### Arquivo Principal: `app-sidebar.tsx`

O componente principal mantém a estrutura JSX e orquestra os módulos:

```typescript
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpen } = useSidebar()

  // Hooks customizados (lógica extraída)
  const { activeItem, setActiveItem, setManuallySetActiveItem } = useActiveItem(pathname)
  const { openGroups, setOpenGroups } = useOpenGroups(pathname, activeItem)
  const { searchQuery, setSearchQuery, globalSearchResults } = useGlobalSearch()

  // Handlers (lógica de eventos)
  const handleMainMenuItemClick = (item: NavMainItem) => { ... }
  const handleSearchResultClick = (module: NavMainItem, parentTitle?: string) => { ... }
  const handleToggleGroup = (title: string, open: boolean) => { ... }

  // JSX (estrutura visual mantida aqui)
  return (
    <Sidebar>
      {/* Sidebar principal (ícones) */}
      <Sidebar>...</Sidebar>

      {/* Sidebar secundário (conteúdo) */}
      <Sidebar>...</Sidebar>
    </Sidebar>
  )
}
```

### Vantagens desta Abordagem

1. **Ponto de Entrada Único**: `app-sidebar.tsx` continua sendo o arquivo principal
2. **Importações Não Quebram**: Código existente continua funcionando
3. **Lógica Separada**: Hooks e componentes em módulos auxiliares
4. **Fácil Manutenção**: Cada módulo tem responsabilidade única
5. **Testabilidade**: Hooks e componentes podem ser testados isoladamente

## 🐛 Troubleshooting

### Erro de tipo em `subItem.items`
Use os type guards:
```typescript
if (isNavGroup(subItem)) {
  // Agora TypeScript sabe que subItem.items existe
  subItem.items.map(...)
}
```

### Item não está ativo
Verifique a lógica de matching em `use-active-item.ts`.
A URL deve corresponder exatamente ou começar com a URL do item + `/`.

### Grupo não abre automaticamente
Verifique se o pathname corresponde a algum item dentro do grupo.
A lógica está em `use-open-groups.ts`.

## 📖 Referências

- [React Hooks](https://react.dev/reference/react)
- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Next.js Navigation](https://nextjs.org/docs/app/building-your-application/routing)

