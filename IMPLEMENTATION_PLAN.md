# 📋 PLANO DE IMPLEMENTAÇÃO - CONFIGURAÇÕES FISCAIS

## 🎯 OBJETIVO
Replicar a estrutura de configurações de **NFe** para:
- **NFC-e** (Nota Fiscal de Consumidor Eletrônica)
- **CT-e** (Conhecimento de Transporte Eletrônico)
- **MDF-e** (Manifesto de Documentos Fiscais Eletrônico)
- **NFS-e** (Nota Fiscal de Serviços Eletrônica)

---

## 📊 ANÁLISE DA ESTRUTURA ATUAL (NFe)

### 🗄️ **1. BANCO DE DADOS (Prisma)**

#### **Model: ConfiguracaoNfe**
```prisma
model ConfiguracaoNfe {
  id         String @id @default(cuid())
  emitenteId String @unique
  
  // Ambiente Ativo
  ambienteAtivo Int @default(2) // 1=Produção, 2=Homologação
  
  // Configurações PRODUÇÃO
  serieProducao                 Int     @default(1)
  proximoNumeroProducao         Int     @default(1)
  tipoFreteProducao             Int?    @default(1)
  indicadorPresencaProducao     Int?    @default(2)
  orientacaoImpressaoProducao   Int?    @default(1)
  ieSubstitutoProducao          String? @db.VarChar(20)
  observacoesProducao           String? @db.Text
  documentosAutorizadosProducao String? @db.Text
  
  // Configurações HOMOLOGAÇÃO (mesmos campos)
  serieHomologacao                 Int     @default(1)
  proximoNumeroHomologacao         Int     @default(1)
  // ... (mesmos campos)
  
  // Modelo
  modeloNfe String @default("4.00") @db.VarChar(10)
  
  // Controle
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  emitente Emitente @relation(fields: [emitenteId], references: [id], onDelete: Cascade)
  
  @@map("configuracoes_nfe")
}
```

#### **Model: InutilizacaoNfe**
```prisma
model InutilizacaoNfe {
  id         String @id @default(cuid())
  emitenteId String @unique
  
  // Inutilização PRODUÇÃO
  numeroInicialInutilizarProducao Int?
  numeroFinalInutilizarProducao   Int?
  serieInutilizarProducao         Int?
  anoInutilizarProducao           Int?
  justificativaInutilizarProducao String? @db.Text
  
  // Inutilização HOMOLOGAÇÃO (mesmos campos)
  numeroInicialInutilizarHomologacao Int?
  // ...
  
  // Controle
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  emitente Emitente @relation(fields: [emitenteId], references: [id], onDelete: Cascade)
  
  @@map("inutilizacoes_nfe")
}
```

---

### 🔧 **2. BACKEND (NestJS)**

#### **Estrutura de Módulos**
```
backend/src/modules/
├── configuracao-nfe/
│   ├── dto/
│   │   ├── create-configuracao-nfe.dto.ts
│   │   └── update-configuracao-nfe.dto.ts
│   ├── configuracao-nfe.controller.ts
│   ├── configuracao-nfe.service.ts
│   └── configuracao-nfe.module.ts
│
└── inutilizacao-nfe/
    ├── dto/
    │   ├── create-inutilizacao-nfe.dto.ts
    │   └── update-inutilizacao-nfe.dto.ts
    ├── inutilizacao-nfe.controller.ts
    ├── inutilizacao-nfe.service.ts
    └── inutilizacao-nfe.module.ts
```

#### **Endpoints**
```
GET  /configuracoes-nfe/:emitenteId    # Buscar configuração
POST /configuracoes-nfe/:emitenteId    # Criar/Atualizar configuração

GET  /inutilizacoes-nfe/:emitenteId    # Buscar inutilização
POST /inutilizacoes-nfe/:emitenteId    # Criar/Atualizar inutilização
```

#### **Validações (class-validator)**
```typescript
// Série: 1-999
@IsInt()
@Min(1)
@Max(999)
@IsOptional()
serieProducao?: number;

// Ano: 2000-2100
@IsInt()
@Min(2000)
@Max(2100)
@IsOptional()
anoInutilizarProducao?: number;

// Justificativa: mínimo 15 caracteres
@IsString()
@MinLength(15, { message: 'Justificativa deve ter no mínimo 15 caracteres' })
@IsOptional()
justificativaInutilizarProducao?: string;
```

---

### 🎨 **3. FRONTEND (React + Next.js)**

#### **Estrutura de Arquivos**
```
frontend/
├── app/configuracoes/fiscal/nfe/
│   └── page.tsx
│
├── components/configuracoes/fiscal/
│   ├── nfe-form.tsx
│   └── nfe-form-tabs.tsx
│
└── lib/services/
    ├── configuracao-nfe.service.ts
    └── inutilizacao-nfe.service.ts
```

#### **Componentes**
1. **nfe-form.tsx** - Formulário principal com:
   - Switch "Habilitar emissões em homologação?"
   - Tabs Produção/Homologação
   - Botão Salvar

2. **nfe-form-tabs.tsx** - Campos do formulário:
   - NfeConfigFields (série, número, frete, etc.)
   - NfeInutilizacaoFields (número inicial/final, ano, justificativa)

#### **Services**
```typescript
// ConfiguracaoNfeService
static async getByEmitente(emitenteId: string)
static async upsert(emitenteId: string, data: ConfiguracaoNfeData)

// InutilizacaoNfeService
static async getByEmitente(emitenteId: string)
static async upsert(emitenteId: string, data: InutilizacaoNfeData)
```

---

## 🔄 MAPEAMENTO PARA OUTROS DOCUMENTOS

### **NFC-e (Nota Fiscal de Consumidor)**
- ✅ Mesma estrutura de NFe
- ✅ Campos específicos: CSC (Código de Segurança do Contribuinte), CSCid
- ✅ Sem inutilização (usa contingência offline)

### **CT-e (Conhecimento de Transporte)**
- ✅ Mesma estrutura base
- ✅ Campos específicos: tipo de serviço, modal de transporte
- ✅ Com inutilização

### **MDF-e (Manifesto de Documentos Fiscais)**
- ✅ Mesma estrutura base
- ✅ Campos específicos: tipo de emitente, tipo de transportador
- ✅ Com inutilização

### **NFS-e (Nota Fiscal de Serviços)**
- ✅ Estrutura diferente (cada município tem suas regras)
- ✅ Campos específicos: código de serviço, alíquota ISS
- ❌ Sem inutilização (não existe no padrão)

---

## 📝 CAMPOS ESPECÍFICOS POR DOCUMENTO

### **NFC-e**
```typescript
// Adicionar em ConfiguracaoNfce
csc: string           // Código de Segurança do Contribuinte
cscId: number         // ID do CSC
```

### **CT-e**
```typescript
// Adicionar em ConfiguracaoCte
tipoServico: number   // 0=Normal, 1=Subcontratação, etc.
modalTransporte: number // 01=Rodoviário, 02=Aéreo, etc.
```

### **MDF-e**
```typescript
// Adicionar em ConfiguracaoMdfe
tipoEmitente: number      // 1=Prestador, 2=Transportador
tipoTransportador: number // 1=ETC, 2=TAC, 3=CTC
```

### **NFS-e**
```typescript
// Adicionar em ConfiguracaoNfse
codigoMunicipio: string
codigoServico: string
aliquotaIss: number
itemListaServico: string
// Sem inutilização
```

---

## 🎯 PRÓXIMOS PASSOS

Ver task list para implementação detalhada.

