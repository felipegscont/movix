# 🚀 Navegação Sem Reload no Next.js 15 (2025)

**Guia Completo de Boas Práticas Atualizadas**

---

## 📋 ÍNDICE

1. [Componente `<Link>`](#1-componente-link)
2. [Hook `useRouter`](#2-hook-userouter)
3. [Prefetching Automático](#3-prefetching-automático)
4. [Client-Side Transitions](#4-client-side-transitions)
5. [History API Nativa](#5-history-api-nativa)
6. [Otimizações de Performance](#6-otimizações-de-performance)
7. [Implementação no Projeto](#7-implementação-no-projeto)

---

## 1. COMPONENTE `<Link>`

### ✅ **Melhor Prática (2025)**

O componente `<Link>` do Next.js é a forma **RECOMENDADA** para navegação sem reload.

```tsx
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      {/* ✅ CORRETO: Usa Link do Next.js */}
      <Link href="/clientes">Clientes</Link>
      <Link href="/produtos">Produtos</Link>
      
      {/* ❌ ERRADO: Tag <a> causa reload completo */}
      <a href="/clientes">Clientes</a>
    </nav>
  )
}
```

### 🎯 **Benefícios do `<Link>`**

1. **Client-side navigation**: Sem reload da página
2. **Prefetching automático**: Carrega rotas em background
3. **Mantém estado**: Preserva estado da aplicação
4. **Scroll otimizado**: Gerencia scroll position automaticamente
5. **Transições suaves**: Experiência de SPA

### 📝 **Propriedades Importantes**

```tsx
<Link 
  href="/produtos"           // URL de destino
  prefetch={true}            // Prefetch automático (padrão: true)
  replace={false}            // Substitui histórico (padrão: false)
  scroll={true}              // Scroll para topo (padrão: true)
  shallow={false}            // Shallow routing (App Router não usa)
>
  Produtos
</Link>
```

---

## 2. HOOK `useRouter`

### ✅ **Navegação Programática**

Use `useRouter` do `next/navigation` (App Router) para navegação programática:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function MyComponent() {
  const router = useRouter()

  const handleNavigate = () => {
    // ✅ Navegação sem reload
    router.push('/clientes')
  }

  const handleReplace = () => {
    // ✅ Substitui entrada no histórico
    router.replace('/produtos')
  }

  const handleBack = () => {
    // ✅ Volta na navegação
    router.back()
  }

  const handleRefresh = () => {
    // ✅ Atualiza dados sem reload completo
    router.refresh()
  }

  return (
    <div>
      <button onClick={handleNavigate}>Ir para Clientes</button>
      <button onClick={handleBack}>Voltar</button>
    </div>
  )
}
```

### 🔑 **Métodos Principais**

| Método | Descrição | Uso |
|--------|-----------|-----|
| `router.push(url)` | Navega para URL | Navegação normal |
| `router.replace(url)` | Substitui histórico | Redirecionamentos |
| `router.back()` | Volta uma página | Botão voltar |
| `router.forward()` | Avança uma página | Botão avançar |
| `router.refresh()` | Atualiza dados | Revalidação |
| `router.prefetch(url)` | Prefetch manual | Otimização |

---

## 3. PREFETCHING AUTOMÁTICO

### 🚀 **Como Funciona (Next.js 15)**

O Next.js **automaticamente** faz prefetch de rotas quando:

1. **Link entra no viewport** (visível na tela)
2. **Hover sobre o link** (mouse sobre)
3. **Rotas estáticas**: Prefetch completo
4. **Rotas dinâmicas**: Prefetch parcial (com `loading.tsx`)

### ✅ **Rotas Estáticas**

```tsx
// ✅ Prefetch completo automático
<Link href="/clientes">Clientes</Link>
<Link href="/produtos">Produtos</Link>
```

### ⚡ **Rotas Dinâmicas**

```tsx
// ⚡ Prefetch parcial (loading.tsx)
<Link href="/clientes/123">Cliente 123</Link>

// Para melhorar, crie loading.tsx:
// app/clientes/[id]/loading.tsx
export default function Loading() {
  return <Skeleton />
}
```

### 🎛️ **Controle de Prefetch**

```tsx
// Desabilitar prefetch (economizar recursos)
<Link href="/relatorios" prefetch={false}>
  Relatórios
</Link>

// Prefetch apenas no hover
function HoverPrefetchLink({ href, children }) {
  const [active, setActive] = useState(false)
  
  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

---

## 4. CLIENT-SIDE TRANSITIONS

### 🎯 **O Que São**

Client-side transitions permitem navegação **sem reload completo**:

- ✅ Mantém layouts compartilhados
- ✅ Preserva estado da aplicação
- ✅ Atualiza apenas o conteúdo que mudou
- ✅ Experiência de SPA (Single Page App)

### 📊 **Fluxo de Navegação**

```
Usuário clica em Link
    ↓
Next.js verifica se rota está prefetched
    ↓
SIM: Transição instantânea
NÃO: Busca no servidor (com loading.tsx)
    ↓
Atualiza apenas o conteúdo necessário
    ↓
Mantém layouts e estado
```

### ✅ **Exemplo Prático**

```tsx
// app/layout.tsx (mantido durante navegação)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Sidebar /> {/* ✅ Não recarrega */}
        <Header />  {/* ✅ Não recarrega */}
        {children}  {/* ✅ Apenas isso muda */}
      </body>
    </html>
  )
}
```

---

## 5. HISTORY API NATIVA

### 🆕 **Novidade Next.js 15 (2025)**

Agora você pode usar a **History API nativa** integrada com Next.js:

### ✅ **`window.history.pushState`**

Adiciona entrada no histórico **sem reload**:

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function FilterProducts() {
  const searchParams = useSearchParams()

  const updateFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    
    // ✅ Atualiza URL sem reload
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <button onClick={() => updateFilter('eletronicos')}>
      Eletrônicos
    </button>
  )
}
```

### ✅ **`window.history.replaceState`**

Substitui entrada atual (sem voltar):

```tsx
'use client'

export function LocaleSwitcher() {
  const switchLocale = (locale: string) => {
    const newPath = `/${locale}${pathname}`
    
    // ✅ Substitui URL sem adicionar ao histórico
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('pt')}>Português</button>
      <button onClick={() => switchLocale('en')}>English</button>
    </>
  )
}
```

### 🎯 **Quando Usar Cada Um**

| Método | Quando Usar | Exemplo |
|--------|-------------|---------|
| `pushState` | Usuário pode voltar | Filtros, ordenação |
| `replaceState` | Não deve voltar | Troca de idioma, modais |

---

## 6. OTIMIZAÇÕES DE PERFORMANCE

### ⚡ **1. Loading States**

```tsx
// app/clientes/loading.tsx
export default function Loading() {
  return <ClientesSkeleton />
}
```

### ⚡ **2. Streaming com Suspense**

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Clientes</h1>
      <Suspense fallback={<Skeleton />}>
        <ClientesList />
      </Suspense>
    </div>
  )
}
```

### ⚡ **3. Hook `useLinkStatus` (Novo 2025)**

Mostra feedback visual durante navegação:

```tsx
'use client'

import { useLinkStatus } from 'next/link'

export function LoadingIndicator() {
  const { pending } = useLinkStatus()
  
  return (
    <div className={`loading-bar ${pending ? 'active' : ''}`} />
  )
}
```

**CSS com delay:**
```css
.loading-bar {
  opacity: 0;
  transition: opacity 0.3s;
  animation-delay: 100ms; /* Só mostra se demorar >100ms */
}

.loading-bar.active {
  opacity: 1;
}
```

### ⚡ **4. Prefetch Seletivo**

```tsx
// Prefetch apenas links importantes
<Link href="/dashboard" prefetch={true}>Dashboard</Link>

// Não prefetch listas grandes
<Link href="/relatorios" prefetch={false}>Relatórios</Link>
```

---

## 7. IMPLEMENTAÇÃO NO PROJETO

### 🔧 **Corrigir Sidebar Atual**

**ANTES (❌ Causa Reload):**
```tsx
<a href="/clientes">Clientes</a>
```

**DEPOIS (✅ Sem Reload):**
```tsx
import Link from 'next/link'

<Link href="/clientes">Clientes</Link>
```

### 📝 **Atualizar `app-sidebar.tsx`**

```tsx
import Link from 'next/link'

// Substituir todas as tags <a> por <Link>
<SidebarMenuButton asChild isActive={isActive}>
  <Link href={subItem.url}>
    <span className="font-medium">{subItem.title}</span>
  </Link>
</SidebarMenuButton>
```

### ✅ **Checklist de Implementação**

- [ ] Substituir `<a>` por `<Link>` em todos os menus
- [ ] Usar `useRouter` para navegação programática
- [ ] Adicionar `loading.tsx` em rotas dinâmicas
- [ ] Implementar `useLinkStatus` para feedback visual
- [ ] Configurar prefetch seletivo
- [ ] Testar navegação sem reload

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

### ❌ **ANTES (Com Reload)**

```tsx
<a href="/clientes">Clientes</a>
```

**Problemas:**
- ❌ Reload completo da página
- ❌ Perde estado da aplicação
- ❌ Sidebar recarrega
- ❌ Flash branco na tela
- ❌ Lento e ruim UX

### ✅ **DEPOIS (Sem Reload)**

```tsx
<Link href="/clientes">Clientes</Link>
```

**Benefícios:**
- ✅ Navegação instantânea
- ✅ Mantém estado
- ✅ Sidebar não recarrega
- ✅ Transição suave
- ✅ Experiência de SPA

---

## 🎯 RESUMO EXECUTIVO

### **Use `<Link>` para:**
- ✅ Navegação entre páginas
- ✅ Menus e sidebars
- ✅ Botões de navegação
- ✅ Breadcrumbs

### **Use `useRouter` para:**
- ✅ Navegação programática
- ✅ Após submit de formulário
- ✅ Redirecionamentos condicionais
- ✅ Navegação após ações

### **Use History API para:**
- ✅ Atualizar query params
- ✅ Filtros e ordenação
- ✅ Troca de idioma
- ✅ Estados de UI na URL

---

## 📚 REFERÊNCIAS

- [Next.js 15 - Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Next.js App Router](https://nextjs.org/docs/app)
- [useLinkStatus Hook](https://nextjs.org/docs/app/api-reference/functions/useLinkStatus)
- [Prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#prefetching)

---

**Última Atualização**: 26/10/2025  
**Next.js Version**: 15.5.6  
**Status**: ✅ Práticas Atualizadas 2025

