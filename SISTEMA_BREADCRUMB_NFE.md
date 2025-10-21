# 🧭 Sistema de Breadcrumb e Workflow - NFe

## 📊 Visão Geral

Sistema completo de navegação e rastreamento do processo de criação e emissão de NFe, com breadcrumb visual e gerenciamento de estados.

---

## 🎯 Componentes Criados

### **1. `NfeBreadcrumb` - Componente Visual**
**Arquivo:** `frontend/components/nfe/nfe-breadcrumb.tsx`

#### Funcionalidades:
- ✅ Breadcrumb de navegação (Home → NFes → Página Atual)
- ✅ Steps visuais do processo (Digitação → Revisão → Transmissão → Autorizada)
- ✅ Indicadores de progresso com cores
- ✅ Informações da NFe (número e série)
- ✅ Responsivo (oculta descrições em mobile)

#### Props:
```typescript
interface NfeBreadcrumbProps {
  nfeNumero?: string
  nfeSerie?: number
  currentStep?: 'digitacao' | 'revisao' | 'transmissao' | 'autorizada'
}
```

#### Uso:
```tsx
<NfeBreadcrumb 
  nfeNumero="000123" 
  nfeSerie={1} 
  currentStep="revisao" 
/>
```

---

### **2. `useNfeWorkflow` - Hook de Gerenciamento**
**Arquivo:** `frontend/hooks/nfe/use-nfe-workflow.ts`

#### Funcionalidades:
- ✅ Gerenciamento de estado do workflow
- ✅ Navegação entre etapas
- ✅ Validações de transição
- ✅ Salvamento de NFe
- ✅ Transmissão para SEFAZ

#### Métodos:
```typescript
const workflow = useNfeWorkflow(nfeId)

// Navegação
workflow.goToNext()        // Avançar para próxima etapa
workflow.goToPrevious()    // Voltar para etapa anterior
workflow.goToStep('revisao') // Ir para etapa específica

// Controle
workflow.setCanGoNext(true)
workflow.setCanGoPrevious(true)
workflow.updateNfeInfo(id, numero, serie)

// Ações
workflow.saveDigitacao(data)
workflow.cancel()
```

#### Estado:
```typescript
interface NfeWorkflowState {
  currentStep: 'digitacao' | 'revisao' | 'transmissao' | 'autorizada'
  nfeId?: string
  nfeNumero?: number
  nfeSerie?: number
  canGoNext: boolean
  canGoPrevious: boolean
  isProcessing: boolean
}
```

---

## 🔄 Fluxo Completo do Processo

### **Etapa 1: Digitação** (`/nfes/nova`)
**Status:** Criação da NFe

**Ações Disponíveis:**
- ✅ Preencher dados gerais
- ✅ Adicionar itens
- ✅ Configurar totalizadores
- ✅ Adicionar duplicatas
- ✅ Salvar NFe

**Navegação:**
- ⬅️ Voltar: Cancelar (volta para `/nfes`)
- ➡️ Avançar: Ir para Revisão (após salvar)

**Validações:**
- Emitente obrigatório
- Cliente obrigatório
- Pelo menos 1 item
- Soma duplicatas = valor total

---

### **Etapa 2: Revisão** (`/nfes/[id]/revisar`)
**Status:** Conferência dos dados

**Ações Disponíveis:**
- ✅ Visualizar todos os dados
- ✅ Validar NFe
- ✅ Identificar erros

**Navegação:**
- ⬅️ Voltar: Editar NFe
- ➡️ Avançar: Transmitir (se válida)

**Validações Automáticas:**
- ✅ Dados básicos completos
- ✅ Itens presentes
- ✅ Totais corretos
- ✅ Duplicatas conferem

**Alertas:**
- 🟢 NFe válida → Pode prosseguir
- 🔴 Erros encontrados → Lista de erros

---

### **Etapa 3: Transmissão** (`/nfes/[id]/transmitir`)
**Status:** Envio para SEFAZ

**Ações Disponíveis:**
- ✅ Transmitir NFe
- ✅ Acompanhar progresso

**Navegação:**
- ⬅️ Voltar: Revisão
- ➡️ Avançar: Automático após sucesso

**Processo:**
1. Validando dados (20%)
2. Gerando XML (40%)
3. Assinando digitalmente (60%)
4. Enviando para SEFAZ (80%)
5. Autorizada (100%)

**Feedback:**
- 🔵 Processando → Barra de progresso
- 🟢 Sucesso → Redireciona para visualização
- 🔴 Erro → Mensagem de erro

---

### **Etapa 4: Autorizada** (`/nfes/[id]`)
**Status:** NFe autorizada

**Ações Disponíveis:**
- ✅ Visualizar NFe completa
- ✅ Baixar XML
- ✅ Baixar PDF (DANFE)
- ✅ Cancelar NFe (se permitido)

**Navegação:**
- ⬅️ Voltar: Lista de NFes
- ➡️ Avançar: Não disponível

---

## 📁 Estrutura de Arquivos

