# Estratégia de Seed de Dados Fiscais - Análise Comparativa

## 📋 Sumário Executivo

Este documento analisa as melhores práticas de mercado para popular dados fiscais (Estados, Municípios, NCM, CFOP, CST, CEST) em sistemas PDV/NFe e compara com a abordagem atual do projeto Movix.

---

## 🔍 Pesquisa de Mercado - Como os Desenvolvedores Fazem

### 1. **Estados e Municípios**

#### ✅ Abordagem Recomendada (Mercado)
- **API do IBGE** - Fonte oficial e sempre atualizada
- **URL**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
- **URL Municípios**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`

**Vantagens:**
- ✅ Dados oficiais e atualizados
- ✅ Sem necessidade de manutenção manual
- ✅ Gratuito e sem limite de requisições
- ✅ Formato JSON padronizado
- ✅ Inclui códigos IBGE oficiais

**Estratégia de Implementação:**
1. **Seed Inicial**: Buscar todos os estados na primeira execução
2. **Cache Local**: Armazenar em banco de dados
3. **Atualização**: Verificar periodicamente (mensal/trimestral)
4. **Municípios**: Carregar sob demanda ou por estado importante

**Exemplo de Implementação:**
```typescript
// Seed automático na inicialização
async function seedEstadosIBGE() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  const estados = await response.json();
  
  await prisma.estado.createMany({
    data: estados.map(e => ({
      codigo: e.id.toString(),
      uf: e.sigla,
      nome: e.nome,
      regiao: e.regiao.nome
    })),
    skipDuplicates: true
  });
}
```

---

### 2. **NCM (Nomenclatura Comum do Mercosul)**

#### ✅ Abordagem Recomendada (Mercado)

**Opção 1: API Siscomex (Oficial)**
- **URL**: `http://api.siscomex.gov.br/nomenclatura`
- **Fonte**: Receita Federal / Portal Único Siscomex
- **Formato**: JSON
- **Tamanho**: ~10.500 códigos NCM de 8 dígitos

**Opção 2: Arquivo JSON Estático (Mais Comum)**
- **Fonte**: Download da Receita Federal
- **URL**: https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/classificacao-fiscal-de-mercadorias/download-ncm-nomenclatura-comum-do-mercosul
- **Formato**: JSON, XLSX, CSV
- **Atualização**: Anual (geralmente em janeiro)

**Opção 3: Biblioteca Python siscomex-ncm**
- **GitHub**: https://github.com/leogregianin/siscomex-ncm
- **Vantagem**: Cache automático, validação, atualização periódica
- **Uso**: Ideal para scripts de atualização

**Estratégia Recomendada:**
1. **Arquivo JSON Estático** no repositório (`backend/prisma/data/ncm.json`)
2. **Seed Inicial** a partir do arquivo
3. **Script de Atualização** anual (manual ou automatizado)
4. **Cache em Banco** para performance

**Por que Arquivo Estático?**
- ✅ NCM muda raramente (1x por ano)
- ✅ Não depende de API externa
- ✅ Seed rápido e confiável
- ✅ Versionamento no Git
- ✅ Sem problemas de conectividade

---

### 3. **CFOP (Código Fiscal de Operações e Prestações)**

#### ✅ Abordagem Recomendada (Mercado)

**Opção 1: Arquivo JSON Estático (Mais Comum)**
- **Fonte**: Tabela oficial da Receita Federal
- **URL Oficial**: http://sped.rfb.gov.br/item/show/85
- **GitHub Gist**: https://gist.github.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67
- **Tamanho**: ~600 códigos
- **Atualização**: Muito rara (anos)

**Estratégia Recomendada:**
1. **Arquivo JSON** no repositório
2. **Fallback para API** se arquivo não existir
3. **Seed Único** na primeira execução
4. **Sem atualização automática** (tabela estável)

**Estrutura JSON:**
```json
{
  "list": [
    {"codigo": "1000", "descricao": "ENTRADAS OU AQUISIÇÕES DE SERVIÇOS DO ESTADO"},
    {"codigo": "1101", "descricao": "Compra para industrialização"}
  ]
}
```

