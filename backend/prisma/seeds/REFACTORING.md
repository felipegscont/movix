# Refatoração do Módulo de Seeds Fiscais

## Objetivo

Simplificar e modularizar o sistema de seeds fiscais seguindo Clean Architecture e princípios Go idiomáticos adaptados ao TypeScript.

## Mudanças Realizadas

### Arquivos Removidos

- `MANUTENCAO.md` - Documentação excessiva
- `README.md` (antigo) - Substituído por versão simplificada
- `download-fiscal-data.ts` - Lógica integrada ao loader
- `update-fiscal-tables.ts` - Funcionalidade unificada no seeder
- `seed-fiscal-tables.ts` - Substituído por módulo fiscal
- `data/csosn.json` - Dados movidos para código
- `data/cst-icms.json` - Dados movidos para código

### Nova Estrutura

```
seeds/
├── fiscal/
│   ├── index.ts      # Exports públicos
│   ├── types.ts      # Definições de tipos
│   ├── data.ts       # Dados estáticos (CST, CSOSN)
│   ├── loader.ts     # Download/cache de CFOP
│   └── seeder.ts     # Lógica de persistência
├── data/
│   └── cfop.json     # Cache de CFOP (gerado automaticamente)
└── README.md         # Documentação simplificada
```

### Princípios Aplicados

1. **Separação de Responsabilidades**
   - `types.ts`: Contratos de dados
   - `data.ts`: Fonte de verdade para dados estáticos
   - `loader.ts`: Aquisição de dados externos
   - `seeder.ts`: Persistência no banco

2. **Single Source of Truth**
   - CST e CSOSN definidos em código (raramente mudam)
   - CFOP baixado de fonte oficial e cacheado

3. **Simplicidade**
   - Sem logs excessivos
   - Sem documentação redundante
   - Código auto-explicativo

4. **Modularidade**
   - Módulo fiscal independente
   - Fácil de testar e manter
   - Exports claros via index.ts

## Uso

```bash
# Executar seed completo
npx prisma db seed

# Setup completo do banco
npm run db:setup
```

## Fluxo de Execução

1. `seed.ts` importa `seedFiscalTables` do módulo fiscal
2. `seedFiscalTables` executa:
   - `loadCFOPs()`: Baixa/carrega CFOP (cache automático)
   - `seedCFOPs()`: Persiste CFOPs no banco
   - `seedCSTs()`: Persiste CSTs (de `data.ts`)
   - `seedCSOSNs()`: Persiste CSOSNs (de `data.ts`)

## Dados Populados

- **CFOP**: ~500 códigos (GitHub Gist)
- **CST ICMS**: 11 códigos
- **CST PIS**: 33 códigos
- **CST COFINS**: 33 códigos
- **CST IPI**: 14 códigos
- **CSOSN**: 10 códigos

**Total**: ~600 registros fiscais

## Atualização

CFOP é baixado automaticamente na primeira execução e cacheado em `data/cfop.json`.

Para forçar atualização:
```bash
rm backend/prisma/seeds/data/cfop.json
npx prisma db seed
```

## Compatibilidade

- ✅ Compatível com `schema.prisma`
- ✅ Funciona com `npx prisma db seed`
- ✅ Integrado ao fluxo de setup do banco
- ✅ TypeScript compilável
- ✅ Sem dependências extras

