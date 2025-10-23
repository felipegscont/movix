# 🌱 Prisma Database Seeding

Sistema modular de seeds para popular o banco de dados com dados iniciais.

## 📁 Estrutura

```
prisma/
├── seed.ts                          # 🎯 Ponto de entrada principal
├── seeders/                         # 📦 Seeders modulares
│   ├── cfop.seeder.ts              # ~600 CFOPs (API + Cache)
│   ├── cst.seeder.ts               # 40 CSTs (Hardcoded)
│   ├── csosn.seeder.ts             # 10 CSOSNs (Hardcoded)
│   ├── ncm.seeder.ts               # ~10.500 NCMs (JSON)
│   ├── natureza-operacao.seeder.ts # 2 Naturezas (Hardcoded)
│   ├── forma-pagamento.seeder.ts   # 17 Formas (Hardcoded)
│   └── emitente.seeder.ts          # 1 Placeholder (Hardcoded)
├── data/                            # 📊 Cache de dados externos
│   ├── cfop.json                   # Cache de CFOPs (API)
│   └── ncm.json                    # Tabela Siscomex completa
├── migrations/                      # 🔄 Migrações do banco
└── schema.prisma                    # 📋 Schema do banco
```

## 🚀 Comandos

```bash
# Executar seeds
npm run db:seed

# Resetar banco + seeds
npm run db:migrate:reset

# Setup completo (migrate + seed)
npm run db:setup

# Abrir Prisma Studio
npm run db:studio
```

## 📋 Ordem de Execução

1. **CFOP** (~600 códigos)
2. **CST** (40 códigos: ICMS, PIS, COFINS, IPI)
3. **CSOSN** (10 códigos)
4. **NCM** (~10.500 códigos)
5. **Naturezas de Operação** (2 padrões)
6. **Formas de Pagamento** (17 formas)
7. **Emitente Placeholder** (1 registro)

## 📊 Dados Populados

| Entidade | Qtd | Fonte |
|----------|-----|-------|
| CFOP | ~600 | API + Cache |
| CST | 40 | Hardcoded |
| CSOSN | 10 | Hardcoded |
| NCM | ~10.500 | Siscomex |
| Naturezas | 2 | Hardcoded |
| Formas Pag. | 17 | IT 2024.002 |
| Emitente | 1 | Placeholder |

## ⚙️ Características

### ✅ Idempotência
Verifica se dados existem antes de inserir.

### ⚡ Performance
- `createMany` para inserções em lote
- Batches para grandes volumes
- `--transpile-only` para execução rápida

### 🔄 Upsert
Atualiza dados existentes quando necessário.

## 📝 Notas

- **Estados/Municípios**: Carregados via API IBGE automaticamente
- **Emitente**: Configure em `Configurações > Emitente`
- **NCM**: Pode levar alguns minutos (~10.500 registros)

## 🔍 Referências

- [Prisma Seeding Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [Tabela CFOP](https://gist.githubusercontent.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67/raw)
- [Tabela NCM - Siscomex](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/nomenclatura-comum-do-mercosul-ncm)

