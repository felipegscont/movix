# 🌱 Seeds Fiscais - Movix NFe

Sistema automatizado de população de dados fiscais para NFe.

## 📁 Estrutura

```
seeds/
├── fiscal/
│   ├── index.ts         # Exports públicos
│   ├── types.ts         # Tipos TypeScript
│   ├── data.ts          # CST e CSOSN (hardcoded)
│   ├── loader.ts        # Carregador de CFOP (GitHub Gist)
│   ├── ncm-loader.ts    # Carregador de NCM (API Siscomex)
│   ├── ncm-data.ts      # NCMs comuns (fallback)
│   └── seeder.ts        # Lógica principal de seed
├── data/
│   ├── cfop.json        # Cache de CFOPs
│   └── ncm.json         # Cache de NCMs (gerado automaticamente)
└── README.md            # Este arquivo
```

## 🚀 Execução

### Automática (Recomendado)
O seed é executado **automaticamente** na primeira inicialização do sistema via `DatabaseInitService`.

### Manual
```bash
cd backend
npm run prisma:seed
```

## 📊 Dados Populados

### ✅ Via Seed Automático

| Tabela | Quantidade | Fonte | Atualização |
|--------|-----------|-------|-------------|
| **CFOP** | ~500 | GitHub Gist | Cache local |
| **CST ICMS** | 11 | Hardcoded | Manual |
| **CST PIS** | 33 | Hardcoded | Manual |
| **CST COFINS** | 33 | Hardcoded | Manual |
| **CST IPI** | 14 | Hardcoded | Manual |
| **CSOSN** | 10 | Hardcoded | Manual |
| **NCM** | ~10.500 | Siscomex (8 dígitos) | Cache local |
| **Naturezas** | 2 | Hardcoded | Manual |

**Total**: ~11.100 registros

### 🔄 Via API (Lazy Loading)

| Tabela | Quantidade | Fonte | Quando |
|--------|-----------|-------|--------|
| **Estados** | 27 | API IBGE | Sob demanda |
| **Municípios** | ~5.570 | API IBGE | Sob demanda |

## 🔧 Fontes de Dados

### CFOP
- **Fonte**: GitHub Gist (reinaldoacdc)
- **URL**: `https://gist.githubusercontent.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67/raw`
- **Cache**: `seeds/data/cfop.json`
- **Atualização**: Baixa automaticamente se cache não existir

### NCM
- **Fonte**: Portal Único Siscomex (Receita Federal)
- **URL**: `https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json?perfil=PUBLICO`
- **Cache**: `seeds/data/ncm.json` (3.2 MB - 15.141 NCMs totais)
- **Filtro**: Apenas NCMs com 8 dígitos (formato completo para NFe)
- **Resultado**: ~10.500 NCMs vigentes de 8 dígitos
- **Estrutura NCM**: 6 dígitos SH + 2 dígitos Mercosul = 8 dígitos total
- **Hierarquia**:
  - `capitulo`: 2 primeiros dígitos (ex: 85) - ~96 capítulos
  - `posicao`: 4 primeiros dígitos (ex: 8501) - ~1.228 posições
  - `subposicao`: 6 primeiros dígitos (ex: 850110) - ~5.612 subposições (SH)
  - `codigo`: 8 dígitos completos (ex: 85011010) - ~10.504 itens
  - `nivel`: Sempre 4 (item completo)
- **Normalização**:
  - Remove tags HTML/XML (`<i>`, `</i>`, etc)
  - Remove múltiplos espaços
  - Trim de espaços no início/fim
  - Mantém hierarquia (`-`, `--`) nas descrições
- **Atualização**: Carrega do cache local (já incluído no projeto)
- **Obrigatório**: Arquivo `ncm.json` deve existir (não há fallback)

### CST/CSOSN
- **Fonte**: Hardcoded em `data.ts`
- **Motivo**: Dados oficiais que raramente mudam
- **Atualização**: Manual (quando legislação mudar)

### Estados/Municípios
- **Fonte**: API IBGE
- **Estratégia**: Lazy Loading com cache no banco
- **Atualização**: Automática quando solicitado

## 🔄 Atualização de Dados

### Forçar atualização de CFOP
```bash
rm backend/prisma/seeds/data/cfop.json
npm run prisma:seed
```

