# 📋 Plano de Implementação: Matriz Fiscal

## 📊 Análise do Sistema Atual

### **Estrutura Existente:**

#### **1. Produto**
```prisma
model Produto {
  ncmId: String
  cestId: String?
  cfopId: String? // ✅ Adicionado recentemente
  
  // Impostos configurados por produto
  icmsCstId: String?
  icmsCsosnId: String?
  icmsAliquota: Decimal?
  pisCstId: String?
  pisAliquota: Decimal?
  cofinsCstId: String?
  cofinsAliquota: Decimal?
  ipiCstId: String?
  ipiAliquota: Decimal?
}
```

**Problemas:**
- ❌ Impostos fixos por produto (não considera UF destino)
- ❌ Não diferencia contribuinte vs não contribuinte
- ❌ Difícil manutenção (alterar imposto = alterar todos produtos)
- ❌ Não suporta regras complexas (ex: ST, diferencial alíquota)

#### **2. Natureza de Operação**
```prisma
model NaturezaOperacao {
  cfopDentroEstadoId: String?
  cfopForaEstadoId: String?
  cfopExteriorId: String?
  sobrescreverCfopProduto: Boolean // ✅ Adicionado recentemente
}
```

**Problemas:**
- ❌ Só define CFOP, não define impostos
- ❌ Não considera tipo de cliente
- ❌ Regras limitadas

#### **3. NFe Item**
```typescript
interface NfeItem {
  cfopId: string
  icms: { cstId, aliquota, valor }
  pis: { cstId, aliquota, valor }
  cofins: { cstId, aliquota, valor }
  ipi?: { cstId, aliquota, valor }
}
```

**Problemas:**
- ❌ Usuário precisa preencher manualmente
- ❌ Alto risco de erro
- ❌ Não há automação

---

## 🎯 Solução: Matriz Fiscal

### **Conceito:**

A **Matriz Fiscal** é uma tabela de regras que define automaticamente **todos os impostos** baseado em:

1. **Natureza da Operação** (Venda, Devolução, Transferência, etc)
2. **UF Origem** (Estado do emitente)
3. **UF Destino** (Estado do cliente)
4. **Tipo de Cliente** (Contribuinte ICMS, Não Contribuinte, Exterior)
5. **NCM** (Classificação fiscal do produto)
6. **Regime Tributário** (Simples Nacional, Lucro Presumido, Lucro Real)

### **Exemplo Prático:**

```
Cenário: Venda de mercadoria SP → RJ para contribuinte ICMS

Matriz Fiscal encontrada:
├─ Código: VENDA-SP-RJ-CONTRIB
├─ CFOP: 6102
├─ ICMS: CST 00, Alíquota 12%
├─ PIS: CST 01, Alíquota 1.65%
└─ COFINS: CST 01, Alíquota 7.6%

Resultado: Impostos aplicados automaticamente no item da NFe
```

---

## 🗄️ Modelo de Dados

### **Model MatrizFiscal**

```prisma
model MatrizFiscal {
  id                    String   @id @default(cuid())
  
  // Identificação
  codigo                String   @unique
  descricao             String
  
  // ===== CONDIÇÕES (Quando aplicar) =====
  
  // Natureza da Operação (opcional - null = qualquer)
  naturezaOperacaoId    String?
  
  // UF Origem/Destino (opcional - null = qualquer)
  ufOrigem              String?  // "SP", "RJ", etc
  ufDestino             String?  // "SP", "RJ", etc
  
  // Tipo de Cliente (opcional - null = qualquer)
  tipoCliente           String?  // "contribuinte", "nao_contribuinte", "exterior"
  
  // NCM (opcional - null = qualquer)
  ncmId                 String?
  
  // Regime Tributário (opcional - null = qualquer)
  regimeTributario      Int?     // 1=Simples, 2=Presumido, 3=Real
  
  // ===== RESULTADO (O que aplicar) =====
  
  // CFOP
  cfopId                String
  
  // ICMS
  icmsCstId             String?
  icmsCsosnId           String?
  icmsAliquota          Decimal?
  icmsReducao           Decimal?
  icmsModalidadeBC      Int?     // 0=Margem, 1=Pauta, 2=Máximo, 3=Operação
  
  // ICMS ST
  icmsStAliquota        Decimal?
  icmsStReducao         Decimal?
  icmsStModalidadeBC    Int?
  icmsStMva             Decimal? // Margem Valor Agregado
  
  // IPI
  ipiCstId              String?
  ipiAliquota           Decimal?
  
  // PIS
  pisCstId              String?
  pisAliquota           Decimal?
  
  // COFINS
  cofinsCstId           String?
  cofinsAliquota        Decimal?
  
  // ===== CONTROLE =====
  
  // Prioridade (quanto maior, mais específica)
  // Exemplo: Regra específica (SP->RJ) = 100, Regra genérica (qualquer) = 10
  prioridade            Int      @default(0)
  
  // Ativo/Inativo
  ativo                 Boolean  @default(true)
  
  // Auditoria
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // ===== RELACIONAMENTOS =====
  
  naturezaOperacao      NaturezaOperacao? @relation(fields: [naturezaOperacaoId], references: [id])
  cfop                  CFOP              @relation(fields: [cfopId], references: [id])
  ncm                   NCM?              @relation(fields: [ncmId], references: [id])
  icmsCst               CST?              @relation("MatrizICMSCST", fields: [icmsCstId], references: [id])
  icmsCsosn             CSOSN?            @relation(fields: [icmsCsosnId], references: [id])
  ipiCst                CST?              @relation("MatrizIPICST", fields: [ipiCstId], references: [id])
  pisCst                CST?              @relation("MatrizPISCST", fields: [pisCstId], references: [id])
  cofinsCst             CST?              @relation("MatrizCOFINSCST", fields: [cofinsCstId], references: [id])
  
  @@map("matrizes_fiscais")
  @@index([naturezaOperacaoId, ufOrigem, ufDestino, tipoCliente])
  @@index([prioridade])
}
```