---

### 4. **CST e CSOSN (Código de Situação Tributária)**

#### ✅ Abordagem Recomendada (Mercado)

**Características:**
- **CST ICMS**: 40 códigos (00-90)
- **CSOSN**: 10 códigos (Simples Nacional)
- **CST PIS/COFINS**: 99 códigos
- **CST IPI**: 99 códigos
- **Atualização**: Muito rara

**Estratégia Recomendada:**
1. **Hardcoded no Seeder** (tabela pequena e estável)
2. **Sem arquivo externo** necessário
3. **Seed Único** na primeira execução

**Exemplo:**
```typescript
const CST_ICMS = [
  { codigo: '00', descricao: 'Tributada integralmente' },
  { codigo: '10', descricao: 'Tributada e com cobrança do ICMS por substituição tributária' },
  // ...
];
```

---

### 5. **CEST (Código Especificador da Substituição Tributária)**

#### ✅ Abordagem Recomendada (Mercado)

**Características:**
- **Tamanho**: ~30.000 códigos
- **Fonte**: Convênio ICMS 92/2015
- **Atualização**: Semestral/Anual
- **Formato**: Tabela complexa com segmentos

**Estratégia Recomendada:**
1. **Arquivo JSON/CSV** no repositório
2. **Seed Inicial** completo
3. **Atualização Manual** quando houver mudanças
4. **Opcional**: Muitos sistemas não implementam CEST completo

---

## 📊 Comparação: Mercado vs. Movix Atual

### ✅ O que o Movix já faz CORRETAMENTE

| Recurso | Implementação Atual | Status |
|---------|-------------------|--------|
| **NCM** | Arquivo JSON estático + Seed | ✅ Excelente |
| **CFOP** | Arquivo JSON + Fallback API | ✅ Excelente |
| **CST/CSOSN** | Hardcoded no seeder | ✅ Correto |
| **Estrutura Modular** | Seeders separados por domínio | ✅ Excelente |
| **Performance** | Batch insert (1000 registros) | ✅ Ótimo |
| **Idempotência** | `skipDuplicates: true` | ✅ Correto |

### ⚠️ O que PRECISA ser MELHORADO

| Recurso | Problema Atual | Solução Recomendada |
|---------|---------------|-------------------|
| **Estados** | ❌ Não implementado | ✅ Seed via API IBGE |
| **Municípios** | ❌ Não implementado | ✅ Seed via API IBGE (principais) |
| **Seed Automático** | ❌ Manual (`npm run db:seed`) | ✅ Auto-seed na inicialização |
| **CEST** | ❌ Não implementado | ⚠️ Opcional (baixa prioridade) |

---

## 🎯 Estratégia Recomendada para o Movix

### Fase 1: Estados e Municípios (PRIORIDADE ALTA)

**Implementação:**
1. Criar `IbgeSeedService` em `backend/src/modules/external-apis/services/`
2. Integrar com `DatabaseInitService` para seed automático
3. Executar na primeira inicialização do sistema

**Fluxo:**
```
Inicialização do Backend
  ↓
DatabaseInitService.onModuleInit()
  ↓
Verificar se Estados existem
  ↓ (não)
IbgeSeedService.seedEstados()
  ↓
Buscar API IBGE → Salvar no banco
  ↓
IbgeSeedService.seedMunicipiosPrincipais()
  ↓
Buscar municípios de UFs importantes → Salvar
```

**Estados a Popular:**
- ✅ Todos os 27 estados (sempre)

**Municípios a Popular:**
- ✅ Capitais (27 municípios)
- ✅ Estados importantes: SP, RJ, MG, RS, PR, SC, BA, GO, DF, PE, CE, MA
- ⚠️ Demais municípios: Sob demanda (lazy loading)

### Fase 2: Otimização do Seed Atual (PRIORIDADE MÉDIA)

**Melhorias:**
1. ✅ Adicionar logs mais detalhados
2. ✅ Implementar retry logic para APIs
3. ✅ Adicionar validação de dados
4. ✅ Criar índices no banco para performance

