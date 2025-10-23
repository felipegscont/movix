# 📋 Resumo: Migração de Selects para Comboboxes com Busca

## ✅ Objetivo
Substituir todos os componentes `Select` simples por `Combobox` com funcionalidade de busca, melhorando a experiência do usuário especialmente em listas longas (estados, municípios, etc).

---

## 🎯 Novos Comboboxes Criados

### 1. **EstadoCombobox**
**Arquivo:** `frontend/components/shared/combobox/estado-combobox.tsx`

**Características:**
- ✅ Busca por UF ou nome do estado
- ✅ Carrega dados da API (AuxiliarService.getEstados())
- ✅ Exibe UF em destaque + nome completo
- ✅ Filtro local em tempo real

**Uso:**
```tsx
<EstadoCombobox
  value={estadoId}
  onValueChange={setEstadoId}
  placeholder="Selecione o estado"
/>
```

---

### 2. **MunicipioCombobox**
**Arquivo:** `frontend/components/shared/combobox/municipio-combobox.tsx`

**Características:**
- ✅ Busca por nome do município
- ✅ Depende do estado selecionado
- ✅ Carrega dados da API (AuxiliarService.getMunicipios(estadoId))
- ✅ Desabilitado se estado não selecionado
- ✅ Filtro local em tempo real

**Uso:**
```tsx
<MunicipioCombobox
  value={municipioId}
  onValueChange={setMunicipioId}
  estadoId={estadoId}
  placeholder="Selecione o município"
/>
```

---

### 3. **StaticCombobox (Expandido)**
**Arquivo:** `frontend/components/shared/combobox/static-combobox.tsx`

**Novas Opções Adicionadas:**

#### **IMPOSTO_TAXA_OPTIONS**
```typescript
{ value: "ICMS", label: "ICMS", description: "Imposto sobre Circulação..." }
{ value: "PIS", label: "PIS", description: "Programa de Integração Social" }
{ value: "COFINS", label: "COFINS", description: "Contribuição para..." }
{ value: "IPI", label: "IPI", description: "Imposto sobre Produtos..." }
{ value: "ISSQN", label: "ISSQN", description: "Imposto sobre Serviços..." }
```

#### **SE_APLICA_A_OPTIONS**
```typescript
{ value: "produtos", label: "Produtos/Mercadorias" }
{ value: "servicos", label: "Serviços" }
```

#### **MODELO_NF_OPTIONS**
```typescript
{ value: "nfe", label: "NF-e", description: "Nota Fiscal Eletrônica" }
{ value: "nfce", label: "NFC-e", description: "Nota Fiscal de Consumidor..." }
{ value: "cte", label: "CT-e", description: "Conhecimento de Transporte..." }
{ value: "nfse", label: "NFS-e", description: "Nota Fiscal de Serviço..." }
```

#### **REGIME_FISCAL_OPTIONS**
```typescript
{ value: 1, label: "Simples Nacional" }
{ value: 2, label: "Lucro Presumido" }
{ value: 3, label: "Lucro Real" }
```

#### **TIPO_ITEM_OPTIONS**
```typescript
{ value: "todos", label: "Todos" }
{ value: "produto", label: "Produto" }
{ value: "servico", label: "Serviço" }
```

#### **INDICADOR_IE_OPTIONS**
```typescript
{ value: 1, label: "1 - Contribuinte ICMS" }
{ value: 2, label: "2 - Contribuinte isento" }
{ value: 9, label: "9 - Não Contribuinte" }
```

#### **TIPO_PESSOA_OPTIONS**
```typescript
{ value: "FISICA", label: "Pessoa Física" }
{ value: "JURIDICA", label: "Pessoa Jurídica" }
```

#### **TIPO_CLIENTE_OPTIONS**
```typescript
{ value: "contribuinte", label: "Contribuinte ICMS" }
{ value: "nao_contribuinte", label: "Não Contribuinte" }
{ value: "exterior", label: "Exterior" }
```

---

## 🔄 Formulários Atualizados

### **MatrizFiscalForm**
**Arquivo:** `frontend/components/cadastros/matriz-fiscal/matriz-fiscal-form.tsx`

#### **Substituições Realizadas:**

| Campo | Antes | Depois |
|-------|-------|--------|
| **Imposto/Taxa** | `Select` (5 opções) | `StaticCombobox` (IMPOSTO_TAXA_OPTIONS) |
| **Modelo da NF** | `Select` (4 opções) | `StaticCombobox` (MODELO_NF_OPTIONS) |
| **Se aplica a** | `Select` (2 opções) | `StaticCombobox` (SE_APLICA_A_OPTIONS) |
| **Regime Fiscal** | `Select` (3 opções) | `StaticCombobox` (REGIME_FISCAL_OPTIONS) |
| **Estado Destinatário** | `Select` (8 estados hardcoded) | `EstadoCombobox` (27 estados da API) |
| **Tipo de Item** | `Select` (3 opções) | `StaticCombobox` (TIPO_ITEM_OPTIONS) |

---

## 📊 Comboboxes Existentes (Já Implementados)