---

## 🔍 Lógica de Busca

### **Algoritmo de Prioridade:**

```typescript
async function buscarMatrizFiscal(params: {
  naturezaOperacaoId: string
  ufOrigem: string
  ufDestino: string
  tipoCliente: 'contribuinte' | 'nao_contribuinte' | 'exterior'
  ncmId: string
  regimeTributario: number
}): Promise<MatrizFiscal | null> {
  
  // Buscar matrizes que se aplicam
  const matrizes = await prisma.matrizFiscal.findMany({
    where: {
      ativo: true,
      AND: [
        // Natureza: específica OU qualquer
        {
          OR: [
            { naturezaOperacaoId: params.naturezaOperacaoId },
            { naturezaOperacaoId: null }
          ]
        },
        // UF Origem: específica OU qualquer
        {
          OR: [
            { ufOrigem: params.ufOrigem },
            { ufOrigem: null }
          ]
        },
        // UF Destino: específica OU qualquer
        {
          OR: [
            { ufDestino: params.ufDestino },
            { ufDestino: null }
          ]
        },
        // Tipo Cliente: específico OU qualquer
        {
          OR: [
            { tipoCliente: params.tipoCliente },
            { tipoCliente: null }
          ]
        },
        // NCM: específico OU qualquer
        {
          OR: [
            { ncmId: params.ncmId },
            { ncmId: null }
          ]
        },
        // Regime: específico OU qualquer
        {
          OR: [
            { regimeTributario: params.regimeTributario },
            { regimeTributario: null }
          ]
        }
      ]
    },
    include: {
      cfop: true,
      icmsCst: true,
      icmsCsosn: true,
      pisCst: true,
      cofinsCst: true,
      ipiCst: true
    },
    orderBy: { prioridade: 'desc' } // Mais específica primeiro
  })
  
  // Retornar a primeira (mais específica)
  return matrizes[0] || null
}
```

### **Sistema de Prioridade:**

| Especificidade | Prioridade | Exemplo |
|----------------|------------|---------|
| Todos os campos preenchidos | 1000 | Venda SP→RJ, Contribuinte, NCM específico |
| 5 campos preenchidos | 500 | Venda SP→RJ, Contribuinte |
| 4 campos preenchidos | 400 | Venda SP→RJ |
| 3 campos preenchidos | 300 | Venda, Contribuinte |
| 2 campos preenchidos | 200 | Venda |
| 1 campo preenchido | 100 | Simples Nacional |
| Nenhum campo (genérica) | 10 | Fallback padrão |

---

## 📝 Exemplos de Matrizes

### **1. Venda Dentro do Estado (SP → SP) - Contribuinte**

```json
{
  "codigo": "VENDA-SP-SP-CONTRIB",
  "descricao": "Venda de mercadoria dentro do estado para contribuinte ICMS",
  "naturezaOperacaoId": "VENDA",
  "ufOrigem": "SP",
  "ufDestino": "SP",
  "tipoCliente": "contribuinte",
  "cfopId": "5102",
  "icmsCstId": "00",
  "icmsAliquota": 18.00,
  "pisCstId": "01",
  "pisAliquota": 1.65,
  "cofinsCstId": "01",
  "cofinsAliquota": 7.60,
  "prioridade": 500
}
```

### **2. Venda Fora do Estado (SP → RJ) - Contribuinte**

