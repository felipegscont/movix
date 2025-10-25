# 📚 Guia de Padronização - Estrutura Frontend

> **Projeto:** Movix - Sistema de Gestão Fiscal  
> **Data:** 2025-10-25  
> **Objetivo:** Padronizar nomenclatura de arquivos e organização de pastas no frontend

---

## 📋 Índice

1. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Organização de Componentes](#organização-de-componentes)
4. [Estrutura do App Router](#estrutura-do-app-router)
5. [Padrões de Código](#padrões-de-código)
6. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Convenções de Nomenclatura

### **Arquivos de Componentes**

```
✅ CORRETO (kebab-case)
- cliente-form-dialog.tsx
- clientes-data-table.tsx
- clientes-section-cards.tsx
- nfe-wizard.tsx
- produto-dados-basicos-section.tsx

❌ EVITAR (PascalCase, camelCase, snake_case)
- ClienteFormDialog.tsx
- clientesDataTable.tsx
- clientes_section_cards.tsx
```

**Regra:** Todos os arquivos de componentes devem usar **kebab-case** (palavras separadas por hífen, tudo minúsculo).

### **Nomenclatura Semântica**

#### **Padrão de Nomenclatura por Tipo**

| Tipo de Componente | Padrão | Exemplo |
|-------------------|--------|---------|
| **Formulário (Dialog)** | `{entidade}-form-dialog.tsx` | `cliente-form-dialog.tsx` |
| **Tabela de Dados** | `{entidade}s-data-table.tsx` | `clientes-data-table.tsx` |
| **Cards de Estatísticas** | `{entidade}s-section-cards.tsx` | `clientes-section-cards.tsx` |
| **Wizard/Stepper** | `{entidade}-wizard.tsx` | `nfe-wizard.tsx` |
| **Steps do Wizard** | `{entidade}-step-{nome}.tsx` | `nfe-step-geral.tsx` |
| **Seções de Formulário** | `{entidade}-{nome}-section.tsx` | `produto-tributacao-section.tsx` |
| **Componentes de Detalhes** | `{entidade}-details.tsx` | `nfe-details.tsx` |
| **Badges/Status** | `{entidade}-status-badge.tsx` | `nfe-status-badge.tsx` |
| **Breadcrumbs** | `{entidade}-breadcrumb.tsx` | `nfe-breadcrumb.tsx` |
| **Gerenciadores** | `{entidade}-{funcao}-manager.tsx` | `natureza-operacao-cfop-manager.tsx` |

### **Arquivos de Suporte**

```
✅ CORRETO
- types.ts          # Tipos TypeScript
- schema.ts         # Schemas de validação (Zod)
- constants.ts      # Constantes
- utils.ts          # Utilitários
- index.ts          # Barrel exports
```

### **Hooks Customizados**

```
✅ CORRETO
- use-cliente-form.ts
- use-clientes.ts
- use-nfe-wizard.ts
- use-mobile.ts

❌ EVITAR
- useClienteForm.ts (camelCase no nome do arquivo)
- clienteForm.hook.ts
```

### **Services**

```
✅ CORRETO
- cliente.service.ts
- nfe.service.ts
- external-api.service.ts

❌ EVITAR
- clienteService.ts
- ClienteService.ts
```

---

## 📁 Estrutura de Pastas

### **Estrutura Geral do Frontend**

```
frontend/
├── app/                          # Next.js App Router (rotas)
│   ├── (auth)/                   # Grupo de rotas autenticadas
│   ├── cadastros/                # Módulo de cadastros
│   ├── configuracoes/            # Módulo de configurações
│   ├── dashboard/                # Dashboard principal
│   ├── nfes/                     # Notas Fiscais
│   ├── matrizes-fiscais/         # Matrizes Fiscais
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial
│   └── globals.css               # Estilos globais
│
├── components/                   # Componentes React
│   ├── cadastros/                # Componentes de cadastros
│   │   ├── clientes/
│   │   ├── fornecedores/
│   │   └── produtos/
│   ├── configuracoes/            # Componentes de configurações
│   │   ├── emitente/
│   │   └── natureza-operacao/
│   ├── nfe/                      # Componentes de NFe
│   ├── layout/                   # Componentes de layout
│   ├── shared/                   # Componentes compartilhados
│   ├── ui/                       # Componentes UI base (shadcn)
│   └── data-table-filter/        # Sistema de filtros
│
├── hooks/                        # Hooks customizados
│   ├── clientes/
│   ├── fornecedores/
│   ├── produtos/
│   ├── nfe/
│   └── shared/
│
├── lib/                          # Bibliotecas e utilitários
│   ├── services/                 # Serviços de API
│   ├── schemas/                  # Schemas de validação
│   ├── utils/                    # Funções utilitárias
│   └── utils.ts                  # Utilitários gerais
│
├── types/                        # Tipos TypeScript globais
│   ├── api.types.ts
│   ├── entities.types.ts
│   └── index.ts
│
└── public/                       # Arquivos estáticos
```

---

## 🧩 Organização de Componentes

### **Estrutura de um Módulo Completo**

Cada módulo de cadastro deve seguir esta estrutura:

```
components/cadastros/{entidade}/
├── {entidade}-form-dialog.tsx        # Formulário principal (criar/editar)
├── {entidade}s-data-table.tsx        # Tabela de listagem
├── {entidade}s-section-cards.tsx     # Cards de estatísticas
├── sections/                         # Seções do formulário (se complexo)
│   ├── {entidade}-dados-basicos-section.tsx
│   ├── {entidade}-endereco-section.tsx
│   └── {entidade}-tributacao-section.tsx
├── types.ts                          # Tipos específicos do módulo
├── schema.ts                         # Schema de validação (se não estiver em lib/schemas)
└── index.ts                          # Barrel exports (opcional)
```

### **Exemplo: Módulo de Clientes**

```
components/cadastros/clientes/
├── cliente-form-dialog.tsx           # ✅ Dialog de formulário
├── clientes-data-table.tsx           # ✅ Tabela com filtros
├── clientes-section-cards.tsx        # ✅ Cards de estatísticas
└── index.ts                          # ✅ Exports centralizados

hooks/clientes/
├── use-cliente-form.ts               # ✅ Lógica do formulário
└── use-clientes.ts                   # ✅ Lógica de listagem/CRUD

lib/services/
└── cliente.service.ts                # ✅ Chamadas à API

lib/schemas/
└── cliente.schema.ts                 # ✅ Validação Zod (opcional)
```

### **Exemplo: Módulo de Produtos (Complexo)**

```
components/cadastros/produtos/
├── produto-form-dialog.tsx           # ✅ Dialog principal
├── produtos-data-table.tsx           # ✅ Tabela
├── produtos-section-cards.tsx        # ✅ Cards
├── sections/                         # ✅ Seções separadas
│   ├── produto-dados-basicos-section.tsx
│   ├── produto-estoque-section.tsx
│   ├── produto-tributacao-section.tsx
│   └── produto-outros-section.tsx
├── types.ts                          # ✅ Tipos e schemas
└── index.ts

hooks/produtos/
├── use-produto-form.ts
└── use-produtos.ts
```

### **Exemplo: Módulo de NFe (Wizard)**

```
components/nfe/
├── nfe-wizard.tsx                    # ✅ Componente principal do wizard
├── nfe-wizard-breadcrumb.tsx         # ✅ Navegação do wizard
├── nfe-data-table.tsx                # ✅ Listagem de NFes
├── nfe-section-cards.tsx             # ✅ Cards de estatísticas
├── nfe-details.tsx                   # ✅ Visualização de detalhes
├── nfe-status-badge.tsx              # ✅ Badge de status
├── nfe-add-item-quick.tsx            # ✅ Adicionar item rápido
├── nfe-edit-item-dialog.tsx          # ✅ Editar item
├── steps/                            # ✅ Steps do wizard
│   ├── nfe-step-geral.tsx
│   ├── nfe-step-itens.tsx
│   ├── nfe-step-cobranca.tsx
│   └── nfe-step-revisao.tsx
├── types.ts                          # ✅ Tipos específicos
└── index.ts

hooks/nfe/
├── use-nfe-wizard.ts                 # ✅ Lógica do wizard
├── use-nfe-form.ts                   # ✅ Lógica do formulário
├── use-nfe-items.ts                  # ✅ Gerenciamento de itens
└── use-nfe-workflow.ts               # ✅ Workflow de status

lib/schemas/
└── nfe.schema.ts                     # ✅ Validação completa
```

---

## 🗂️ Estrutura do App Router

### **Padrão de Rotas**

```
app/
├── layout.tsx                        # Layout raiz
├── page.tsx                          # Página inicial (/)
│
├── dashboard/
│   └── page.tsx                      # /dashboard
│
├── cadastros/
│   ├── clientes/
│   │   ├── page.tsx                  # /cadastros/clientes (listagem)
│   │   └── [id]/
│   │       └── page.tsx              # /cadastros/clientes/[id] (detalhes)
│   │
│   ├── fornecedores/
│   │   ├── page.tsx                  # /cadastros/fornecedores
│   │   └── [id]/
│   │       └── page.tsx              # /cadastros/fornecedores/[id]
│   │
│   └── produtos/
│       ├── page.tsx                  # /cadastros/produtos
│       └── [id]/
│           └── page.tsx              # /cadastros/produtos/[id]
│
├── configuracoes/
│   ├── emitente/
│   │   └── page.tsx                  # /configuracoes/emitente
│   │
│   └── naturezas-operacao/
│       ├── page.tsx                  # /configuracoes/naturezas-operacao
│       └── [id]/
│           └── page.tsx              # /configuracoes/naturezas-operacao/[id]
│
├── nfes/
│   ├── page.tsx                      # /nfes (listagem)
│   ├── nova/
│   │   └── page.tsx                  # /nfes/nova (wizard)
│   └── [id]/
│       ├── page.tsx                  # /nfes/[id] (detalhes)
│       └── editar/
│           └── page.tsx              # /nfes/[id]/editar
│
└── matrizes-fiscais/
    ├── page.tsx                      # /matrizes-fiscais
    ├── nova/
    │   └── page.tsx                  # /matrizes-fiscais/nova
    └── [id]/
        └── page.tsx                  # /matrizes-fiscais/[id]
```

### **Convenções de Rotas**

| Tipo de Rota | Padrão | Exemplo |
|-------------|--------|---------|
| **Listagem** | `/{modulo}/{entidade}s/page.tsx` | `/cadastros/clientes/page.tsx` |
| **Detalhes** | `/{modulo}/{entidade}s/[id]/page.tsx` | `/cadastros/clientes/[id]/page.tsx` |
| **Criar** | `/{modulo}/{entidade}s/nova/page.tsx` | `/nfes/nova/page.tsx` |
| **Editar** | `/{modulo}/{entidade}s/[id]/editar/page.tsx` | `/nfes/[id]/editar/page.tsx` |

**Observação:** Use `nova` (feminino) ou `novo` (masculino) conforme o gênero da entidade em português.

---

## 💻 Padrões de Código

### **1. Estrutura de um Componente**

```typescript
"use client" // Se necessário

// 1. Imports externos
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Imports de UI
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// 3. Imports de hooks/services
import { useClienteForm } from "@/hooks/clientes/use-cliente-form"
import { clienteService } from "@/lib/services/cliente.service"

// 4. Imports de tipos
import type { Cliente } from "@/types/entities.types"

// 5. Imports de ícones
import { User, MapPin } from "lucide-react"

// 6. Interfaces/Types locais
interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId?: string
}

// 7. Componente
export function ClienteFormDialog({
  open,
  onOpenChange,
  clienteId,
}: ClienteFormDialogProps) {
  // Implementação
}
```

### **2. Nomenclatura de Variáveis e Funções**

```typescript
// ✅ CORRETO
const clienteId = "123"
const isLoading = false
const handleSubmit = () => {}
const loadClientes = async () => {}

// ❌ EVITAR
const cliente_id = "123"
const loading = false  // Prefira is/has/should
const onSubmit = () => {}  // Reserve "on" para props
```

### **3. Organização de Hooks**

```typescript
export function ClienteFormDialog() {
  // 1. Hooks do React
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // 2. Hooks customizados
  const { form, loading, handleSubmit } = useClienteForm()

  // 3. Form watches
  const watchDocumento = form.watch("documento")

  // 4. Effects
  useEffect(() => {
    // ...
  }, [])

  // 5. Handlers
  const onSubmit = async (values: any) => {
    // ...
  }

  // 6. Render
  return (
    // JSX
  )
}
```

### **4. Barrel Exports (index.ts)**

Use barrel exports para simplificar imports:

```typescript
// components/cadastros/clientes/index.ts
export { ClienteFormDialog } from './cliente-form-dialog'
export { ClientesDataTable } from './clientes-data-table'
export { ClientesSectionCards } from './clientes-section-cards'

// Uso:
import { ClienteFormDialog, ClientesDataTable } from '@/components/cadastros/clientes'
```

---

## 📝 Exemplos Práticos

### **Exemplo 1: Renomear Arquivos Existentes**

#### **Antes (Inconsistente)**
```
components/cadastros/clientes/
├── ClienteFormDialog.tsx          ❌
├── clientesDataTable.tsx          ❌
├── clientes_section_cards.tsx     ❌
```

#### **Depois (Padronizado)**
```
components/cadastros/clientes/
├── cliente-form-dialog.tsx        ✅
├── clientes-data-table.tsx        ✅
├── clientes-section-cards.tsx     ✅
```

### **Exemplo 2: Criar Novo Módulo (Transportadoras)**

```bash
# 1. Criar estrutura de pastas
mkdir -p components/cadastros/transportadoras
mkdir -p hooks/transportadoras
mkdir -p app/cadastros/transportadoras/[id]

# 2. Criar arquivos de componentes
touch components/cadastros/transportadoras/transportadora-form-dialog.tsx
touch components/cadastros/transportadoras/transportadoras-data-table.tsx
touch components/cadastros/transportadoras/transportadoras-section-cards.tsx
touch components/cadastros/transportadoras/index.ts

# 3. Criar hooks
touch hooks/transportadoras/use-transportadora-form.ts
touch hooks/transportadoras/use-transportadoras.ts

# 4. Criar service
touch lib/services/transportadora.service.ts

# 5. Criar rotas
touch app/cadastros/transportadoras/page.tsx
touch app/cadastros/transportadoras/[id]/page.tsx
```

### **Exemplo 3: Estrutura de Formulário Complexo**

Para formulários com muitas seções (como Produtos), separe em seções:

```
components/cadastros/produtos/
├── produto-form-dialog.tsx                    # Dialog principal (orquestra as seções)
├── produtos-data-table.tsx
├── produtos-section-cards.tsx
├── sections/                                  # Seções do formulário
│   ├── produto-dados-basicos-section.tsx     # Código, descrição, NCM
│   ├── produto-estoque-section.tsx           # Estoque, unidades
│   ├── produto-tributacao-section.tsx        # ICMS, PIS, COFINS, IPI
│   └── produto-outros-section.tsx            # Fornecedor, observações
├── types.ts                                   # Tipos e schemas
└── index.ts
```

**produto-form-dialog.tsx:**
```typescript
import { ProdutoDadosBasicosSection } from './sections/produto-dados-basicos-section'
import { ProdutoEstoqueSection } from './sections/produto-estoque-section'
import { ProdutoTributacaoSection } from './sections/produto-tributacao-section'

export function ProdutoFormDialog() {
  return (
    <Dialog>
      <Accordion>
        <AccordionItem value="basicos">
          <ProdutoDadosBasicosSection form={form} />
        </AccordionItem>
        <AccordionItem value="estoque">
          <ProdutoEstoqueSection form={form} />
        </AccordionItem>
        <AccordionItem value="tributacao">
          <ProdutoTributacaoSection form={form} />
        </AccordionItem>
      </Accordion>
    </Dialog>
  )
}
```

---

## 🎨 Padrões de UI/UX

### **1. Dialogs de Formulário**

Todos os formulários de cadastro devem seguir este padrão:

```typescript
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh]">
    {/* Header */}
    <DialogHeader>
      <DialogTitle>{clienteId ? "Editar" : "Novo"} Cliente</DialogTitle>
      <DialogDescription>Descrição do formulário</DialogDescription>
    </DialogHeader>

    {/* Body com scroll */}
    <div className="flex-1 overflow-y-auto">
      <Form {...form}>
        <Accordion type="multiple">
          {/* Seções do formulário */}
        </Accordion>
      </Form>
    </div>

    {/* Footer fixo */}
    <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancelar
      </Button>
      <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
        {loading ? "Salvando..." : clienteId ? "Atualizar" : "Criar"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **2. Accordion de Seções**

```typescript
<Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
  <AccordionItem value="basicos">
    <AccordionTrigger>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Dados Básicos</h3>
          <p className="text-sm text-muted-foreground">Informações principais</p>
        </div>
      </div>
      <Badge variant="secondary">Obrigatório</Badge>
    </AccordionTrigger>
    <AccordionContent>
      {/* Campos do formulário */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### **3. Data Tables**

Todas as tabelas devem usar o padrão com filtros:

```typescript
import { DataTableFilter } from "@/components/data-table-filter"
import { createColumnConfigHelper } from "@/components/data-table-filter/core/filters"

const dtf = createColumnConfigHelper<Cliente>()

const filterColumnsConfig = [
  dtf.text().id("nome").displayName("Nome").build(),
  dtf.option().id("tipo").displayName("Tipo").options([...]).build(),
]

export function ClientesDataTable() {
  const { clientes, loading } = useClientes()

  return (
    <div>
      <DataTableFilter
        columns={filterColumnsConfig}
        data={clientes}
        locale="pt-BR"
      />
      <Table>
        {/* Tabela */}
      </Table>
    </div>
  )
}
```

---

## 🔧 Ferramentas e Scripts

### **Script de Renomeação em Massa**

Crie um script para renomear arquivos automaticamente:

```bash
#!/bin/bash
# rename-components.sh

# Renomear de PascalCase para kebab-case
find components -name "*.tsx" -type f | while read file; do
  dir=$(dirname "$file")
  base=$(basename "$file" .tsx)

  # Converter PascalCase para kebab-case
  new_name=$(echo "$base" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')

  if [ "$base" != "$new_name" ]; then
    echo "Renomeando: $file -> $dir/$new_name.tsx"
    git mv "$file" "$dir/$new_name.tsx"
  fi
done
```

### **Validação de Nomenclatura (ESLint)**

Adicione regras ao ESLint para validar nomenclatura:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'filename-rules/match': [2, 'kebab-case'],
  },
}
```

---

## 📊 Checklist de Padronização

### **Para Cada Novo Módulo:**

- [ ] Criar pasta em `components/{modulo}/{entidade}/`
- [ ] Criar arquivos com nomenclatura kebab-case
- [ ] Criar hooks em `hooks/{entidade}/`
- [ ] Criar service em `lib/services/{entidade}.service.ts`
- [ ] Criar schema em `lib/schemas/{entidade}.schema.ts` (se necessário)
- [ ] Criar rotas em `app/{modulo}/{entidade}s/`
- [ ] Adicionar barrel exports (`index.ts`)
- [ ] Documentar tipos em `types.ts` local ou global

### **Para Refatoração de Módulos Existentes:**

- [ ] Renomear arquivos para kebab-case
- [ ] Reorganizar pastas conforme estrutura padrão
- [ ] Separar seções complexas em arquivos próprios
- [ ] Mover tipos para arquivos `types.ts`
- [ ] Mover schemas para `lib/schemas/`
- [ ] Atualizar imports em todos os arquivos
- [ ] Testar funcionamento após refatoração

---

## 🚀 Próximos Passos

1. **Fase 1:** Renomear arquivos existentes para kebab-case
2. **Fase 2:** Reorganizar estrutura de pastas
3. **Fase 3:** Separar componentes complexos em seções
4. **Fase 4:** Criar barrel exports
5. **Fase 5:** Documentar tipos e interfaces
6. **Fase 6:** Adicionar validação automática (ESLint)

---

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Shadcn/ui Components](https://ui.shadcn.com/)

---

## 🤝 Contribuindo

Ao adicionar novos componentes ou módulos, sempre siga este guia. Se encontrar casos não cobertos, atualize este documento.

**Última atualização:** 2025-10-25

