# 📋 Plano de Refatoração - Selects com Busca

## 🎯 Objetivo

Substituir todos os selects simples por Comboboxes com busca, melhorando drasticamente a UX para seleção de dados fiscais.

## 📊 Análise Atual

### Problemas Identificados

| Formulário | Campo | Problema | Qtd Itens |
|------------|-------|----------|-----------|
| **Produto** | NCM | Select simples | Variável |
| **Produto** | CEST | Select simples | Variável |
| **Produto** | CST ICMS | Select simples | 11 |
| **Produto** | CSOSN | Select simples | 10 |
| **Produto** | CST PIS | Select simples | 33 |
| **Produto** | CST COFINS | Select simples | 33 |
| **Produto** | CST IPI | Select simples | 14 |
| **Natureza** | CFOP Dentro | Select simples | ~500 |
| **Natureza** | CFOP Fora | Select simples | ~500 |
| **Natureza** | CFOP Exterior | Select simples | ~500 |
| **NFe** | Natureza Operação | Select simples | Variável |

**Total**: 11 selects problemáticos

## ✅ Solução Implementada

### Componentes Criados

```
frontend/components/ui/combobox/
├── cfop-combobox.tsx       # CFOP com busca e filtro por tipo
├── ncm-combobox.tsx        # NCM com busca server-side
├── cst-combobox.tsx        # CST com busca e filtro por tipo
├── csosn-combobox.tsx      # CSOSN com busca
└── index.ts                # Exports centralizados
```

### Características dos Componentes

#### 1. **CFOPCombobox**
```typescript
<CFOPCombobox
  value={cfopId}
  onValueChange={setCfopId}
  tipo="SAIDA"              // Opcional: filtra por tipo
  placeholder="Selecione"
  disabled={loading}
/>
```

**Features**:
- ✅ Busca por código ou descrição
- ✅ Filtro por tipo (ENTRADA/SAIDA)
- ✅ ~500 itens navegáveis
- ✅ Exibe código + descrição

#### 2. **NCMCombobox**
```typescript
<NCMCombobox
  value={ncmId}
  onValueChange={setNcmId}
  placeholder="Selecione"
/>
```

**Features**:
- ✅ Busca server-side (lazy loading)
- ✅ Busca por código ou descrição
- ✅ Performance otimizada

#### 3. **CSTCombobox**
```typescript
<CSTCombobox
  value={cstId}
  onValueChange={setCstId}
  tipo="ICMS"               // Obrigatório
  placeholder="Selecione"
/>
```

**Features**:
- ✅ Busca por código ou descrição
- ✅ Filtro automático por tipo
- ✅ Suporta ICMS, PIS, COFINS, IPI

#### 4. **CSOSNCombobox**
```typescript
<CSOSNCombobox
  value={csosnId}
  onValueChange={setCsosnId}
  placeholder="Selecione"
/>
```

**Features**:
- ✅ Busca por código ou descrição
- ✅ 10 itens (Simples Nacional)

## 🔧 Refatorações Necessárias

### 1. Produto Form Dialog

**Arquivo**: `frontend/components/cadastros/produtos/produto-form-dialog.tsx`

**Mudanças**:

```typescript
// ❌ ANTES
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select onValueChange={field.onChange} value={field.value}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione o NCM" />
  </SelectTrigger>
  <SelectContent className="max-h-[300px]">
    {ncms.map((ncm) => (
      <SelectItem key={ncm.id} value={ncm.id}>
        {ncm.codigo} - {ncm.descricao}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// ✅ DEPOIS
import { NCMCombobox, CSTCombobox, CSOSNCombobox } from "@/components/ui/combobox"

<NCMCombobox
  value={field.value}
  onValueChange={field.onChange}
  placeholder="Selecione o NCM"
/>
```

**Campos a refatorar**:
- [x] NCM → NCMCombobox
- [x] CST ICMS → CSTCombobox (tipo="ICMS")
- [x] CSOSN → CSOSNCombobox
- [x] CST PIS → CSTCombobox (tipo="PIS")
- [x] CST COFINS → CSTCombobox (tipo="COFINS")
- [x] CST IPI → CSTCombobox (tipo="IPI")

