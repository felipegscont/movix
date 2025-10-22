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

### Via Seed
- **CFOP**: ~500 códigos (GitHub Gist - download automático)
- **CST**: 91 códigos (hardcoded - ICMS, PIS, COFINS, IPI)
- **CSOSN**: 10 códigos (hardcoded - Simples Nacional)
- **Naturezas de Operação**: 2 padrões (VENDA, VENDA_PROD)

### Via API (Lazy Loading)
- **Estados**: 27 UFs (API IBGE - populado sob demanda)
- **Municípios**: ~5570 (API IBGE - populado sob demanda por estado)

### Cadastro Manual
- **NCM**: Cadastrar conforme necessidade do negócio

## Atualização

**CFOP**: Baixado automaticamente na primeira execução.
Para forçar atualização: `rm data/cfop.json && npx prisma db seed`

**Estados/Municípios**: Populados automaticamente via API IBGE quando solicitados.

**NCM**: Cadastrar manualmente via interface do sistema.

