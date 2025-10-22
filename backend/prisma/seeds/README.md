# Seeds Fiscais

Módulo automatizado de seeds para tabelas fiscais.

## Estrutura

```
fiscal/
├── index.ts      # Exports públicos
├── types.ts      # Tipos TypeScript
├── data.ts       # Dados estáticos (CST, CSOSN)
├── loader.ts     # Carregamento de CFOP
└── seeder.ts     # Lógica de seed
```

## Uso

```bash
npx prisma db seed
```

## Dados Populados

- **CFOP**: ~500 códigos (fonte: GitHub Gist)
- **CST**: 91 códigos (ICMS, PIS, COFINS, IPI)
- **CSOSN**: 10 códigos (Simples Nacional)

## Atualização

CFOP é baixado automaticamente na primeira execução.
Para forçar atualização, delete `data/cfop.json` e execute novamente.

