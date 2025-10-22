# 📚 Guia de Uso do Prisma - Movix NFe

## 🎯 Filosofia: Deixe o Prisma Gerenciar o Banco

**IMPORTANTE:** Nunca crie migrações SQL manualmente. Sempre use os comandos do Prisma para sincronizar o schema com o banco de dados.

## 🔧 Comandos Principais

### 1. **Sincronizar Schema com Banco (Desenvolvimento)**

Quando você modificar o `schema.prisma`, use:

```bash
npm run db:sync
```

Ou diretamente:

```bash
npx prisma db push
```

**O que faz:**
- ✅ Sincroniza o schema do Prisma com o banco de dados
- ✅ Adiciona/remove colunas automaticamente
- ✅ Atualiza tipos de dados
- ✅ Regenera o Prisma Client
- ⚠️ **Não cria arquivos de migração**

**Quando usar:**
- Durante desenvolvimento rápido
- Quando você quer testar mudanças no schema
- Quando não precisa de histórico de migrações

### 2. **Criar Migrações (Produção)**

Para criar migrações que podem ser versionadas:

```bash
npm run prisma:migrate
```

Ou:

```bash
npx prisma migrate dev --name nome_da_migracao
```

**O que faz:**
- ✅ Cria arquivo de migração SQL
- ✅ Aplica a migração no banco
- ✅ Atualiza o histórico de migrações
- ✅ Regenera o Prisma Client

**Quando usar:**
- Quando estiver pronto para commitar mudanças
- Para manter histórico de alterações
- Antes de fazer deploy em produção

### 3. **Aplicar Migrações Existentes**

Em produção ou após clonar o projeto:

```bash
npm run prisma:migrate:deploy
```

Ou:

```bash
npx prisma migrate deploy
```

**O que faz:**
- ✅ Aplica todas as migrações pendentes
- ✅ Não cria novas migrações
- ✅ Seguro para produção

### 4. **Resetar Banco de Dados**

Para resetar completamente o banco (⚠️ **CUIDADO: Apaga todos os dados!**):

```bash
npm run prisma:migrate:reset
```

Ou:

```bash
npx prisma migrate reset --force
```

**O que faz:**
- ⚠️ Apaga todo o banco de dados
- ✅ Recria todas as tabelas
- ✅ Executa o seed automaticamente
- ✅ Útil para desenvolvimento

### 5. **Gerar Prisma Client**

Após modificar o schema:

```bash
npm run prisma:generate
```

Ou:

```bash
npx prisma generate
```

**O que faz:**
- ✅ Regenera o cliente TypeScript do Prisma
- ✅ Atualiza os tipos no código

### 6. **Popular Banco com Dados Iniciais**

```bash
npm run prisma:seed
```

Ou:

```bash
npx ts-node prisma/seed.ts
```

**O que faz:**
- ✅ Executa o arquivo `prisma/seed.ts`
- ✅ Popula estados, municípios, NCMs, CFOPs, etc.

### 7. **Abrir Prisma Studio**

Interface visual para visualizar e editar dados:

```bash
npm run prisma:studio
```

Ou:

```bash
npx prisma studio
```

**Acesso:** http://localhost:5555

## 🔄 Fluxo de Trabalho Recomendado

### Durante Desenvolvimento:

1. **Modificar o schema:**
   ```prisma
   // prisma/schema.prisma
   model Nfe {
     // ... campos existentes
     novoCampo String? // Adicionar novo campo
   }
   ```

2. **Sincronizar com banco:**
   ```bash
   npm run db:sync
   ```

3. **Testar as mudanças**

4. **Quando estiver satisfeito, criar migração:**
   ```bash
   npx prisma migrate dev --name add_novo_campo_nfe
   ```

### Antes de Fazer Deploy:

1. **Commitar as migrações:**
   ```bash
   git add prisma/migrations/
   git commit -m "feat: adiciona novo campo na NFe"
   ```

2. **Em produção, aplicar migrações:**
   ```bash
   npm run prisma:migrate:deploy
   ```

## ⚠️ Problemas Comuns

### Erro: "Column does not exist"

**Causa:** O schema do Prisma está diferente do banco de dados.

**Solução:**
```bash
npm run db:sync
```

### Erro: "Migration failed"

**Causa:** Conflito entre migrações ou dados incompatíveis.

**Solução (Desenvolvimento):**
```bash
npm run prisma:migrate:reset
```

**Solução (Produção):**
- Revisar a migração
- Corrigir dados manualmente se necessário
- Criar migração de correção

### Schema e Banco Desincronizados

**Solução rápida (Desenvolvimento):**
```bash
npm run db:sync
```

**Solução correta (Produção):**
```bash
npx prisma migrate dev --name fix_schema_sync
```

## 📝 Boas Práticas

1. ✅ **Use `db:sync` durante desenvolvimento**
2. ✅ **Crie migrações antes de commitar**
3. ✅ **Nunca edite migrações já aplicadas**
4. ✅ **Use nomes descritivos para migrações**
5. ✅ **Teste migrações em ambiente de staging**
6. ✅ **Faça backup antes de resetar o banco**
7. ❌ **Nunca crie SQL manual para migrações**
8. ❌ **Nunca edite o banco diretamente em produção**

## 🚀 Comandos Rápidos

```bash
# Setup inicial do projeto
npm run db:setup

# Desenvolvimento rápido
npm run db:sync

# Criar migração
npx prisma migrate dev --name nome_descritivo

# Aplicar migrações (produção)
npm run prisma:migrate:deploy

# Resetar tudo (desenvolvimento)
npm run prisma:migrate:reset

# Visualizar dados
npm run prisma:studio
```

## 📚 Documentação Oficial

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma DB Push](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

