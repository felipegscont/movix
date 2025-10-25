# 📋 Tasklist de Refatoração - Frontend Structure

> **Projeto:** Movix - Sistema de Gestão Fiscal  
> **Data:** 2025-10-25  
> **Objetivo:** Padronizar estrutura e nomenclatura do frontend conforme FRONTEND_STRUCTURE_GUIDE.md

---

## 📊 Visão Geral

Esta refatoração visa padronizar completamente a estrutura do frontend seguindo as melhores práticas definidas no guia de padronização.

### **Status Atual**
✅ **Nomenclatura de arquivos:** Todos os arquivos já estão em kebab-case  
✅ **Estrutura de pastas:** Bem organizada por módulos  
⚠️ **Barrel exports:** Não existem (precisam ser criados)  
⚠️ **Tipos centralizados:** Tipos espalhados em múltiplos arquivos  
⚠️ **Schemas:** Alguns em componentes, outros em lib/schemas

### **Impacto Estimado**
- **Arquivos a criar:** ~15 (barrel exports + tipos)
- **Arquivos a modificar:** ~50 (atualizar imports)
- **Arquivos a deletar:** 1 (produto-form-dialog-old.tsx)
- **Tempo estimado:** 4-6 horas

---

## 🎯 Fase 1: Análise e Preparação

**Objetivo:** Preparar ambiente e fazer backup antes de iniciar refatoração

### Tarefas

- [ ] **Criar branch de refatoração**
  - Criar branch git `refactor/frontend-structure-standardization`
  - Comando: `git checkout -b refactor/frontend-structure-standardization`

- [ ] **Fazer backup do código atual**
  - Commit de segurança antes de iniciar refatoração
  - Comando: `git add . && git commit -m "chore: backup antes da refatoração de estrutura"`

- [ ] **Documentar arquivos que precisam renomeação**
  - ✅ Análise completa: TODOS os arquivos já estão em kebab-case
  - Nenhuma renomeação necessária!

- [ ] **Verificar dependências entre módulos**
  - Mapear imports entre componentes para facilitar atualização posterior
  - Usar ferramenta: `grep -r "from '@/components" frontend/app`

---

## 📁 Fase 2: Criar Estrutura de Pastas

**Objetivo:** Criar pastas faltantes conforme padrão definido no guia

### Tarefas

- [ ] **Criar pasta frontend/types**
  - Criar pasta para tipos TypeScript globais
  - Comando: `mkdir -p frontend/types`

- [ ] **Criar subpastas em frontend/types**
  - Criar arquivos:
    - `frontend/types/api.types.ts` - Tipos de API e responses
    - `frontend/types/entities.types.ts` - Tipos de entidades (Cliente, Fornecedor, etc)
    - `frontend/types/index.ts` - Barrel export de tipos

- [ ] **Verificar estrutura de hooks**
  - ✅ Validar que hooks/{entidade} existe para todos os módulos
  - Estrutura atual: clientes/, fornecedores/, produtos/, nfe/, shared/
  - Status: **COMPLETO**

- [ ] **Criar pasta lib/schemas se necessário**
  - ✅ lib/schemas já existe
  - Status: **COMPLETO**

---

## 🔄 Fase 3: Renomear Arquivos (Componentes)

**Objetivo:** Renomear todos os arquivos de componentes para kebab-case

### Tarefas

- [ ] **Verificar nomenclatura de componentes**
  - ✅ Análise completa: TODOS os 130+ arquivos .tsx em components/ já estão em kebab-case
  - Status: **COMPLETO - NENHUMA AÇÃO NECESSÁRIA**

- [ ] **Verificar nomenclatura de hooks**
  - ✅ Análise completa: TODOS os 11 arquivos em hooks/ já estão em kebab-case
  - Status: **COMPLETO - NENHUMA AÇÃO NECESSÁRIA**

- [ ] **Verificar nomenclatura de services**
  - ✅ Análise completa: TODOS os 10 arquivos em lib/services/ já estão em kebab-case
  - Status: **COMPLETO - NENHUMA AÇÃO NECESSÁRIA**

- [ ] **Remover arquivo obsoleto**
  - Deletar `frontend/components/cadastros/produtos/produto-form-dialog-old.tsx`
  - Este é uma versão antiga não utilizada
  - Comando: `rm frontend/components/cadastros/produtos/produto-form-dialog-old.tsx`

---

## 🗂️ Fase 4: Reorganizar Estrutura de Módulos

**Objetivo:** Mover arquivos para estrutura padronizada e criar barrel exports

### 4.1 Criar Barrel Exports

- [ ] **Criar barrel exports para módulo clientes**
  - Arquivo: `frontend/components/cadastros/clientes/index.ts`
  - Exportar: ClienteFormDialog, ClientesDataTable, ClientesSectionCards

