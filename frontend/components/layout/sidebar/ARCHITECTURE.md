# Arquitetura do Sidebar Modular

## 🏗️ Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    app-sidebar.tsx                          │
│                  (Componente Principal)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Importa e Orquestra:                               │   │
│  │  • Dados (data.ts)                                  │   │
│  │  • Hooks (hooks/)                                   │   │
│  │  • Componentes (components/)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Estrutura JSX:                                     │   │
│  │  • Sidebar Principal (ícones)                       │   │
│  │  • Sidebar Secundário (conteúdo)                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ importa
                            ▼
        ┌───────────────────────────────────────┐
        │         sidebar/ (Módulos)            │
        └───────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌────────┐         ┌─────────┐        ┌────────────┐
   │ types  │         │  data   │        │   hooks/   │
   │  .ts   │         │  .ts    │        │            │
   └────────┘         └─────────┘        └────────────┘
        │                   │                   │
        │                   │                   ├─ use-active-item.ts
        │                   │                   ├─ use-open-groups.ts
        │                   │                   └─ use-global-search.ts
        │                   │
        │                   │            ┌────────────┐
        │                   │            │components/ │
        │                   │            └────────────┘
        │                   │                   │
        │                   │                   ├─ sidebar-header-content.tsx
        │                   │                   ├─ search-result-item.tsx
        │                   │                   ├─ section-header.tsx
        │                   │                   ├─ nav-item-link.tsx
        │                   │                   ├─ nav-group-collapsible.tsx
        │                   │                   ├─ sidebar-main-menu.tsx
        │                   │                   └─ sidebar-content-area.tsx
        │                   │
        └───────────────────┴───────────────────┘
                            │
                    Todos usam types.ts
```

## 📊 Fluxo de Dados

```
┌──────────────┐
│   Usuário    │
└──────┬───────┘
       │
       │ interage
       ▼
┌──────────────────────────────────────────┐
│         app-sidebar.tsx                  │
│  ┌────────────────────────────────────┐  │
│  │  Handlers:                         │  │
│  │  • handleMainMenuItemClick()       │  │
│  │  • handleSearchResultClick()       │  │
│  │  • handleToggleGroup()             │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               │ usa
               ▼
┌──────────────────────────────────────────┐
│           Hooks (Estado)                 │
│  ┌────────────────────────────────────┐  │
│  │  useActiveItem()                   │  │
│  │  • activeItem                      │  │
│  │  • setActiveItem                   │  │
│  │  • setManuallySetActiveItem        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  useOpenGroups()                   │  │
│  │  • openGroups                      │  │
│  │  • setOpenGroups                   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  useGlobalSearch()                 │  │
│  │  • searchQuery                     │  │
│  │  • setSearchQuery                  │  │
│  │  • globalSearchResults             │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               │ passa props
               ▼
┌──────────────────────────────────────────┐
│      Componentes (Apresentação)          │
│  ┌────────────────────────────────────┐  │
│  │  SidebarMainMenu                   │  │
│  │  SidebarHeaderContent              │  │
│  │  SidebarContentArea                │  │
│  │    ├─ SearchResultItem             │  │
│  │    ├─ SectionHeader                │  │
│  │    ├─ NavItemLink                  │  │
│  │    └─ NavGroupCollapsible          │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               │ renderiza
               ▼
┌──────────────────────────────────────────┐
│              UI Final                    │
└──────────────────────────────────────────┘
```

## 🔄 Ciclo de Vida

### 1. Inicialização

```
app-sidebar.tsx monta
    │
    ├─> useActiveItem(pathname) inicializa
    │   └─> Calcula item ativo baseado na URL
    │
    ├─> useOpenGroups(pathname, activeItem) inicializa
    │   └─> Calcula quais grupos devem estar abertos
    │
    └─> useGlobalSearch() inicializa
        └─> searchQuery = ""
```

### 2. Navegação (URL muda)

```
pathname muda
    │
    ├─> useActiveItem detecta mudança
    │   ├─> Recalcula item ativo
    │   └─> Atualiza activeItem
    │
    └─> useOpenGroups detecta mudança
        ├─> Recalcula grupos abertos
        └─> Atualiza openGroups