### **Comboboxes de Dados Dinâmicos:**

1. **CFOPCombobox** - Busca CFOPs da API
2. **ClienteCombobox** - Busca clientes da API
3. **CSOSNCombobox** - Busca CSOSN da API
4. **CSTCombobox** - Busca CST da API (filtrado por tipo)
5. **FormaPagamentoCombobox** - Busca formas de pagamento
6. **IndicadorPagamentoCombobox** - Busca indicadores
7. **NaturezaOperacaoCombobox** - Busca naturezas de operação
8. **NCMCombobox** - Busca NCM da API
9. **ProdutoCombobox** - Busca produtos da API

### **Comboboxes Estáticos:**

10. **StaticCombobox** - Para opções pré-definidas

---

## 🎨 Benefícios da Migração

### **1. Experiência do Usuário**
- ✅ **Busca rápida**: Digite para filtrar instantaneamente
- ✅ **Listas longas**: Fácil encontrar estados, municípios, etc
- ✅ **Visual consistente**: Todos os comboboxes têm o mesmo design
- ✅ **Acessibilidade**: Suporte a teclado (↑↓ Enter Esc)

### **2. Performance**
- ✅ **Filtro local**: Não precisa recarregar da API
- ✅ **Lazy loading**: Carrega apenas quando necessário
- ✅ **Memoização**: React.useMemo para otimizar filtros

### **3. Manutenibilidade**
- ✅ **Código reutilizável**: Um componente para múltiplos usos
- ✅ **Fácil adicionar opções**: Apenas adicionar no array
- ✅ **Tipagem forte**: TypeScript garante type safety

### **4. Funcionalidades**
- ✅ **Busca inteligente**: Remove acentos, case-insensitive
- ✅ **Descrições**: Mostra informações adicionais
- ✅ **Estados vazios**: Mensagens customizadas
- ✅ **Loading states**: Feedback visual durante carregamento

---

## 📝 Padrão de Uso

### **Para Dados Estáticos:**
```tsx
import { StaticCombobox, REGIME_FISCAL_OPTIONS } from "@/components/shared/combobox/static-combobox"

<StaticCombobox
  options={REGIME_FISCAL_OPTIONS}
  value={value}
  onValueChange={onChange}
  placeholder="Selecione"
  className="h-9"
/>
```

### **Para Dados Dinâmicos (API):**
```tsx
import { EstadoCombobox } from "@/components/shared/combobox/estado-combobox"

<EstadoCombobox
  value={estadoId}
  onValueChange={setEstadoId}
  placeholder="Selecione o estado"
/>
```

---

## 🔍 Próximos Passos Sugeridos

### **Formulários a Revisar:**

1. **ClienteForm** (`cliente-form-dialog.tsx`)
   - ✅ Estado → EstadoCombobox
   - ✅ Município → MunicipioCombobox
   - ✅ Indicador IE → StaticCombobox (INDICADOR_IE_OPTIONS)
   - ✅ Tipo Pessoa → StaticCombobox (TIPO_PESSOA_OPTIONS)

2. **NFeStepGeral** (`nfe-step-geral.tsx`)
   - ✅ Tipo Operação → StaticCombobox (TIPO_OPERACAO_OPTIONS)
   - ✅ Presença Comprador → StaticCombobox (PRESENCA_COMPRADOR_OPTIONS)
   - ✅ Finalidade → StaticCombobox (FINALIDADE_OPTIONS)

3. **NaturezaOperacaoForm** (`natureza-operacao-form-dialog.tsx`)
   - ✅ Já usa StaticCombobox para alguns campos
   - ✅ Verificar se todos os Selects foram migrados

4. **ProdutoForm** (se existir)
   - ✅ Estado → EstadoCombobox
   - ✅ Tipo → StaticCombobox

---

## ✅ Checklist de Migração

- [x] Criar EstadoCombobox
- [x] Criar MunicipioCombobox
- [x] Expandir StaticCombobox com novas opções
- [x] Atualizar MatrizFiscalForm
- [ ] Atualizar ClienteForm
- [ ] Atualizar NFeStepGeral
- [ ] Atualizar outros formulários
- [ ] Testar todos os formulários
- [ ] Documentar mudanças

---

## 🎯 Resultado Final

**Antes:**
- 🔴 Selects simples sem busca
- 🔴 Difícil encontrar em listas longas
- 🔴 Inconsistência visual
- 🔴 Código duplicado

**Depois:**
- ✅ Comboboxes com busca inteligente
- ✅ Fácil encontrar qualquer item
- ✅ Visual consistente e profissional
- ✅ Código reutilizável e manutenível

---

## 📚 Referências

- **Componentes Base:** `frontend/components/ui/command.tsx`
- **Utilitários:** `frontend/lib/utils/search.ts`
- **Serviços:** `frontend/lib/services/auxiliar.service.ts`
- **Padrão:** Baseado em shadcn/ui Combobox

---

**Status:** ✅ Migração parcial concluída - MatrizFiscalForm 100% atualizado
**Próximo:** Atualizar ClienteForm e NFeStepGeral