```
frontend/
├── components/
│   └── nfe/
│       ├── nfe-breadcrumb.tsx          ✅ Componente visual
│       ├── nfe-form.tsx                ✅ Formulário (etapa 1)
│       ├── nfe-form-wrapper.tsx        ✅ Wrapper
│       └── nfe-details.tsx             ✅ Visualização
├── hooks/
│   └── nfe/
│       └── use-nfe-workflow.ts         ✅ Hook de gerenciamento
├── app/
│   └── nfes/
│       ├── page.tsx                    ✅ Listagem
│       ├── nova/
│       │   └── page.tsx                ✅ Etapa 1: Digitação
│       └── [id]/
│           ├── page.tsx                ✅ Etapa 4: Visualização
│           ├── editar/
│           │   └── page.tsx            ✅ Edição (volta para etapa 1)
│           ├── revisar/
│           │   └── page.tsx            ✅ Etapa 2: Revisão
│           └── transmitir/
│               └── page.tsx            ✅ Etapa 3: Transmissão
└── lib/
    └── services/
        └── nfe.service.ts              ✅ Métodos de API
```

---

## 🎨 Componentes UI Utilizados

### **Breadcrumb**
```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

### **Progress**
```tsx
import { Progress } from "@/components/ui/progress"
```

### **Alert**
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

---

## 🔧 Integração com Backend

### **Endpoints Utilizados**

#### **1. Salvar NFe (Digitação)**
```typescript
POST /api/nfes
PATCH /api/nfes/:id
```

#### **2. Buscar NFe (Revisão)**
```typescript
GET /api/nfes/:id
```

#### **3. Transmitir NFe**
```typescript
POST /api/nfes/:id/transmitir
```

#### **4. Consultar Status**
```typescript
POST /api/nfes/:id/consultar
```

#### **5. Cancelar NFe**
```typescript
POST /api/nfes/:id/cancelar
```

---

## 📊 Estados da NFe

```typescript
enum NfeStatus {
  DIGITACAO = 'DIGITACAO',      // Em edição
  AUTORIZADA = 'AUTORIZADA',    // Autorizada pela SEFAZ
  CANCELADA = 'CANCELADA',      // Cancelada
  REJEITADA = 'REJEITADA',      // Rejeitada pela SEFAZ
}
```

---

## 🎯 Validações por Etapa

### **Digitação**
- ✅ Emitente selecionado
- ✅ Cliente selecionado
- ✅ Natureza da operação preenchida
- ✅ Pelo menos 1 item
- ✅ Valor total > 0
- ✅ Soma duplicatas = valor total (se houver)

### **Revisão**
- ✅ Todas validações da digitação
- ✅ Dados do emitente completos
- ✅ Dados do cliente completos
- ✅ Itens com impostos calculados
- ✅ Totalizadores corretos

### **Transmissão**
- ✅ NFe válida
- ✅ Certificado digital válido
- ✅ Conexão com SEFAZ

---

## 🚀 Como Usar

### **1. Criar Nova NFe**
```tsx
// Usuário acessa /nfes/nova
// Breadcrumb mostra: Home → NFes → Nova NFe
// Steps mostram: [Digitação] → Revisão → Transmissão → Autorizada

// Após preencher e salvar:
const nfeId = await workflow.saveDigitacao(data)
workflow.goToNext() // Vai para /nfes/:id/revisar
```

### **2. Revisar NFe**
```tsx
// Breadcrumb mostra: Home → NFes → Revisar NFe #000123
// Steps mostram: Digitação → [Revisão] → Transmissão → Autorizada

// Se válida:
workflow.goToNext() // Vai para /nfes/:id/transmitir

// Se inválida:
workflow.goToPrevious() // Volta para /nfes/:id/editar
```

### **3. Transmitir NFe**
```tsx
// Breadcrumb mostra: Home → NFes → Transmitir NFe #000123
// Steps mostram: Digitação → Revisão → [Transmissão] → Autorizada

// Ao transmitir:
await NfeService.transmitir(nfeId)
// Redireciona automaticamente para /nfes/:id
```

---

## 🎨 Personalização

### **Cores dos Steps**
```tsx
// Ativo
className="bg-primary border-primary text-primary-foreground"

// Completo
className="bg-primary border-primary text-primary-foreground"

// Desabilitado
className="bg-muted border-muted-foreground/20 text-muted-foreground"
```

### **Ícones**
```tsx
import {
  IconPlus,      // Digitação
  IconEye,       // Revisão
  IconSend,      // Transmissão
  IconFileInvoice, // Autorizada
} from "@tabler/icons-react"
```

---

## ✅ Checklist de Implementação

- ✅ Componente `NfeBreadcrumb` criado
- ✅ Hook `useNfeWorkflow` criado
- ✅ Página de revisão criada
- ✅ Página de transmissão criada
- ✅ Integração com formulário de NFe
- ✅ Validações por etapa
- ✅ Feedback visual de progresso
- ✅ Tratamento de erros
- ✅ Navegação entre etapas
- ✅ Responsividade

---

## 🎉 Resultado Final

**Um sistema completo de workflow para NFe com:**
- 🧭 Navegação clara e intuitiva
- 📊 Rastreamento visual do progresso
- ✅ Validações em cada etapa
- 🔄 Transições suaves entre etapas
- 📱 Interface responsiva
- 🎨 Feedback visual rico

---

**Status:** 🟢 **Sistema de Breadcrumb 100% Completo!**

