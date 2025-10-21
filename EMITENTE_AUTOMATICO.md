# ✅ Emitente Automático - Sistema Simplificado

## 🎯 Problema Identificado

O usuário estava correto: **o emitente deveria ser fixo e automático**, pois:
- ✅ O sistema pertence a UMA empresa (um emitente)
- ✅ Não faz sentido selecionar emitente a cada NFe
- ✅ O emitente é configurado uma vez no sistema
- ✅ Todas as NFes são emitidas pelo mesmo emitente

---

## 🔧 Solução Implementada

### **Backend**

#### **1. Novo Método no EmitenteService**
**Arquivo:** `backend/src/modules/emitente/emitente.service.ts`

```typescript
async getEmitenteAtivo() {
  const emitente = await this.prisma.emitente.findFirst({
    where: { ativo: true },
    include: {
      municipio: { include: { estado: true } },
      estado: true,
    },
    orderBy: { createdAt: 'asc' }, // Pega o primeiro cadastrado
  });

  if (!emitente) {
    throw new NotFoundException(
      'Nenhum emitente ativo encontrado. Configure um emitente antes de emitir NFe.'
    );
  }

  return emitente;
}
```

**Funcionalidade:**
- ✅ Busca o primeiro emitente ativo do sistema
- ✅ Retorna erro se não houver emitente configurado
- ✅ Inclui todos os relacionamentos necessários

---

#### **2. Nova Rota no Controller**
**Arquivo:** `backend/src/modules/emitente/emitente.controller.ts`

```typescript
@Get('ativo/principal')
getEmitenteAtivo() {
  return this.emitenteService.getEmitenteAtivo();
}
```

**Endpoint:** `GET /api/emitentes/ativo/principal`

---

#### **3. Atualização no NfeService**
**Arquivo:** `backend/src/modules/nfe/nfe.service.ts`

**Antes:**
```typescript
async create(createNfeDto: CreateNfeDto) {
  // Verificar se emitente existe
  const emitente = await this.emitenteService.findOne(createNfeDto.emitenteId);
  
  // Obter próximo número
  const proximoNumero = await this.emitenteService.getProximoNumeroNfe(
    createNfeDto.emitenteId
  );
  
  // Criar NFe
  const nfe = await this.prisma.nfe.create({
    data: {
      emitenteId: createNfeDto.emitenteId,
      serie: createNfeDto.serie,
      // ...
    }
  });
}
```

**Depois:**
```typescript
async create(createNfeDto: CreateNfeDto) {
  // Buscar emitente ativo (sempre o mesmo para o sistema)
  const emitente = await this.emitenteService.getEmitenteAtivo();
  
  // Obter próximo número
  const proximoNumero = await this.emitenteService.getProximoNumeroNfe(
    emitente.id
  );
  
  // Criar NFe
  const nfe = await this.prisma.nfe.create({
    data: {
      emitenteId: emitente.id, // Usar emitente ativo
      serie: createNfeDto.serie || emitente.serieNfe, // Usar série do emitente
      // ...
    }
  });
}
```

**Mudanças:**
- ✅ Busca automaticamente o emitente ativo
- ✅ Usa a série configurada no emitente se não informada
- ✅ Não precisa mais receber `emitenteId` no DTO

---

#### **4. Atualização no DTO**
**Arquivo:** `backend/src/modules/nfe/dto/create-nfe.dto.ts`

**Antes:**
```typescript
export class CreateNfeDto {
  @IsString()
  emitenteId: string; // OBRIGATÓRIO

  @IsInt()
  serie: number; // OBRIGATÓRIO
}
```

**Depois:**
```typescript
export class CreateNfeDto {
  // Emitente é opcional - será buscado automaticamente
  @IsOptional()
  @IsString()
  emitenteId?: string;

  // Série é opcional - será usada a série do emitente
  @IsOptional()
  @IsInt()
  serie?: number;
}
```

---

### **Frontend**

#### **1. Novo Método no EmitenteService**
**Arquivo:** `frontend/lib/services/emitente.service.ts`

```typescript
static async getEmitenteAtivo(): Promise<Emitente> {
  const response = await fetch(`${API_BASE_URL}/emitentes/ativo/principal`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'Erro ao buscar emitente ativo'
    );
  }
  return response.json();
}
```

---

#### **2. Atualização no NfeForm**
**Arquivo:** `frontend/components/nfe/nfe-form.tsx`

**Mudanças:**

**Estado:**
```typescript
// ANTES
const [emitentes, setEmitentes] = useState<any[]>([])
const [emitenteId, setEmitenteId] = useState("")

// DEPOIS
const [emitente, setEmitente] = useState<any>(null) // Apenas um emitente
```

**Carregamento:**
```typescript
// ANTES
const results = await Promise.allSettled([
  EmitenteService.getAll({ page: 1, limit: 100 }),
  // ...
])

// DEPOIS
const results = await Promise.allSettled([
  EmitenteService.getEmitenteAtivo(), // Buscar apenas o ativo
  // ...
])
```

**Validação:**
```typescript
// ANTES
if (!emitenteId) {
  toast.error("Selecione um emitente")
  return
}

// DEPOIS
if (!emitente) {
  toast.error("Emitente não configurado. Configure um emitente ativo.")
  return
}
```

