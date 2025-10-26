# 📁 Estrutura de Componentes - Frontend

Organização dos componentes React do projeto Movix NFe.

---

## 📋 Estrutura de Pastas

```
components/
├── cadastros/              # Componentes de cadastros
│   ├── clientes/          # Componentes específicos de clientes
│   ├── fornecedores/      # Componentes específicos de fornecedores
│   ├── produtos/          # Componentes específicos de produtos
│   └── matriz-fiscal/     # Componentes de matriz fiscal
│
├── configuracoes/         # Componentes de configurações
│   ├── emitente/         # Configurações de emitente
│   ├── fiscal/           # Configurações fiscais
│   └── natureza-operacao/ # Naturezas de operação
│
├── dashboard/             # Componentes do dashboard
│   ├── chart-area-interactive.tsx
│   ├── data-table.tsx
│   └── section-cards.tsx
│
├── data-table-filter/     # Sistema de filtros de tabelas
│   ├── components/       # Componentes do filtro
│   ├── core/            # Lógica core
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Utilitários
│   ├── locales/         # Traduções
│   └── ui/              # Componentes UI
│
├── layout/                # Componentes de layout
│   ├── app-sidebar.tsx   # Sidebar principal
│   ├── nav-user.tsx      # Navegação do usuário
│   └── index.ts          # Barrel export
│
├── nfe/                   # Componentes de NFe
│   ├── steps/            # Steps do wizard
│   ├── nfe-wizard.tsx    # Wizard principal
│   ├── nfe-data-table.tsx
│   └── ...
│
├── providers/             # 🆕 Providers e contextos globais
│   ├── theme-provider.tsx # Provider de tema
│   └── index.ts          # Barrel export
│
├── shared/                # 🆕 Componentes compartilhados
│   ├── combobox/         # Combobox reutilizável
│   ├── theme-toggle.tsx  # Toggle de tema
│   └── index.ts          # Barrel export
│
├── ui/                    # Componentes UI (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
│
└── vendas/                # Componentes de vendas
    ├── orcamentos/       # Orçamentos
    └── pedidos/          # Pedidos
```

---

## 🎯 Convenções de Organização

### 1. **Componentes de Domínio** (`cadastros/`, `configuracoes/`, `nfe/`, `vendas/`)
Componentes específicos de um módulo de negócio.

**Exemplo:**
```tsx
// components/cadastros/clientes/clientes-data-table.tsx
export function ClientesDataTable() { ... }
```

**Uso:**
```tsx
import { ClientesDataTable } from "@/components/cadastros/clientes/clientes-data-table"
```

---

### 2. **Providers** (`providers/`)
Componentes de contexto e providers globais da aplicação.

**Quando usar:**
- Providers de tema
- Providers de autenticação
- Providers de estado global
- Context providers

**Exemplo:**
```tsx
// components/providers/theme-provider.tsx
export function ThemeProvider({ children }) { ... }
```

**Uso:**
```tsx
import { ThemeProvider } from "@/components/providers"
```

---

### 3. **Shared** (`shared/`)
Componentes compartilhados e reutilizáveis em toda a aplicação.

**Quando usar:**
- Componentes usados em múltiplos módulos
- Componentes genéricos e reutilizáveis
- Wrappers de bibliotecas externas
- Componentes de utilidade

**Exemplo:**
```tsx
// components/shared/theme-toggle.tsx
export function ThemeToggle() { ... }
```

**Uso:**
```tsx
import { ThemeToggle } from "@/components/shared"
```

---

### 4. **UI** (`ui/`)
Componentes primitivos de UI (shadcn/ui).

**Quando usar:**
- Componentes base do design system
- Componentes do shadcn/ui
- Componentes primitivos reutilizáveis

**Exemplo:**
```tsx
// components/ui/button.tsx
export function Button({ ... }) { ... }
```

**Uso:**
```tsx
import { Button } from "@/components/ui/button"
```

---

### 5. **Layout** (`layout/`)
Componentes de estrutura e layout da aplicação.

**Quando usar:**
- Sidebars
- Headers
- Footers
- Navegação
- Estruturas de página

**Exemplo:**
```tsx
// components/layout/app-sidebar.tsx
export function AppSidebar() { ... }
```

**Uso:**
```tsx
import { AppSidebar } from "@/components/layout"
```

---

## 📦 Barrel Exports (index.ts)

Use arquivos `index.ts` para facilitar imports:

```typescript
// components/providers/index.ts
export { ThemeProvider } from './theme-provider'
export { AuthProvider } from './auth-provider'

// components/shared/index.ts
export { ThemeToggle } from './theme-toggle'
export { LoadingSpinner } from './loading-spinner'
```

**Benefícios:**
- Imports mais limpos
- Facilita refatoração
- Melhor organização

---

## 🔄 Migração Realizada

### Antes:
```
components/
├── theme-provider.tsx  ❌ Na raiz
└── theme-toggle.tsx    ❌ Na raiz
```

### Depois:
```
components/
├── providers/
│   ├── theme-provider.tsx  ✅ Organizado
│   └── index.ts
└── shared/
    ├── theme-toggle.tsx    ✅ Organizado
    └── index.ts
```

### Imports Atualizados:

**Antes:**
```tsx
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
```

**Depois:**
```tsx
import { ThemeProvider } from "@/components/providers"
import { ThemeToggle } from "@/components/shared"
```

---

## 🎨 Boas Práticas

### 1. **Nomenclatura**
- Componentes: `PascalCase` (ex: `ClienteForm.tsx`)
- Arquivos: `kebab-case` (ex: `cliente-form.tsx`)
- Pastas: `kebab-case` (ex: `cadastros/clientes/`)

### 2. **Organização por Funcionalidade**
Agrupe componentes relacionados em pastas:

```
components/cadastros/clientes/
├── clientes-data-table.tsx
├── clientes-form.tsx
├── clientes-filters.tsx
└── index.ts
```

### 3. **Evite Componentes Órfãos**
Não deixe componentes soltos na raiz de `components/`. Sempre coloque em uma pasta apropriada.

### 4. **Use Barrel Exports**
Crie `index.ts` para facilitar imports de múltiplos componentes.

### 5. **Documentação**
Adicione comentários JSDoc em componentes complexos:

```tsx
/**
 * Formulário de cadastro de clientes
 * 
 * @param onSubmit - Callback executado ao submeter o formulário
 * @param initialData - Dados iniciais para edição
 */
export function ClienteForm({ onSubmit, initialData }) { ... }
```

---

## 📚 Referências

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [React Component Patterns](https://react.dev/learn/thinking-in-react)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Última Atualização**: 26/10/2025  
**Versão**: 1.0

