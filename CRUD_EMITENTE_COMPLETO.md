# ✅ CRUD Emitente Completo - Configuração Única

## 🎯 Conceito

**Emitente é CONFIGURAÇÃO, não cadastro múltiplo!**

- ✅ Um sistema = Uma empresa (emitente)
- ✅ Página de configuração simples
- ✅ Sem listagem, sem dialog
- ✅ Formulário direto com abas
- ✅ Carrega automaticamente se já existe
- ✅ Cria novo se não existe

---

## 📁 Estrutura Criada

```
frontend/
├── app/
│   └── configuracoes/
│       └── emitente/
│           └── page.tsx                    ✅ Página principal
└── components/
    └── configuracoes/
        └── emitente/
            └── emitente-form.tsx           ✅ Formulário completo
```

**Arquivos Removidos:**
- ❌ `emitente-form-dialog.tsx` (não precisa de dialog)
- ❌ `emitente-section-cards.tsx` (não precisa de cards)
- ❌ `emitente-config-form.tsx` (substituído)
- ❌ `emitentes-data-table.tsx` (não precisa de listagem)

---

## 🎨 Interface

### **Página: `/configuracoes/emitente`**

```
┌─────────────────────────────────────────────────────────┐
│ Configuração do Emitente                                │
│ Configure os dados da sua empresa para emissão de NFe  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ⚠️ Primeiro Acesso (se não houver emitente)            │
│ Configure os dados da sua empresa para começar a       │
│ emitir NFes.                                            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [Dados Básicos] [Endereço] [Contato] [Configurações NFe]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─ Dados da Empresa ─────────────────────────────────┐ │
│ │                                                      │ │
│ │ CNPJ *              Razão Social *                  │ │
│ │ [00000000000000]    [Razão Social da Empresa]      │ │
│ │                                                      │ │
│ │ Nome Fantasia       Inscrição Estadual *            │ │
│ │ [Nome Fantasia]     [000000000000]                  │ │
│ │                                                      │ │
│ │ Inscrição Municipal CNAE *                          │ │
│ │ [00000000]          [0000000]                       │ │
│ │                                                      │ │
│ │ Regime Tributário * Emitente Ativo                  │ │
│ │ [Simples Nacional▼] [●────]                         │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│                                    [Salvar Configurações]│
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Funcionalidades

### **1. Carregamento Automático**
```typescript
useEffect(() => {
  loadInitialData()
}, [])

const loadInitialData = async () => {
  // Carregar estados
  await loadEstados()
  
  // Tentar carregar emitente ativo
  try {
    const emitente = await EmitenteService.getEmitenteAtivo()
    setEmitenteId(emitente.id)
    form.reset(emitente) // Preenche formulário
  } catch (error) {
    // Emitente não existe, mantém valores padrão
  }
}
```

### **2. Salvamento Inteligente**
```typescript
const onSubmit = async (data) => {
  if (emitenteId) {
    // Atualizar emitente existente
    await EmitenteService.update(emitenteId, data)
    toast.success("Emitente atualizado!")
  } else {
    // Criar novo emitente
    const emitente = await EmitenteService.create(data)
    setEmitenteId(emitente.id)
    toast.success("Emitente cadastrado!")
  }
}
```

---

## 🎯 Abas do Formulário

### **Aba 1: Dados Básicos**
- ✅ CNPJ (14 dígitos, formatação automática)
- ✅ Razão Social
- ✅ Nome Fantasia (opcional)
- ✅ Inscrição Estadual
- ✅ Inscrição Municipal (opcional)
- ✅ CNAE
- ✅ Regime Tributário (select)
  - Simples Nacional
  - Simples Nacional - Excesso
  - Regime Normal
- ✅ Emitente Ativo (switch)

### **Aba 2: Endereço**
- ✅ CEP (8 dígitos, formatação automática)
- ✅ Logradouro
- ✅ Número
- ✅ Complemento (opcional)
- ✅ Bairro
- ✅ Estado (select, carrega da API)
- ✅ Município (select, carrega baseado no estado)

### **Aba 3: Contato**
- ✅ Telefone (opcional)
- ✅ Email (opcional, validação de email)
- ✅ Site (opcional)

### **Aba 4: Configurações NFe**
- ✅ Ambiente NFe (select)
  - Produção
  - Homologação
- ✅ Série NFe (número, 1-999)
- ✅ Próximo Número NFe (número, mínimo 1)
- ⚠️ Certificado Digital (em desenvolvimento)

---

## ✅ Validações

### **Campos Obrigatórios**
```typescript
const emitenteSchema = z.object({
  cnpj: z.string().min(14).max(14),              // Obrigatório
  razaoSocial: z.string().min(3),                // Obrigatório
  inscricaoEstadual: z.string().min(1),          // Obrigatório
  cnae: z.string().min(1),                       // Obrigatório
  regimeTributario: z.number().min(1).max(3),    // Obrigatório
  logradouro: z.string().min(3),                 // Obrigatório
  numero: z.string().min(1),                     // Obrigatório
  bairro: z.string().min(2),                     // Obrigatório
  cep: z.string().min(8).max(8),                 // Obrigatório
  municipioId: z.string().min(1),                // Obrigatório
  estadoId: z.string().min(1),                   // Obrigatório
  ambienteNfe: z.number().min(1).max(2),         // Obrigatório
  serieNfe: z.number().min(1).max(999),          // Obrigatório
  proximoNumeroNfe: z.number().min(1),           // Obrigatório
  
  // Opcionais
  nomeFantasia: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  complemento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  site: z.string().optional(),
  ativo: z.boolean().default(true),
})
```

### **Formatações Automáticas**
```typescript
// CNPJ: Remove não-dígitos, limita a 14
const formatCNPJ = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 14)
}

