# 📋 Plano de Refatoração - Formulários com Combobox

## 🎯 Objetivo

Substituir todos os selects simples por Comboboxes com busca usando componentes shadcn/ui (Command + Popover).

## ✅ Componentes Criados

Localização: `frontend/components/shared/combobox/`

1. **cfop-combobox.tsx** - Busca CFOP por código/descrição + filtro por tipo
2. **ncm-combobox.tsx** - Busca NCM com lazy loading
3. **cst-combobox.tsx** - Busca CST por tipo (ICMS, PIS, COFINS, IPI)
4. **csosn-combobox.tsx** - Busca CSOSN

## 📝 Formulários a Refatorar

### 1. Produto Form Dialog ⏳

**Arquivo**: `frontend/components/cadastros/produtos/produto-form-dialog.tsx`

**Campos a substituir**:

#### NCM
```typescript
// ❌ ANTES
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<FormField
  control={form.control}
  name="ncmId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>NCM</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o NCM" />
        </SelectTrigger>
        <SelectContent>
          {ncms.map((ncm) => (
            <SelectItem key={ncm.id} value={ncm.id}>
              {ncm.codigo} - {ncm.descricao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

// ✅ DEPOIS
import { NCMCombobox } from "@/components/shared/combobox/ncm-combobox"

<FormField
  control={form.control}
  name="ncmId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>NCM</FormLabel>
      <NCMCombobox
        value={field.value}
        onValueChange={field.onChange}
        placeholder="Selecione o NCM"
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

#### CST ICMS
```typescript
// ✅ DEPOIS
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"

<FormField
  control={form.control}
  name="cstIcmsId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>CST ICMS</FormLabel>
      <CSTCombobox
        value={field.value}
        onValueChange={field.onChange}
        tipo="ICMS"
        placeholder="Selecione o CST ICMS"
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

#### CSOSN
```typescript
// ✅ DEPOIS
import { CSOSNCombobox } from "@/components/shared/combobox/csosn-combobox"

<FormField
  control={form.control}
  name="csosnId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>CSOSN</FormLabel>
      <CSOSNCombobox
        value={field.value}
        onValueChange={field.onChange}
        placeholder="Selecione o CSOSN"
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

#### CST PIS
```typescript
<CSTCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="PIS"
  placeholder="Selecione o CST PIS"
/>
```

#### CST COFINS
```typescript
<CSTCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="COFINS"
  placeholder="Selecione o CST COFINS"
/>
```

#### CST IPI
```typescript
<CSTCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="IPI"
  placeholder="Selecione o CST IPI"
/>
```

**Remover**:
- Estados de loading de NCM, CST, CSOSN (movidos para os comboboxes)
- useEffect de carregamento de dados
- Imports de Select não utilizados

---

### 2. Natureza Operação Form Dialog ⏳

**Arquivo**: `frontend/components/configuracoes/natureza-operacao/natureza-operacao-form-dialog.tsx`

**Campos a substituir**:

#### CFOP Dentro do Estado
```typescript
// ✅ DEPOIS
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"

<FormField
  control={form.control}
  name="cfopDentroEstadoId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>CFOP Dentro do Estado</FormLabel>
      <div className="flex gap-2">
        <CFOPCombobox
          value={field.value}
          onValueChange={field.onChange}
          tipo="SAIDA"
          placeholder="Selecione o CFOP"
          className="flex-1"
        />
        {field.value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => field.onChange(undefined)}
          >
            ×
          </Button>
        )}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### CFOP Fora do Estado
```typescript
<CFOPCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="SAIDA"
  placeholder="Selecione o CFOP"
/>
```

#### CFOP Exterior
```typescript
<CFOPCombobox
  value={field.value}
  onValueChange={field.onChange}
  tipo="SAIDA"
  placeholder="Selecione o CFOP"
/>
```

**Remover**:
- Estado `cfops` e `loadingCfops`
- useEffect de carregamento de CFOPs
- Lógica de filtro manual de CFOPs
- Imports de Select não utilizados

---

## 🔧 Checklist de Implementação

### Fase 1: Produto Form ⏳
- [ ] Importar comboboxes necessários
- [ ] Substituir NCM Select → NCMCombobox
- [ ] Substituir CST ICMS Select → CSTCombobox (tipo="ICMS")
- [ ] Substituir CSOSN Select → CSOSNCombobox
- [ ] Substituir CST PIS Select → CSTCombobox (tipo="PIS")
- [ ] Substituir CST COFINS Select → CSTCombobox (tipo="COFINS")
- [ ] Substituir CST IPI Select → CSTCombobox (tipo="IPI")
- [ ] Remover estados e useEffects obsoletos
- [ ] Remover imports não utilizados
- [ ] Testar formulário completo

### Fase 2: Natureza Operação Form ⏳
- [ ] Importar CFOPCombobox
- [ ] Substituir CFOP Dentro Select → CFOPCombobox
- [ ] Substituir CFOP Fora Select → CFOPCombobox
- [ ] Substituir CFOP Exterior Select → CFOPCombobox
- [ ] Manter botão × para limpar seleção
- [ ] Remover estados e useEffects obsoletos
- [ ] Remover imports não utilizados
- [ ] Testar formulário completo

### Fase 3: Testes Finais ⏳
- [ ] Testar cadastro de produto
- [ ] Testar edição de produto
- [ ] Testar cadastro de natureza
- [ ] Testar edição de natureza
- [ ] Validar performance
- [ ] Validar UX de busca
- [ ] Validar acessibilidade

---

## 📊 Benefícios Esperados

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Busca** | ❌ Não | ✅ Sim (código + descrição) |
| **UX CFOP** | ❌ Scroll em 500 itens | ✅ Busca instantânea |
| **UX NCM** | ❌ Carrega tudo | ✅ Lazy loading |
| **Performance** | ⚠️ Lenta | ✅ Rápida |
| **Código** | ❌ Duplicado | ✅ Reutilizável |
| **Manutenção** | ❌ Difícil | ✅ Fácil |

---

## 🎯 Resultado Final

**Produto Form**:
- 6 selects → 6 comboboxes com busca
- Código limpo e reutilizável
- UX profissional

**Natureza Form**:
- 3 selects → 3 comboboxes com busca
- Filtro automático por tipo
- Performance otimizada

**Total**:
- 9 selects substituídos
- Componentes reutilizáveis
- Código 50% menor
- UX 10x melhor