### Forçar atualização de NCM
```bash
rm backend/prisma/seeds/data/ncm.json
npm run prisma:seed
```

### Resetar tudo
```bash
npm run prisma:migrate:reset  # ⚠️ APAGA TODOS OS DADOS
```

## 📝 Logs

### Seed bem-sucedido
```
🌱 Seed iniciado
🔢 Tabelas Fiscais (CFOP, CST, CSOSN, NCM)
   📥 Carregando NCMs...
   📥 Baixando NCMs da API Siscomex...
   ✓ 10247 NCMs baixados da API
   ✓ Cache salvo em backend/prisma/seeds/data/ncm.json
   💾 Salvando 10247 NCMs no banco...
   ⏳ 1000/10247 NCMs salvos...
   ⏳ 2000/10247 NCMs salvos...
   ...
   ✅ 10247 NCMs salvos com sucesso
📋 Naturezas de Operação
✅ Seed concluído

📊 Dados populados:
   • CFOP: ~500 códigos
   • CST: ~90 códigos (ICMS, PIS, COFINS, IPI)
   • CSOSN: 10 códigos
   • NCM: Tabela completa da Receita Federal (~10.000 códigos)
   • Naturezas de Operação: 2 padrões

ℹ️  Estados e Municípios são populados automaticamente via API IBGE
ℹ️  NCMs são atualizados automaticamente da API Siscomex
```

## 🏗️ Arquitetura

### Estratégia de População

1. **Seed (Dados Estáticos)**
   - CFOP, CST, CSOSN, NCM
   - Executado uma vez na inicialização
   - Cache local para performance

2. **API com Cache (Lazy Loading)**
   - Estados, Municípios
   - Populado sob demanda
   - Cache persistente no banco

3. **Cadastro Manual**
   - Emitente, Clientes, Fornecedores, Produtos
   - Via interface do sistema

### Fluxo de Execução

```
1. Sistema inicia
   ↓
2. DatabaseInitService verifica banco
   ↓
3. Se vazio:
   ├─→ Executa migrations
   ├─→ Executa seed
   │   ├─→ Carrega CFOP (cache ou download)
   │   ├─→ Carrega CST/CSOSN (hardcoded)
   │   ├─→ Carrega NCM (cache ou API)
   │   └─→ Cria Naturezas padrão
   └─→ Banco populado
   ↓
4. Sistema pronto
```

## 🐛 Troubleshooting

### Erro: "Falha ao carregar CFOPs"
```bash
# Verificar conexão com internet
# Tentar novamente
npm run prisma:seed
```

### Erro: "Falha ao baixar NCMs da API"
O sistema usa automaticamente a lista de fallback (45 NCMs comuns).
Para tentar novamente:
```bash
rm backend/prisma/seeds/data/ncm.json
npm run prisma:seed
```

### Tabelas vazias após seed
```bash
# Verificar logs do seed
npm run prisma:seed

# Verificar dados no Prisma Studio
npm run prisma:studio
```

### Banco corrompido
```bash
# Resetar completamente
npm run prisma:migrate:reset
# Confirmar com 'y'
```

## 📚 Referências

- [Tabela CFOP](https://gist.github.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67)
- [API NCM Siscomex](https://portalunico.siscomex.gov.br/classif/)
- [API IBGE](https://servicodados.ibge.gov.br/api/docs/)
- [Documentação Prisma](https://www.prisma.io/docs/guides/database/seed-database)

## 🔐 Segurança

- Todas as APIs são públicas e oficiais
- Não há credenciais ou tokens necessários
- Cache local apenas para performance
- Dados fiscais são públicos e oficiais

## ⚡ Performance

- **CFOP**: ~500 registros em ~2s
- **CST/CSOSN**: ~100 registros em ~1s
- **NCM**: ~10.000 registros em ~30-60s (primeira vez)
- **NCM**: ~10.000 registros em ~5s (com cache)
- **Total**: ~1 minuto (primeira execução)
- **Total**: ~10 segundos (com cache)

## 📄 Licença

Dados fiscais são de domínio público fornecidos por:
- Receita Federal do Brasil
- IBGE (Instituto Brasileiro de Geografia e Estatística)