// CEP: Remove não-dígitos, limita a 8
const formatCEP = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 8)
}
```

---

## 🔄 Fluxo de Uso

### **Primeiro Acesso (Sem Emitente)**
```
1. Usuário acessa /configuracoes/emitente
   ↓
2. Sistema tenta carregar emitente ativo
   ↓
3. Não encontra (404)
   ↓
4. Exibe alerta: "Primeiro Acesso"
   ↓
5. Formulário vazio com valores padrão
   ↓
6. Usuário preenche dados
   ↓
7. Clica em "Salvar Configurações"
   ↓
8. Sistema cria emitente (POST)
   ↓
9. Toast: "Emitente cadastrado com sucesso!"
   ↓
10. Formulário agora em modo edição
```

### **Acessos Seguintes (Com Emitente)**
```
1. Usuário acessa /configuracoes/emitente
   ↓
2. Sistema carrega emitente ativo
   ↓
3. Preenche formulário automaticamente
   ↓
4. Usuário edita dados
   ↓
5. Clica em "Atualizar Configurações"
   ↓
6. Sistema atualiza emitente (PATCH)
   ↓
7. Toast: "Emitente atualizado com sucesso!"
```

---

## 🎨 Padrão de Design

### **Seguindo o Sistema**
- ✅ Layout com Sidebar + Header
- ✅ Título e descrição no topo
- ✅ Formulário com abas (Tabs)
- ✅ Cards para agrupar seções
- ✅ Validação com react-hook-form + zod
- ✅ Feedback com toast (sonner)
- ✅ Loading states (Skeleton)
- ✅ Botões com ícones (Tabler Icons)

### **Componentes UI Utilizados**
```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
```

---

## 📊 Integração com Backend

### **Endpoints Utilizados**
```typescript
// Buscar emitente ativo
GET /api/emitentes/ativo/principal
→ 200 OK: { id, cnpj, razaoSocial, ... }
→ 404 Not Found: { message: "Nenhum emitente ativo..." }

// Criar emitente
POST /api/emitentes
Body: { cnpj, razaoSocial, ... }
→ 201 Created: { id, cnpj, razaoSocial, ... }

// Atualizar emitente
PATCH /api/emitentes/:id
Body: { cnpj, razaoSocial, ... }
→ 200 OK: { id, cnpj, razaoSocial, ... }

// Buscar estados
GET /api/estados
→ 200 OK: [{ id, uf, nome }, ...]

// Buscar municípios
GET /api/municipios?estadoId=:id
→ 200 OK: [{ id, nome, codigoIbge }, ...]
```

---

## ✅ Resultado Final

**Página de configuração simples e direta:**
- 🏢 Um formulário, uma empresa
- 📋 4 abas organizadas
- ✅ Validações completas
- 🔄 Carregamento automático
- 💾 Salvamento inteligente
- 🎨 Design consistente com o sistema
- 📱 Responsivo
- ♿ Acessível

---

**Status:** 🟢 **CRUD Emitente 100% Completo!**