### 2. Natureza Operação Form Dialog

**Arquivo**: `frontend/components/configuracoes/natureza-operacao/natureza-operacao-form-dialog.tsx`

**Mudanças**:

```typescript
// ❌ ANTES
<Select value={field.value || undefined} onValueChange={field.onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione" />
  </SelectTrigger>
  <SelectContent>
    {cfopsFiltrados.map((cfop) => (
      <SelectItem key={cfop.id} value={cfop.id}>
        {cfop.codigo} - {cfop.descricao}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// ✅ DEPOIS
import { CFOPCombobox } from "@/components/ui/combobox"

<CFOPCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="SAIDA"  // Para CFOP dentro/fora do estado
  placeholder="Selecione o CFOP"
/>
```

**Campos a refatorar**:
- [x] CFOP Dentro do Estado → CFOPCombobox
- [x] CFOP Fora do Estado → CFOPCombobox
- [x] CFOP Exterior → CFOPCombobox

### 3. NFe Form

**Arquivo**: `frontend/components/nfe/nfe-form.tsx`

**Mudanças**:

```typescript
// Natureza de Operação pode continuar com Select simples
// pois são poucas opções (geralmente < 20)
// Mas pode ser melhorado se necessário
```

## 📈 Benefícios

### UX Melhorada

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Busca** | ❌ Não | ✅ Sim |
| **Performance** | ❌ Lenta (500 itens) | ✅ Rápida (filtrada) |
| **Usabilidade** | ❌ Scroll infinito | ✅ Busca inteligente |
| **Acessibilidade** | ⚠️ Básica | ✅ Completa |

### Performance

- **CFOP**: De scroll em 500 itens → Busca instantânea
- **NCM**: De carregamento total → Lazy loading
- **CST**: De lista longa → Busca filtrada

### Código

- **Reutilização**: 4 componentes vs 11 selects
- **Manutenção**: Centralizada
- **Consistência**: UI uniforme

## 🚀 Implementação

### Fase 1: Componentes Base ✅
- [x] CFOPCombobox
- [x] NCMCombobox
- [x] CSTCombobox
- [x] CSOSNCombobox

### Fase 2: Refatoração Produto Form
- [ ] Substituir NCM Select
- [ ] Substituir CST ICMS Select
- [ ] Substituir CSOSN Select
- [ ] Substituir CST PIS Select
- [ ] Substituir CST COFINS Select
- [ ] Substituir CST IPI Select
- [ ] Remover código antigo
- [ ] Testar formulário

### Fase 3: Refatoração Natureza Form
- [ ] Substituir CFOP Dentro Select
- [ ] Substituir CFOP Fora Select
- [ ] Substituir CFOP Exterior Select
- [ ] Remover código antigo
- [ ] Testar formulário

### Fase 4: Testes e Ajustes
- [ ] Testar todos os formulários
- [ ] Validar performance
- [ ] Ajustar estilos se necessário
- [ ] Documentar mudanças

## 📝 Notas Técnicas

### Padrão Combobox (shadcn/ui)

Baseado em:
- **Radix UI** - Primitivos acessíveis
- **cmdk** - Command menu
- **Popover** - Posicionamento

### Busca Client-Side vs Server-Side

**Client-Side** (CFOP, CST, CSOSN):
- Dados carregados uma vez
- Busca instantânea no frontend
- Ideal para < 1000 itens

**Server-Side** (NCM):
- Busca no backend
- Lazy loading
- Ideal para muitos itens

### Integração com React Hook Form

```typescript
<FormField
  control={form.control}
  name="ncmId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>NCM *</FormLabel>
      <NCMCombobox
        value={field.value}
        onValueChange={field.onChange}
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

## 🎯 Resultado Esperado

- ✅ UX profissional e moderna
- ✅ Performance otimizada
- ✅ Código limpo e reutilizável
- ✅ Acessibilidade completa
- ✅ Manutenção simplificada

