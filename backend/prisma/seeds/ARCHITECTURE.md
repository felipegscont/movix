# Arquitetura de Dados - Sistema Movix NFe

## Estratégia de População de Dados

### 1. Seed (Dados Estáticos)

**Quando usar**: Dados fiscais oficiais que raramente mudam

**Implementação**: `prisma/seeds/fiscal/`

**Dados**:
- CFOP (~500 códigos)
- CST ICMS (11 códigos)
- CST PIS (33 códigos)
- CST COFINS (33 códigos)
- CST IPI (14 códigos)
- CSOSN (10 códigos)
- Naturezas de Operação (2 padrões)

**Execução**: `npx prisma db seed`

**Vantagens**:
- Dados sempre disponíveis
- Sem dependência de APIs externas
- Performance máxima

---

### 2. API com Cache (Lazy Loading)

**Quando usar**: Dados dinâmicos de fontes oficiais

**Implementação**: `src/modules/external-apis/services/ibge-cache.service.ts`

**Dados**:
- Estados (27 UFs)
- Municípios (~5570)

**Fluxo**:
```
1. Usuário solicita dados
2. Sistema verifica cache local (banco)
3. Se não existe, busca na API IBGE
4. Salva no cache local
5. Retorna dados
```

**Vantagens**:
- Dados sempre atualizados
- Sem manutenção manual
- Cache persistente
- Fallback automático

**APIs Utilizadas**:
- IBGE Oficial: `https://servicodados.ibge.gov.br/api/v1/localidades/`
- BrasilAPI: `https://brasilapi.com.br/api/ibge/`

---

### 3. Cadastro Manual

**Quando usar**: Dados específicos do negócio

**Implementação**: Interface do sistema

**Dados**:
- NCM (varia por empresa/produto)
- Produtos
- Clientes
- Fornecedores
- Emitente

**Vantagens**:
- Flexibilidade total
- Dados customizados
- Controle do usuário

---

## Comparação de Estratégias

| Aspecto | Seed | API + Cache | Manual |
|---------|------|-------------|--------|
| **Atualização** | Rara | Automática | Contínua |
| **Manutenção** | Baixa | Zero | Alta |
| **Performance** | Máxima | Alta | N/A |
| **Flexibilidade** | Baixa | Média | Máxima |
| **Dependência** | Nenhuma | API externa | Usuário |

---

## Decisões de Design

### Por que Estados/Municípios via API?

**Antes**: Seed hardcoded com 27 estados e 6 municípios

**Problema**:
- Dados incompletos (apenas 6 de 5570 municípios)
- Manutenção manual
- Duplicação de lógica (seed + API)

**Solução**: API IBGE com cache automático

**Benefícios**:
- Dados completos (todos os 5570 municípios)
- Zero manutenção
- Sempre atualizado
- Cache persistente

### Por que CFOP via Seed?

**Motivo**: Dados fiscais oficiais que raramente mudam

**Fonte**: GitHub Gist mantido pela comunidade
- URL: `https://gist.github.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67`
- Baseado em tabela oficial SEFAZ
- Última atualização: 2016

**Vantagens**:
- Disponível offline
- Performance máxima
- Sem rate limit
- Cache automático

### Por que NCM Manual?

**Motivo**: Varia por empresa/produto

**Exemplos**:
- Loja de roupas: NCMs de vestuário
- Farmácia: NCMs de medicamentos
- Supermercado: NCMs de alimentos

**Solução**: Cadastro via interface conforme necessidade

---

## Fluxo de Inicialização

```
1. npx prisma migrate deploy
   ↓
2. npx prisma db seed
   ↓
   ├─→ Baixa CFOP (GitHub Gist)
   ├─→ Popula CST/CSOSN (hardcoded)
   └─→ Cria Naturezas padrão
   ↓
3. Sistema pronto
   ↓
4. Primeiro acesso a Estados
   ↓
   ├─→ Verifica banco (vazio)
   ├─→ Busca API IBGE
   ├─→ Salva no banco
   └─→ Retorna dados
   ↓
5. Próximos acessos
   ↓
   └─→ Retorna do cache (banco)
```

---

## Manutenção

### CFOP

**Frequência**: Raramente (última em 2016)

**Atualização**:
```bash
rm backend/prisma/seeds/data/cfop.json
npx prisma db seed
```

### CST/CSOSN

**Frequência**: Muito rara (última em 2016)

**Atualização**:
1. Editar `backend/prisma/seeds/fiscal/data.ts`
2. Executar `npx prisma db seed`

### Estados/Municípios

**Frequência**: Automática

**Manutenção**: Zero (API IBGE sempre atualizada)

### NCM

**Frequência**: Conforme necessidade

**Cadastro**: Via interface do sistema

---

## Performance

### Seed
- Execução: ~10 segundos
- Registros: ~600
- Dependências: 1 API externa (CFOP)

### API + Cache
- Primeira consulta: ~2 segundos (API)
- Consultas seguintes: ~50ms (cache)
- Registros: ~5600 (sob demanda)

### Total
- Tempo inicial: ~10 segundos
- Dados disponíveis: ~600 registros
- Dados sob demanda: ~5600 registros
- Total possível: ~6200 registros

---

## Conclusão

Sistema otimizado com:
- ✅ Seed mínimo e essencial
- ✅ API com cache inteligente
- ✅ Zero redundância
- ✅ Manutenção mínima
- ✅ Performance máxima
- ✅ Dados sempre atualizados