### Fase 3: CEST (PRIORIDADE BAIXA)

**Decisão:**
- ⚠️ Implementar apenas se houver demanda
- ⚠️ Muitos sistemas PDV não usam CEST completo
- ✅ Pode ser adicionado posteriormente sem impacto

---

## 💡 Melhores Práticas Identificadas

### 1. **Dados Estáticos vs. APIs**

| Tipo de Dado | Frequência de Mudança | Recomendação |
|--------------|---------------------|--------------|
| Estados | Nunca | ✅ API IBGE (oficial) |
| Municípios | Raro (fusões) | ✅ API IBGE + Cache |
| NCM | Anual | ✅ Arquivo JSON estático |
| CFOP | Anos | ✅ Arquivo JSON estático |
| CST/CSOSN | Anos | ✅ Hardcoded |
| CEST | Semestral | ✅ Arquivo JSON (opcional) |

### 2. **Performance**

```typescript
// ✅ BOM: Batch insert
await prisma.ncm.createMany({
  data: batch,
  skipDuplicates: true
});

// ❌ RUIM: Insert individual
for (const ncm of ncms) {
  await prisma.ncm.create({ data: ncm });
}
```

### 3. **Idempotência**

```typescript
// ✅ Sempre verificar antes de popular
const count = await prisma.estado.count();
if (count > 0) {
  console.log('Estados já existem, pulando...');
  return;
}
```

### 4. **Tratamento de Erros**

```typescript
// ✅ Fallback para arquivo local
try {
  const data = await fetchFromAPI();
} catch (error) {
  console.warn('API falhou, usando arquivo local');
  const data = loadFromFile();
}
```

---

## 🚀 Plano de Implementação

### Etapa 1: Criar IbgeSeedService ✅ (FEITO)
- [x] Criar `backend/src/modules/external-apis/services/ibge-seed.service.ts`
- [x] Implementar `seedEstados()`
- [x] Implementar `seedMunicipiosPrincipais()`
- [x] Adicionar ao módulo `ExternalApisModule`

### Etapa 2: Integrar com DatabaseInitService
- [ ] Injetar `IbgeSeedService` no `DatabaseInitService`
- [ ] Adicionar chamada no `onModuleInit()`
- [ ] Testar seed automático na inicialização

### Etapa 3: Melhorar Logs e Feedback
- [ ] Adicionar progress bars
- [ ] Melhorar mensagens de erro
- [ ] Adicionar métricas de tempo

### Etapa 4: Documentação
- [ ] Atualizar README.md
- [ ] Documentar processo de seed
- [ ] Criar guia de troubleshooting

---

## 📚 Referências

1. **API IBGE**: https://servicodados.ibge.gov.br/api/docs/localidades
2. **NCM Siscomex**: https://github.com/leogregianin/siscomex-ncm
3. **Tabela CFOP**: http://sped.rfb.gov.br/item/show/85
4. **Download NCM**: https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/classificacao-fiscal-de-mercadorias/download-ncm-nomenclatura-comum-do-mercosul
5. **CFOP JSON**: https://gist.github.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67

---

## ✅ Conclusão

**O projeto Movix já implementa as melhores práticas para:**
- ✅ NCM (arquivo estático)
- ✅ CFOP (arquivo + fallback API)
- ✅ CST/CSOSN (hardcoded)
- ✅ Estrutura modular de seeders
- ✅ Performance com batch inserts

**Precisa implementar:**
- ⚠️ Estados e Municípios via API IBGE
- ⚠️ Seed automático na inicialização

**Abordagem recomendada:**
1. Manter arquivos JSON estáticos para dados que mudam raramente (NCM, CFOP, CST)
2. Usar API IBGE para dados geográficos (Estados, Municípios)
3. Seed automático na primeira inicialização
4. Cache em banco de dados para performance
5. Atualização manual/programada para dados que mudam anualmente

Esta estratégia equilibra **confiabilidade**, **performance** e **manutenibilidade**.

