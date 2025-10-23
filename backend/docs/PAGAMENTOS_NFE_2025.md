# 💳 SISTEMA DE PAGAMENTOS NFe - ANÁLISE E IMPLEMENTAÇÃO 2025

## 📊 ANÁLISE DOS XMLs FORNECIDOS

### XML 1 - NFe 129 (Boleto Bancário)
```xml
<pag>
  <detPag>
    <indPag>1</indPag>  <!-- 0=À vista, 1=A prazo -->
    <tPag>15</tPag>      <!-- 15=Boleto Bancário -->
    <vPag>7200.00</vPag>
  </detPag>
</pag>
<cobr>
  <fat>
    <nFat>129</nFat>
    <vOrig>7200.00</vOrig>
    <vLiq>7200.00</vLiq>
  </fat>
  <dup>
    <nDup>001</nDup>
    <dVenc>2025-10-06</dVenc>
    <vDup>7200.00</vDup>
  </dup>
</cobr>
```

### XML 2 - NFe 343 (Boleto Bancário)
```xml
<pag>
  <detPag>
    <indPag>1</indPag>  <!-- A prazo -->
    <tPag>15</tPag>      <!-- Boleto Bancário -->
    <vPag>1500.00</vPag>
  </detPag>
</pag>
<cobr>
  <fat>
    <nFat>343</nFat>
    <vOrig>1500.00</vOrig>
    <vLiq>1500.00</vLiq>
  </fat>
  <dup>
    <nDup>001</nDup>
    <dVenc>2025-10-30</dVenc>
    <vDup>1500.00</vDup>
  </dup>
</cobr>
```

## 📋 TABELA COMPLETA DE MEIOS DE PAGAMENTO (IT 2024.002 v.1.10)

**Versão**: 1.10 (publicada em 29/09/2025)
**Vigência**:
- Ambiente de Teste: 20/10/2025
- Ambiente de Produção: 03/11/2025

| tPag | Descrição | Requer Card | Vigência | Observações |
|------|-----------|-------------|----------|-------------|
| 01 | Dinheiro | Não | 01/01/2020 | - |
| 02 | Cheque | Não | 01/01/2020 | - |
| 03 | Cartão de Crédito | Sim | 01/01/2020 | Requer CNPJ credenciadora, bandeira, autorização |
| 04 | Cartão de Débito | Sim | 01/01/2020 | Requer CNPJ credenciadora, bandeira, autorização |
| 05 | Cartão da Loja (Private Label), Crediário Digital, Outros Crediários | Não | 01/07/2024 | Cartão próprio da loja, crediário |
| 10 | Vale Alimentação | Não | 01/01/2020 | - |
| 11 | Vale Refeição | Não | 01/01/2020 | - |
| 12 | Vale Presente | Não | 01/01/2020 | - |
| 13 | Vale Combustível | Não | 01/01/2020 | - |
| 14 | Duplicata Mercantil | Não | 01/01/2020 | Título de crédito (Lei 5.474/68) |
| 15 | Boleto Bancário | Não | 01/01/2020 | - |
| 16 | Depósito Bancário | Não | 01/01/2020 | - |
| 17 | PIX Dinâmico | Sim | 01/07/2024 | QR Code dinâmico. Pode exigir código transação |
| 18 | Transferência bancária, Carteira Digital | Não | 01/01/2020 | - |
| 19 | Programa de fidelidade, Cashback, Crédito Virtual | Não | 01/01/2020 | - |
| 20 | PIX Estático | Não | 01/07/2024 | QR Code estático ou transferência |
| 21 | Crédito em Loja | Não | 01/07/2024 | Crédito por devolução, valor pago anteriormente |
| 22 | Pagamento Eletrônico não Informado | Não | 01/07/2024 | Falha de hardware (uso excepcional) |
| 90 | Sem Pagamento | Não | 01/01/2020 | - |
| **91** | **Pagamento Posterior** | **Não** | **03/11/2025** | **🆕 NOVO! Pagamento total ou parcial adiado** |
| 99 | Outros | Não | 01/01/2020 | Requer descrição no campo `xPag` |

### 🆕 NOVIDADE: Código 91 - Pagamento Posterior

**O que é**: Representa situações em que o valor da operação não é integralmente quitado no momento da emissão da nota fiscal.

**Casos de uso**:
- Pagamento totalmente adiado para data futura
- Pagamento parcial no ato + restante posterior
- Vendas a prazo sem duplicata/boleto
- Crediário próprio sem cartão