**Envio:**
```typescript
// ANTES
const data = {
  emitenteId,
  clienteId,
  serie,
  // ...
}

// DEPOIS
const data = {
  // emitenteId não é mais necessário
  clienteId,
  serie, // Opcional - usa do emitente se não informado
  // ...
}
```

---

#### **3. Interface Visual**

**ANTES:**
```tsx
<div>
  <Label htmlFor="emitente">Emitente *</Label>
  <Select value={emitenteId} onValueChange={setEmitenteId}>
    <SelectTrigger>
      <SelectValue placeholder="Selecione o emitente" />
    </SelectTrigger>
    <SelectContent>
      {emitentes.map((emitente) => (
        <SelectItem key={emitente.id} value={emitente.id}>
          {emitente.razaoSocial}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

**DEPOIS:**
```tsx
{/* Card informativo do Emitente */}
{emitente && (
  <div className="p-4 bg-muted rounded-lg border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Emitente</p>
        <p className="text-lg font-semibold">{emitente.razaoSocial}</p>
        <p className="text-sm text-muted-foreground">
          CNPJ: {emitente.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-muted-foreground">Série NFe</p>
        <p className="text-2xl font-bold">{emitente.serieNfe || 1}</p>
      </div>
    </div>
  </div>
)}
```

---

## 🎨 Resultado Visual

### **Antes:**
```
┌─────────────────────────────────────┐
│ Emitente *                          │
│ ┌─────────────────────────────────┐ │
│ │ Selecione o emitente        ▼  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **Depois:**
```
┌─────────────────────────────────────────────────────┐
│ Emitente                              Série NFe     │
│ Minha Empresa LTDA                         1        │
│ CNPJ: 12.345.678/0001-90                            │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Benefícios

### **1. Simplicidade**
- ✅ Usuário não precisa selecionar emitente a cada NFe
- ✅ Menos campos no formulário
- ✅ Menos chance de erro

### **2. Lógica de Negócio**
- ✅ Reflete a realidade: um sistema = uma empresa
- ✅ Emitente é configuração do sistema, não dado da NFe
- ✅ Série NFe vem automaticamente do emitente

### **3. Segurança**
- ✅ Impossível emitir NFe com emitente errado
- ✅ Validação automática de emitente ativo
- ✅ Erro claro se emitente não configurado

### **4. Manutenção**
- ✅ Código mais limpo
- ✅ Menos validações
- ✅ Menos estado para gerenciar

---

## 🔄 Fluxo Atualizado

### **Criação de NFe**

```
1. Usuário acessa /nfes/nova
   ↓
2. Sistema busca emitente ativo automaticamente
   ↓
3. Exibe card informativo com dados do emitente
   ↓
4. Usuário preenche apenas:
   - Cliente
   - Itens
   - Totalizadores
   - Duplicatas
   ↓
5. Sistema cria NFe com emitente ativo
```

---

## 📊 Comparação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Campos no formulário** | Emitente (select) | Card informativo |
| **Validação** | Manual | Automática |
| **Série NFe** | Manual | Do emitente |
| **Possibilidade de erro** | Alta | Baixa |
| **Experiência do usuário** | Confusa | Simples |
| **Lógica de negócio** | Incorreta | Correta |

---

## 🚀 Como Configurar

### **1. Cadastrar Emitente**
```
1. Acesse /configuracoes/emitente
2. Preencha os dados da empresa
3. Configure certificado digital
4. Defina série NFe
5. Marque como ativo
6. Salve
```

### **2. Criar NFe**
```
1. Acesse /nfes/nova
2. Sistema carrega emitente automaticamente
3. Preencha apenas cliente e itens
4. Salve
```

---

## ⚠️ Validações

### **Backend**
```typescript
// Se não houver emitente ativo
throw new NotFoundException(
  'Nenhum emitente ativo encontrado. Configure um emitente antes de emitir NFe.'
);
```

### **Frontend**
```typescript
// Se não carregar emitente
if (results[0].status === 'rejected') {
  toast.error("Erro ao carregar emitente. Configure um emitente ativo.");
  return; // Não permite continuar
}
```

---

## 📁 Arquivos Modificados

### **Backend**
- ✅ `backend/src/modules/emitente/emitente.service.ts`
- ✅ `backend/src/modules/emitente/emitente.controller.ts`
- ✅ `backend/src/modules/nfe/nfe.service.ts`
- ✅ `backend/src/modules/nfe/dto/create-nfe.dto.ts`

### **Frontend**
- ✅ `frontend/lib/services/emitente.service.ts`
- ✅ `frontend/components/nfe/nfe-form.tsx`

---

## 🎉 Conclusão

**O sistema agora reflete corretamente a lógica de negócio:**
- 🏢 Um sistema = Uma empresa (emitente)
- 📄 Emitente é configuração, não dado da NFe
- ✅ Interface mais simples e intuitiva
- 🔒 Menos chance de erros
- 🚀 Melhor experiência do usuário

---

**Status:** 🟢 **Emitente Automático 100% Implementado!**