- [ ] **Criar barrel exports para módulo fornecedores**
  - Arquivo: `frontend/components/cadastros/fornecedores/index.ts`
  - Exportar: FornecedorFormDialog, FornecedoresDataTable, FornecedoresSectionCards

- [ ] **Criar barrel exports para módulo produtos**
  - Arquivo: `frontend/components/cadastros/produtos/index.ts`
  - Exportar: ProdutoFormDialog, ProdutosDataTable, ProdutosSectionCards
  - Exportar seções: ProdutoDadosBasicosSection, ProdutoEstoqueSection, ProdutoTributacaoSection, ProdutoOutrosSection

- [ ] **Criar barrel exports para módulo NFe**
  - Arquivo: `frontend/components/nfe/index.ts`
  - Exportar: NfeWizard, NfeDataTable, NfeSectionCards, NfeDetails, NfeStatusBadge, etc.
  - Exportar steps: NfeStepGeral, NfeStepItens, NfeStepCobranca, NfeStepRevisao

- [ ] **Criar barrel exports para módulo emitente**
  - Arquivo: `frontend/components/configuracoes/emitente/index.ts`
  - Exportar: EmitenteForm, EmitentesDataTable
  - Exportar seções: DadosBasicosSection, EnderecoSection, ContatoSection, NfeSection, CertificadoSection

- [ ] **Criar barrel exports para módulo natureza-operacao**
  - Arquivo: `frontend/components/configuracoes/natureza-operacao/index.ts`
  - Exportar: NaturezaOperacaoDataTable, NaturezaOperacaoFiscalForm, NaturezaOperacaoCfopManager, etc.

- [ ] **Criar barrel exports para módulo matriz-fiscal**
  - Arquivo: `frontend/components/cadastros/matriz-fiscal/index.ts`
  - Exportar: MatrizFiscalForm, MatrizFiscalDataTable

- [ ] **Criar barrel exports para layout**
  - Arquivo: `frontend/components/layout/index.ts`
  - Exportar: AppSidebar, NavMain, NavUser, SidebarLayout, SiteHeader, etc.

- [ ] **Criar barrel exports para shared/combobox**
  - Arquivo: `frontend/components/shared/combobox/index.ts`
  - Exportar todos os comboboxes: ClienteCombobox, ProdutoCombobox, CfopCombobox, etc.

### 4.2 Consolidar Tipos

- [ ] **Mover tipos para arquivos centralizados**
  - Consolidar tipos de Cliente, Fornecedor, Produto em `frontend/types/entities.types.ts`
  - Manter tipos específicos de componentes nos arquivos locais (ex: nfe/types.ts)
  - Criar `frontend/types/api.types.ts` para tipos de API responses

- [ ] **Criar schemas centralizados**
  - Mover schemas de validação para `lib/schemas/` quando apropriado
  - Schemas já existentes: nfe.schema.ts
  - Considerar criar: cliente.schema.ts, fornecedor.schema.ts, produto.schema.ts

---

## 🔗 Fase 5: Atualizar Imports

**Objetivo:** Atualizar todos os imports após renomeação e reorganização

### 5.1 Atualizar Imports em App Router

- [ ] **Atualizar imports em app/cadastros/clientes**
  - Arquivo: `app/cadastros/clientes/page.tsx`
  - Arquivo: `app/cadastros/clientes/[id]/page.tsx`
  - Mudar de: `import { ClienteFormDialog } from '@/components/cadastros/clientes/cliente-form-dialog'`
  - Para: `import { ClienteFormDialog } from '@/components/cadastros/clientes'`

- [ ] **Atualizar imports em app/cadastros/fornecedores**
  - Arquivo: `app/cadastros/fornecedores/page.tsx`
  - Arquivo: `app/cadastros/fornecedores/[id]/page.tsx`
  - Usar barrel exports

- [ ] **Atualizar imports em app/cadastros/produtos**
  - Arquivo: `app/cadastros/produtos/page.tsx`
  - Arquivo: `app/cadastros/produtos/[id]/page.tsx`
  - Usar barrel exports

- [ ] **Atualizar imports em app/nfes**
  - Arquivo: `app/nfes/page.tsx`
  - Arquivo: `app/nfes/nova/page.tsx`
  - Arquivo: `app/nfes/[id]/page.tsx`
  - Usar barrel exports

- [ ] **Atualizar imports em app/configuracoes**
  - Arquivo: `app/configuracoes/emitente/page.tsx`
  - Arquivo: `app/configuracoes/naturezas-operacao/page.tsx`
  - Usar barrel exports

- [ ] **Atualizar imports em app/matrizes-fiscais**
  - Arquivo: `app/matrizes-fiscais/page.tsx`
  - Arquivo: `app/matrizes-fiscais/nova/page.tsx`
  - Arquivo: `app/matrizes-fiscais/[id]/page.tsx`
  - Usar barrel exports