```json
{
  "codigo": "VENDA-SP-RJ-CONTRIB",
  "descricao": "Venda de mercadoria para fora do estado - contribuinte ICMS",
  "naturezaOperacaoId": "VENDA",
  "ufOrigem": "SP",
  "ufDestino": "RJ",
  "tipoCliente": "contribuinte",
  "cfopId": "6102",
  "icmsCstId": "00",
  "icmsAliquota": 12.00,
  "pisCstId": "01",
  "pisAliquota": 1.65,
  "cofinsCstId": "01",
  "cofinsAliquota": 7.60,
  "prioridade": 500
}
```

### **3. Simples Nacional (Qualquer UF)**

```json
{
  "codigo": "SIMPLES-NACIONAL",
  "descricao": "Venda Simples Nacional - qualquer destino",
  "naturezaOperacaoId": null,
  "ufOrigem": null,
  "ufDestino": null,
  "tipoCliente": null,
  "regimeTributario": 1,
  "cfopId": "5102",
  "icmsCsosnId": "102",
  "pisCstId": "49",
  "cofinsCstId": "49",
  "prioridade": 100
}
```

---

## 🚀 Plano de Implementação

### **Fase 1: Estrutura Base - Backend** ⏱️ 4h

1.1. Criar Model MatrizFiscal no Prisma
1.2. Gerar e Aplicar Migration
1.3. Criar DTOs (Create/Update)
1.4. Criar MatrizFiscalService
1.5. Criar Seeds de Matrizes Padrão

### **Fase 2: CRUD Matriz Fiscal - Backend** ⏱️ 6h

2.1. Criar MatrizFiscalController
2.2. Implementar Filtros e Busca
2.3. Implementar Paginação
2.4. Adicionar Validações de Negócio

### **Fase 3: Motor de Busca de Matriz** ⏱️ 8h

3.1. Criar Método buscarMatrizFiscal()
3.2. Implementar Sistema de Prioridade
3.3. Criar Lógica de Fallback
3.4. Implementar Cache de Matrizes

### **Fase 4: Interface Matriz Fiscal - Frontend** ⏱️ 12h

4.1. Criar MatrizFiscalService (Frontend)
4.2. Criar Página de Listagem
4.3. Criar Formulário de Cadastro/Edição
4.4. Criar Comboboxes Auxiliares
4.5. Implementar Validações com Zod
4.6. Adicionar Menu de Navegação

### **Fase 5: Integração com NFe** ⏱️ 6h

5.1. Integrar buscarMatrizFiscal() no NfeService
5.2. Atualizar nfe-add-item-quick.tsx
5.3. Remover Campos Manuais de Impostos
5.4. Adicionar Indicador de Matriz Aplicada
5.5. Permitir Sobrescrever Matriz

**Total Estimado: 36 horas (4-5 dias)**

---

## ✨ Benefícios

### **Para o Usuário:**
- ✅ **Automação Total** - Não precisa saber impostos
- ✅ **Redução de Erros** - Impostos sempre corretos
- ✅ **Agilidade** - Emitir NFe em segundos
- ✅ **Flexibilidade** - Regras específicas quando necessário

### **Para o Sistema:**
- ✅ **Manutenção Centralizada** - Altera em um lugar
- ✅ **Escalável** - Adiciona novas regras facilmente
- ✅ **Auditável** - Sabe qual regra foi aplicada
- ✅ **Performance** - Cache de matrizes ativas

### **Para o Negócio:**
- ✅ **Conformidade Fiscal** - Sempre dentro da lei
- ✅ **Produtividade** - Menos tempo configurando
- ✅ **Diferencial Competitivo** - Recurso profissional
- ✅ **Redução de Custos** - Menos erros = menos multas

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes (Produto) | Depois (Matriz Fiscal) |
|---------|-----------------|------------------------|
| **Configuração** | Por produto (centenas) | Por regra (dezenas) |
| **Manutenção** | Alterar todos produtos | Alterar uma matriz |
| **Flexibilidade** | Limitada | Total |
| **Automação** | Parcial | Total |
| **Erros** | Alto risco | Baixo risco |
| **Tempo de NFe** | 5-10 minutos | 30 segundos |
| **Complexidade** | Alta | Baixa |

---

## 🎯 Próximos Passos

1. ✅ Análise concluída
2. ✅ Plano criado
3. ⏳ Iniciar Fase 1: Estrutura Base
4. ⏳ Desenvolver Fases 2-5
5. ⏳ Integrar com NFe
6. ⏳ Deploy e treinamento

---

**Documento criado em:** 23/10/2025
**Versão:** 1.0
**Status:** Pronto para implementação