```

### 3. Busca

```
Usuário digita no campo de busca
    │
    ├─> setSearchQuery(valor)
    │
    └─> useGlobalSearch recalcula
        ├─> Busca em todos os itens
        └─> Retorna globalSearchResults
            │
            └─> SidebarContentArea renderiza resultados
```

### 4. Clique em Item do Menu

```
Usuário clica em ícone do menu
    │
    └─> handleMainMenuItemClick(item)
        ├─> setActiveItem(item)
        ├─> setManuallySetActiveItem(true)
        ├─> setOpen(true)
        └─> setSearchQuery("")
```

## 🎯 Responsabilidades

### `app-sidebar.tsx` (Orquestrador)
- ✅ Estrutura JSX principal
- ✅ Coordena hooks e componentes
- ✅ Define handlers de eventos
- ✅ Passa props para componentes filhos
- ❌ NÃO contém lógica de negócio
- ❌ NÃO manipula dados diretamente

### `types.ts` (Contratos)
- ✅ Define interfaces TypeScript
- ✅ Fornece type guards
- ✅ Garante type safety
- ❌ NÃO contém lógica
- ❌ NÃO contém dados

### `data.ts` (Fonte de Dados)
- ✅ Contém dados de navegação
- ✅ Exporta sidebarData
- ❌ NÃO contém lógica
- ❌ NÃO manipula estado

### `hooks/` (Lógica de Estado)
- ✅ Gerencia estado React
- ✅ Contém lógica de negócio
- ✅ Usa useMemo, useEffect, etc.
- ✅ Retorna estado e setters
- ❌ NÃO renderiza JSX
- ❌ NÃO acessa DOM diretamente

### `components/` (Apresentação)
- ✅ Renderiza JSX
- ✅ Recebe props
- ✅ Componentes puros quando possível
- ❌ NÃO gerencia estado global
- ❌ NÃO contém lógica de negócio complexa

## 📦 Dependências

```
app-sidebar.tsx
    ├── React (useState, useEffect, etc.)
    ├── Next.js (Link, usePathname)
    ├── Lucide Icons (Command)
    ├── UI Components (@/components/ui/*)
    ├── NavUser (@/components/layout/nav-user)
    └── Módulos Locais
        ├── sidebar/data
        ├── sidebar/types
        ├── sidebar/hooks
        └── sidebar/components

sidebar/hooks/*
    ├── React (useState, useEffect, useMemo, useCallback)
    ├── sidebar/types
    └── sidebar/data

sidebar/components/*
    ├── React
    ├── Next.js (Link)
    ├── UI Components (@/components/ui/*)
    ├── sidebar/types
    └── sidebar/data (alguns componentes)
```

## 🧪 Testabilidade

### Hooks (Fácil de Testar)
```typescript
import { renderHook } from '@testing-library/react-hooks'
import { useActiveItem } from './use-active-item'

test('should return correct active item', () => {
  const { result } = renderHook(() => useActiveItem('/produtos'))
  expect(result.current.activeItem.title).toBe('Produtos')
})
```

### Componentes (Fácil de Testar)
```typescript
import { render } from '@testing-library/react'
import { SectionHeader } from './section-header'

test('should render section title', () => {
  const { getByText } = render(<SectionHeader title="VENDAS" />)
  expect(getByText('VENDAS')).toBeInTheDocument()
})
```

### Integração (Testar app-sidebar.tsx)
```typescript
import { render } from '@testing-library/react'
import { AppSidebar } from './app-sidebar'

test('should render sidebar with navigation', () => {
  const { getByText } = render(<AppSidebar />)
  expect(getByText('Dashboard')).toBeInTheDocument()
})
```

## 🚀 Benefícios da Arquitetura

1. **Separação de Responsabilidades**: Cada módulo tem um propósito claro
2. **Manutenibilidade**: Fácil encontrar e modificar código
3. **Testabilidade**: Hooks e componentes testáveis isoladamente
4. **Reutilização**: Componentes e hooks podem ser usados em outros lugares
5. **Type Safety**: TypeScript garante consistência
6. **Escalabilidade**: Fácil adicionar novos recursos
7. **Legibilidade**: Código limpo e organizado
8. **Performance**: Memoização adequada nos hooks