### 5.2 Atualizar Imports Internos

- [ ] **Atualizar imports entre componentes**
  - Atualizar imports internos entre componentes que usam outros componentes
  - Exemplo: layout/app-sidebar.tsx importando outros componentes de layout
  - Usar barrel exports onde apropriado

- [ ] **Atualizar imports de tipos**
  - Atualizar imports de tipos para usar `frontend/types/` quando apropriado
  - Exemplo: `import type { Cliente } from '@/types/entities.types'`
  - Manter tipos específicos de componentes locais

---

## ✅ Fase 6: Validação e Testes

**Objetivo:** Testar aplicação e validar que tudo funciona corretamente

### 6.1 Build e Compilação

- [ ] **Executar build do projeto**
  - Comando: `cd frontend && npm run build`
  - Verificar erros de compilação TypeScript
  - Objetivo: 0 erros

- [ ] **Corrigir erros de TypeScript**
  - Corrigir todos os erros de tipos e imports que aparecerem no build
  - Verificar paths de imports
  - Verificar tipos exportados/importados

### 6.2 Testes Funcionais

- [ ] **Testar navegação no app**
  - Testar todas as rotas principais:
    - `/dashboard`
    - `/cadastros/clientes`
    - `/cadastros/fornecedores`
    - `/cadastros/produtos`
    - `/nfes`
    - `/configuracoes/emitente`
    - `/matrizes-fiscais`

- [ ] **Testar formulários de cadastro**
  - Abrir formulário de cliente (criar e editar)
  - Abrir formulário de fornecedor (criar e editar)
  - Abrir formulário de produto (criar e editar)
  - Verificar que todos os campos aparecem corretamente

- [ ] **Testar wizard de NFe**
  - Criar nova NFe
  - Testar todos os steps: Geral, Itens, Cobrança, Revisão
  - Verificar navegação entre steps
  - Verificar validações

- [ ] **Testar tabelas e filtros**
  - Verificar que data tables carregam dados
  - Testar filtros de busca
  - Testar paginação
  - Testar ações (editar, deletar)

- [ ] **Verificar console do navegador**
  - Abrir DevTools
  - Verificar que não há erros no console
  - Verificar que não há warnings críticos
  - Verificar network requests

### 6.3 Finalização

- [ ] **Commit final da refatoração**
  - Fazer commit com mensagem descritiva
  - Mensagem sugerida: `refactor: padronizar estrutura frontend com barrel exports e tipos centralizados`

- [ ] **Criar Pull Request**
  - Criar PR da branch `refactor/frontend-structure-standardization` para `main`
  - Incluir descrição detalhada das mudanças
  - Incluir checklist de testes realizados
  - Referenciar FRONTEND_STRUCTURE_GUIDE.md

---

## 📝 Notas Importantes

### ✅ Pontos Positivos Atuais
- Todos os arquivos já seguem kebab-case
- Estrutura de pastas bem organizada por módulos
- Hooks bem separados por domínio
- Services bem estruturados

### ⚠️ Pontos de Atenção
- Não há barrel exports (imports verbosos)
- Tipos espalhados em múltiplos arquivos
- Alguns schemas em componentes, outros em lib/schemas
- Arquivo obsoleto (produto-form-dialog-old.tsx)

### 🎯 Benefícios da Refatoração
- **Imports mais limpos:** `from '@/components/cadastros/clientes'` ao invés de paths longos
- **Tipos centralizados:** Fácil de encontrar e reutilizar
- **Manutenibilidade:** Estrutura consistente facilita manutenção
- **Onboarding:** Novos desenvolvedores entendem a estrutura rapidamente
- **Escalabilidade:** Fácil adicionar novos módulos seguindo o padrão

---

## 🔧 Scripts Úteis

### Buscar imports que precisam atualização
```bash
# Buscar imports de componentes
grep -r "from '@/components/cadastros" frontend/app

# Buscar imports de tipos
grep -r "import.*Cliente.*from" frontend/
```

### Verificar arquivos sem barrel exports
```bash
# Listar pastas de componentes sem index.ts
find frontend/components -type d -mindepth 2 -maxdepth 2 ! -exec test -e "{}/index.ts" \; -print
```

### Contar arquivos por tipo
```bash
# Contar componentes
find frontend/components -name "*.tsx" | wc -l

# Contar hooks
find frontend/hooks -name "*.ts" | wc -l

# Contar services
find frontend/lib/services -name "*.ts" | wc -l
```

---

**Última atualização:** 2025-10-25  
**Responsável:** Equipe de Desenvolvimento  
**Referência:** FRONTEND_STRUCTURE_GUIDE.md