**Benefícios**:
- Reflete fielmente a realidade comercial
- Evita uso incorreto de outros códigos
- Facilita cruzamento de informações pelo fisco
- Reduz rejeições por inconsistências

## 🏗️ ESTRUTURA XML NFe - GRUPO DE PAGAMENTO

### Estrutura Completa
```xml
<pag>
  <!-- Pode ter múltiplos detPag -->
  <detPag>
    <indPag>0</indPag>           <!-- 0=À vista, 1=A prazo -->
    <tPag>03</tPag>              <!-- Meio de pagamento (tabela acima) -->
    <xPag>Descrição</xPag>       <!-- Opcional. Obrigatório se tPag=99 -->
    <vPag>100.00</vPag>          <!-- Valor do pagamento -->
    <dPag>2025-01-23</dPag>      <!-- Data do pagamento (opcional) -->
    
    <!-- Grupo CARD - Obrigatório para tPag=03,04,17 -->
    <card>
      <tpIntegra>1</tpIntegra>   <!-- 1=Integrado, 2=Não integrado -->
      <CNPJ>12345678000190</CNPJ> <!-- CNPJ da credenciadora -->
      <tBand>01</tBand>           <!-- Bandeira do cartão -->
      <cAut>123456</cAut>         <!-- Código de autorização -->
    </card>
  </detPag>
  
  <vTroco>10.00</vTroco>         <!-- Valor do troco (opcional) -->
</pag>

<!-- Grupo de Cobrança (opcional - usado com duplicatas) -->
<cobr>
  <fat>
    <nFat>001</nFat>             <!-- Número da fatura -->
    <vOrig>1000.00</vOrig>       <!-- Valor original -->
    <vDesc>50.00</vDesc>         <!-- Valor desconto (opcional) -->
    <vLiq>950.00</vLiq>          <!-- Valor líquido -->
  </fat>
  
  <!-- Pode ter múltiplas duplicatas -->
  <dup>
    <nDup>001</nDup>             <!-- Número da duplicata -->
    <dVenc>2025-02-23</dVenc>    <!-- Data vencimento -->
    <vDup>475.00</vDup>          <!-- Valor da duplicata -->
  </dup>
  <dup>
    <nDup>002</nDup>
    <dVenc>2025-03-23</dVenc>
    <vDup>475.00</vDup>
  </dup>
</cobr>
```

### Bandeiras de Cartão (tBand)
```
01 = Visa
02 = Mastercard
03 = American Express
04 = Sorocred
05 = Diners Club
06 = Elo
07 = Hipercard
08 = Aura
09 = Cabal
10 = Alelo
11 = Banes Card
12 = CalCard
13 = Credz
14 = Discover
15 = GoodCard
16 = GreenCard
17 = Hiper
18 = JCB
19 = Mais
20 = MaxVan
21 = Policard
22 = RedeCompras
23 = Sodexo
24 = ValeCard
25 = Verocheque
26 = VR
27 = Ticket
99 = Outros
```

## 🗄️ MODELO DE DADOS PROPOSTO

### Tabela: forma_pagamento (Cadastro)
```prisma
model FormaPagamento {
  id          String   @id @default(cuid())
  codigo      String   @unique @db.VarChar(2)  // 01, 02, 03, etc
  descricao   String   @db.VarChar(200)
  requerCard  Boolean  @default(false)         // Se requer dados de cartão
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  pagamentos  NfePagamento[]

  @@map("formas_pagamento")
}
```

### Tabela: nfe_pagamentos (Atualizada)
```prisma
model NfePagamento {
  id                    String   @id @default(cuid())
  nfeId                 String
  
  // Indicador de Pagamento
  indicadorPagamento    Int      @default(0)  // 0=À vista, 1=A prazo
  
  // Forma de Pagamento
  formaPagamentoId      String
  descricaoPagamento    String?  @db.VarChar(200)  // Obrigatório se tPag=99
  valor                 Decimal  @db.Decimal(15,2)
  dataPagamento         DateTime?
  
  // Dados de Cartão (se aplicável)
  tipoIntegracao        Int?     // 1=Integrado, 2=Não integrado
  cnpjCredenciadora     String?  @db.VarChar(14)
  bandeira              String?  @db.VarChar(2)
  numeroAutorizacao     String?  @db.VarChar(20)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relacionamentos
  nfe                   Nfe @relation(fields: [nfeId], references: [id], onDelete: Cascade)
  formaPagamento        FormaPagamento @relation(fields: [formaPagamentoId], references: [id])

  @@map("nfe_pagamentos")
}
```

