# 🌱 Prisma Database Seeding

Sistema modular de seeds para popular o banco de dados com dados iniciais.

## 📁 Estrutura

```
prisma/
├── seed.ts                          # 🎯 Ponto de entrada principal
├── seeders/                         # 📦 Seeders modulares
│   ├── ibge.seeder.ts              # 27 Estados + 5.570 Municípios (JSON)
│   ├── cfop.seeder.ts              # ~600 CFOPs (JSON)
│   ├── cst.seeder.ts               # 47 CSTs (Hardcoded)
│   ├── csosn.seeder.ts             # 10 CSOSNs (Hardcoded)
│   ├── ncm.seeder.ts               # ~10.500 NCMs (JSON)
│   ├── natureza-operacao.seeder.ts # 2 Naturezas (Hardcoded)
│   ├── forma-pagamento.seeder.ts   # 17 Formas (Hardcoded)
│   └── emitente.seeder.ts          # 1 Placeholder (Hardcoded)
├── data/                            # 📊 Dados estáticos (JSON)
│   ├── estados.json                # 27 Estados brasileiros (IBGE)
│   ├── municipios.json             # 5.570 Municípios (IBGE)
│   ├── cfop.json                   # ~600 CFOPs (Receita Federal)
│   └── ncm.json                    # ~10.500 NCMs (Siscomex)
├── migrations/                      # 🔄 Migrações do banco
│   └── 20241024000000_init/        # Migration inicial (gerada pelo Prisma)
└── schema.prisma                    # 📋 Schema do banco
```

## 🚀 Comandos

```bash
# Executar seeds
npm run db:seed

# Resetar banco + migrations + seeds (RECOMENDADO)
npx prisma migrate reset --force

# Sincronizar schema (desenvolvimento)
npx prisma db push --accept-data-loss

# Abrir Prisma Studio
npm run db:studio
```

## 📋 Ordem de Execução

1. **Estados** (27 estados brasileiros)
2. **Municípios** (5.570 municípios)
3. **CFOP** (~600 códigos)
4. **CST** (47 códigos: ICMS, PIS, COFINS, IPI)
5. **CSOSN** (10 códigos)
6. **NCM** (~10.500 códigos - opcional)
7. **Naturezas de Operação** (2 padrões)
8. **Formas de Pagamento** (17 formas)
9. **Emitente Placeholder** (1 registro)

## 📊 Dados Populados

| Entidade | Qtd | Fonte |
|----------|-----|-------|
| Estados | 27 | JSON (IBGE) |
| Municípios | 5.570 | JSON (IBGE) |
| CFOP | ~600 | JSON (Receita Federal) |
| CST | 47 | Hardcoded |
| CSOSN | 10 | Hardcoded |
| NCM | ~10.500 | JSON (Siscomex) |
| Naturezas | 2 | Hardcoded |
| Formas Pag. | 17 | Hardcoded |
| Emitente | 1 | Placeholder |

## ⚙️ Características

### ✅ Idempotência
- Verifica se dados existem antes de inserir
- Usa `skipDuplicates: true` e `upsert`
- Pode executar múltiplas vezes sem erros

### ⚡ Performance
- `createMany` para inserções em lote
- Estados e municípios em JSON estático (super rápido)
- `--transpile-only` para execução rápida
- 5.570 municípios carregados em segundos

### 🔄 Dados Estáticos
- Estados e municípios não dependem de API externa
- Dados oficiais do IBGE versionados no repositório
- Sem problemas de conectividade ou rate limit

## 📝 Notas

- **Estados/Municípios**: Carregados de arquivos JSON estáticos (IBGE)
- **Emitente**: Configure em `Configurações > Emitente`
- **NCM**: Opcional - pode levar alguns minutos (~10.500 registros)
- **Migration**: Única migration gerada automaticamente pelo Prisma

## 🔍 Referências

- [Prisma Seeding Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [API IBGE](https://servicodados.ibge.gov.br/api/docs/localidades)
- [Municípios Brasileiros (GitHub)](https://github.com/kelvins/municipios-brasileiros)
- [Tabela CFOP](http://sped.rfb.gov.br/item/show/85)
- [Tabela NCM - Siscomex](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/nomenclatura-comum-do-mercosul-ncm)

