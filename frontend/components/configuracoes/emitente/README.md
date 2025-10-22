# Formulário de Emitente - Estrutura Refatorada

## 📁 Estrutura de Arquivos

```
frontend/components/configuracoes/emitente/
├── README.md                           # Documentação
├── types.ts                            # Tipos TypeScript e schemas
├── emitente-form-refactored.tsx       # Componente principal
├── hooks/
│   ├── use-emitente-form.ts           # Hook para gerenciar estado do formulário
│   ├── use-certificado.ts             # Hook para gerenciar certificado
│   ├── use-cnpj-lookup.ts             # Hook para consulta de CNPJ
│   └── use-cep-lookup.ts              # Hook para consulta de CEP
└── sections/
    ├── dados-basicos-section.tsx      # Seção de dados básicos
    ├── endereco-section.tsx           # Seção de endereço
    ├── contato-section.tsx            # Seção de contato
    ├── nfe-section.tsx                # Seção de configurações NFe
    └── certificado-section.tsx        # Seção de certificado digital
```

## 🎯 Princípios de Design

### 1. **Separação de Responsabilidades**
- **Hooks**: Lógica de negócio e estado
- **Sections**: Componentes de UI reutilizáveis
- **Types**: Definições de tipos centralizadas

### 2. **Composição**
- Componentes pequenos e focados
- Fácil de testar e manter
- Reutilizável em outros contextos

### 3. **Type Safety**
- TypeScript em todos os arquivos
- Schemas Zod para validação
- Tipos inferidos automaticamente

## 📚 Documentação dos Componentes

### `types.ts`
Define todos os tipos e schemas de validação:
- `emitenteSchema`: Schema Zod para validação do formulário
- `EmitenteFormData`: Tipo inferido do schema
- `CertificadoInfo`: Informações do certificado validado
- `CertificadoState`: Estado do certificado
- `Estado` e `Municipio`: Tipos para dados auxiliares

### Hooks

#### `use-emitente-form.ts`
Gerencia o estado principal do formulário:
- Carrega dados iniciais do emitente
- Gerencia estados e municípios
- Controla loading states
- Retorna form instance do react-hook-form

**Uso:**
```tsx
const {
  form,
  loading,
  emitenteId,
  estados,
  municipios,
  loadingMunicipios,
} = useEmitenteForm()
```

#### `use-certificado.ts`
Gerencia todo o fluxo do certificado digital:
- Upload de arquivo
- Validação em tempo real
- Gerenciamento de senha
- Upload para o servidor

**Uso:**
```tsx
const {
  certificado,
  handleFileChange,
  handlePasswordChange,
  uploadCertificado,
} = useCertificado()
```

#### `use-cnpj-lookup.ts`
Consulta dados da empresa via CNPJ:
- Consulta API externa
- Preenche formulário automaticamente
- Formatação de CNPJ

**Uso:**
```tsx
const {
  loading: loadingCnpj,
  consultarCnpj,
  formatCNPJ,
} = useCnpjLookup(form)
```

#### `use-cep-lookup.ts`
Consulta endereço via CEP:
- Consulta API ViaCEP
- Preenche endereço automaticamente
- Seleciona estado e município

**Uso:**
```tsx
const {
  loading: loadingCep,
  consultarCep,
  formatCEP,
} = useCepLookup(form, estados, loadMunicipios)
```

### Sections (Componentes de UI)

#### `dados-basicos-section.tsx`
Campos de dados básicos da empresa:
- CNPJ com consulta automática
- Razão Social e Nome Fantasia
- Inscrições (Estadual, Municipal)
- CNAE e Regime Tributário
- Status Ativo

#### `endereco-section.tsx`
Campos de endereço:
- CEP com consulta automática
- Logradouro, Número, Complemento
- Bairro, Estado, Município
- Carregamento automático de municípios

#### `contato-section.tsx`
Campos de contato (opcionais):
- Telefone
- Email
- Site

#### `nfe-section.tsx`
Configurações de NFe:
- Ambiente (Produção/Homologação)
- Série NFe
- Próximo Número NFe

#### `certificado-section.tsx`
Upload e validação de certificado:
- Upload de arquivo .pfx/.p12
- Validação em tempo real
- Exibição de informações do certificado
- Indicadores visuais de status

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    EmitenteFormRefactored                    │
│                   (Componente Principal)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────────────────────┐
                              │                                 │
                    ┌─────────▼─────────┐          ┌───────────▼──────────┐
                    │  useEmitenteForm  │          │   useCertificado     │
                    │   (Estado Geral)  │          │ (Estado Certificado) │
                    └─────────┬─────────┘          └───────────┬──────────┘
                              │                                 │
                    ┌─────────▼─────────┐                      │
                    │  useCnpjLookup    │                      │
                    │  useCepLookup     │                      │
                    └─────────┬─────────┘                      │
                              │                                 │
                    ┌─────────▼─────────────────────────────────▼──────┐
                    │              Sections (UI Components)            │
                    │  - DadosBasicosSection                          │
                    │  - EnderecoSection                              │
                    │  - ContatoSection                               │
                    │  - NfeSection                                   │
                    │  - CertificadoSection                           │
                    └──────────────────────────────────────────────────┘
```

## ✅ Benefícios da Refatoração

### 1. **Manutenibilidade**
- Código organizado e fácil de encontrar
- Cada arquivo tem uma responsabilidade clara
- Fácil adicionar novas funcionalidades

### 2. **Testabilidade**
- Hooks podem ser testados isoladamente
- Componentes de UI são puros
- Lógica separada da apresentação

### 3. **Reutilização**
- Hooks podem ser usados em outros formulários
- Sections podem ser compostas de diferentes formas
- Types compartilhados em todo o projeto

### 4. **Performance**
- Componentes menores = re-renders mais eficientes
- Hooks otimizados com memoization
- Carregamento lazy quando necessário

### 5. **Developer Experience**
- TypeScript completo
- IntelliSense funciona perfeitamente
- Erros detectados em tempo de desenvolvimento

## 🚀 Como Usar

### Adicionar um novo campo

1. Adicione o campo no schema em `types.ts`:
```typescript
export const emitenteSchema = z.object({
  // ... campos existentes
  novoCampo: z.string().optional(),
})
```

2. Adicione o campo na section apropriada:
```tsx
<FormField
  control={form.control}
  name="novoCampo"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Novo Campo</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

### Adicionar uma nova seção

1. Crie um novo arquivo em `sections/`:
```tsx
// sections/nova-secao.tsx
export function NovaSecao({ form }: { form: UseFormReturn<EmitenteFormData> }) {
  return (
    <div className="space-y-4">
      {/* Seus campos aqui */}
    </div>
  )
}
```

2. Adicione no accordion principal:
```tsx
<AccordionItem value="nova-secao" className="border rounded-lg">
  <AccordionTrigger>...</AccordionTrigger>
  <AccordionContent>
    <NovaSecao form={form} />
  </AccordionContent>
</AccordionItem>
```

## 📝 Notas

- O formulário antigo (`emitente-form.tsx`) foi mantido para referência
- Todos os hooks usam TypeScript estrito
- Validação acontece em tempo real via Zod
- Certificado é validado antes de salvar
- Estados e municípios são carregados dinamicamente