### Tabela: nfe_cobranca (Nova)
```prisma
model NfeCobranca {
  id                    String   @id @default(cuid())
  nfeId                 String   @unique
  
  // Fatura
  numeroFatura          String?  @db.VarChar(20)
  valorOriginal         Decimal  @db.Decimal(15,2)
  valorDesconto         Decimal  @default(0) @db.Decimal(15,2)
  valorLiquido          Decimal  @db.Decimal(15,2)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relacionamentos
  nfe                   Nfe @relation(fields: [nfeId], references: [id], onDelete: Cascade)

  @@map("nfe_cobrancas")
}
```

### Tabela: nfe_duplicatas (Já existe - OK)
```prisma
model NfeDuplicata {
  id                    String   @id @default(cuid())
  nfeId                 String
  
  numero                String   @db.VarChar(20)
  dataVencimento        DateTime
  valor                 Decimal  @db.Decimal(15,2)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relacionamentos
  nfe                   Nfe @relation(fields: [nfeId], references: [id], onDelete: Cascade)

  @@map("nfe_duplicatas")
}
```

## 🎯 REGRAS DE NEGÓCIO

### 1. Validações de Pagamento
- Soma dos pagamentos (`vPag`) deve ser igual ao valor total da NFe
- Se `tPag` = 99 (Outros), campo `xPag` é obrigatório
- Se `tPag` = 03, 04 ou 17, grupo `<card>` é obrigatório
- Valor do troco só pode existir se houver pagamento em dinheiro (tPag=01)

### 2. Cobrança e Duplicatas
- Grupo `<cobr>` é opcional
- Se informado, soma das duplicatas deve ser igual ao valor líquido da fatura
- Duplicatas são usadas principalmente com:
  - tPag = 14 (Duplicata Mercantil)
  - tPag = 15 (Boleto Bancário)
  - tPag = 99 (Outros) quando for crediário

### 3. PIX (tPag = 17 ou 20)
- **PIX Dinâmico (17)**: Algumas UFs exigem código de transação no campo `cAut`
- **PIX Estático (20)**: Não requer código de transação

### 4. Múltiplos Pagamentos
- NFe pode ter múltiplas formas de pagamento
- Exemplo: R$ 500 em dinheiro + R$ 500 no cartão = R$ 1.000 total

## 📝 EXEMPLOS DE USO

### Exemplo 1: Pagamento à Vista em Dinheiro
```json
{
  "pagamentos": [
    {
      "indicadorPagamento": 0,
      "formaPagamento": "01",
      "valor": 100.00
    }
  ],
  "valorTroco": 10.00
}
```

### Exemplo 2: Cartão de Crédito
```json
{
  "pagamentos": [
    {
      "indicadorPagamento": 0,
      "formaPagamento": "03",
      "valor": 500.00,
      "tipoIntegracao": 1,
      "cnpjCredenciadora": "12345678000190",
      "bandeira": "01",
      "numeroAutorizacao": "ABC123"
    }
  ]
}
```

### Exemplo 3: Boleto Bancário com Duplicatas
```json
{
  "pagamentos": [
    {
      "indicadorPagamento": 1,
      "formaPagamento": "15",
      "valor": 1000.00
    }
  ],
  "cobranca": {
    "numeroFatura": "001",
    "valorOriginal": 1000.00,
    "valorLiquido": 1000.00
  },
  "duplicatas": [
    {
      "numero": "001",
      "dataVencimento": "2025-02-23",
      "valor": 500.00
    },
    {
      "numero": "002",
      "dataVencimento": "2025-03-23",
      "valor": 500.00
    }
  ]
}
```

### Exemplo 4: Múltiplas Formas de Pagamento
```json
{
  "pagamentos": [
    {
      "indicadorPagamento": 0,
      "formaPagamento": "01",
      "valor": 300.00
    },
    {
      "indicadorPagamento": 0,
      "formaPagamento": "03",
      "valor": 700.00,
      "tipoIntegracao": 1,
      "cnpjCredenciadora": "12345678000190",
      "bandeira": "01",
      "numeroAutorizacao": "XYZ789"
    }
  ]
}
```

## 🚀 PRÓXIMOS PASSOS

1. ✅ Criar tabela `formas_pagamento` e popular com seed
2. ✅ Atualizar model `NfePagamento`
3. ✅ Criar model `NfeCobranca`
4. ✅ Criar DTOs para pagamento
5. ✅ Implementar validações
6. ✅ Criar interface no frontend
7. ✅ Testar geração de XML

