# 📋 TaskList - NFe 100% Compatibilidade

## 🎯 Objetivo
Atualizar o sistema Movix NFe para 100% de compatibilidade com XMLs de NFe reais de produção, baseado na análise do documento `MAPEAMENTO_COMPLETO_NFE_SCHEMA.md`.

---

## 📊 Status Atual
- **Compatibilidade Atual:** 98%
- **Meta:** 100%
- **Campos Faltando:** 5 (sendo 4 opcionais)

---

## 🗂️ Estrutura da TaskList

### 1️⃣ **Atualizar Schema Prisma para 100% compatibilidade NFe**

#### 1.1 Adicionar campos de totalizadores raros no model Nfe
- [ ] Adicionar `valorICMSDesonerado` - Decimal
- [ ] Adicionar `valorFCP` - Decimal (Fundo Combate Pobreza)
- [ ] Adicionar `valorII` - Decimal (Imposto Importação)
- [ ] Adicionar `valorOutrasDespesas` - Decimal

**Arquivo:** `backend/prisma/schema.prisma`  
**Localização:** Model `Nfe`, seção "Totais de Impostos"

#### 1.2 Criar model NfeDuplicata
- [ ] Criar model com campos:
  - `id` - String @id @default(cuid())
  - `nfeId` - String
  - `numero` - String (ex: "001", "002")
  - `dataVencimento` - DateTime
  - `valor` - Decimal
  - `createdAt` - DateTime
  - `updatedAt` - DateTime
- [ ] Adicionar relacionamento com `Nfe`
- [ ] Adicionar `@@map("nfe_duplicatas")`

**Arquivo:** `backend/prisma/schema.prisma`  
**Localização:** Após model `NfePagamento`

#### 1.3 Adicionar relacionamento duplicatas no model Nfe
- [ ] Adicionar `duplicatas NfeDuplicata[]` nos relacionamentos

**Arquivo:** `backend/prisma/schema.prisma`  
**Localização:** Model `Nfe`, seção "Relacionamentos"

#### 1.4 Criar migration do Prisma
- [ ] Executar: `cd backend && npx prisma migrate dev --name add_nfe_duplicatas_and_totalizadores`
- [ ] Verificar migration criada em `backend/prisma/migrations/`

#### 1.5 Gerar Prisma Client atualizado
- [ ] Executar: `cd backend && npx prisma generate`
- [ ] Verificar tipos atualizados em `node_modules/.prisma/client/`

---

### 2️⃣ **Atualizar Backend - DTOs e Validações**

#### 2.1 Criar CreateNfeDuplicataDto
- [ ] Criar arquivo: `backend/src/modules/nfe/dto/create-nfe-duplicata.dto.ts`
- [ ] Adicionar validações:
  - `@IsString() numero`
  - `@IsDateString() dataVencimento`
  - `@IsNumber() @Min(0.01) valor`

#### 2.2 Atualizar CreateNfeDto
- [ ] Adicionar campos opcionais:
  - `@IsOptional() @IsNumber() valorICMSDesonerado?`
  - `@IsOptional() @IsNumber() valorFCP?`
  - `@IsOptional() @IsNumber() valorII?`
  - `@IsOptional() @IsNumber() valorOutrasDespesas?`
- [ ] Adicionar array de duplicatas:
  - `@IsOptional() @IsArray() @ValidateNested() duplicatas?: CreateNfeDuplicataDto[]`

**Arquivo:** `backend/src/modules/nfe/dto/create-nfe.dto.ts`

#### 2.3 Atualizar UpdateNfeDto
- [ ] Verificar se `PartialType(CreateNfeDto)` já inclui novos campos
- [ ] Adicionar validações específicas se necessário

**Arquivo:** `backend/src/modules/nfe/dto/update-nfe.dto.ts`

#### 2.4 Atualizar NfeService - método create
- [ ] Adicionar lógica para criar duplicatas junto com NFe
- [ ] Usar transação Prisma para garantir atomicidade
- [ ] Validar soma das duplicatas = valor total da NFe

**Arquivo:** `backend/src/modules/nfe/nfe.service.ts`

#### 2.5 Atualizar NfeService - método update
- [ ] Adicionar lógica para atualizar/deletar/criar duplicatas
- [ ] Usar transação Prisma
- [ ] Validar integridade dos dados

**Arquivo:** `backend/src/modules/nfe/nfe.service.ts`

#### 2.6 Atualizar NfeService - método findOne
- [ ] Adicionar `duplicatas: true` no include do Prisma
- [ ] Ordenar duplicatas por número

**Arquivo:** `backend/src/modules/nfe/nfe.service.ts`

---

### 3️⃣ **Criar Mapper Cliente para NFe**

#### 3.1 Criar arquivo cliente-to-nfe.mapper.ts
- [ ] Criar: `backend/src/modules/cliente/mappers/cliente-to-nfe.mapper.ts`

#### 3.2 Implementar interface NFeDestinatario
- [ ] Criar interface com campos:
  - `CNPJ?: string`
  - `CPF?: string`
  - `xNome: string`
  - `enderDest: { xLgr, nro, xCpl?, xBairro, cMun, xMun, UF, CEP, cPais, xPais }`
  - `indIEDest: number`
  - `IE?: string`

#### 3.3 Implementar método toDestinatario
- [ ] Converter Cliente do banco para formato NFe
- [ ] Validar documento (CPF 11 dígitos, CNPJ 14 dígitos)
- [ ] Validar endereço completo
- [ ] Validar município (código IBGE 7 dígitos)
- [ ] Validar estado (UF 2 caracteres)
- [ ] Validar IE quando `indicadorIE = 1`

#### 3.4 Implementar método validateForNFe
- [ ] Retornar array de erros encontrados
- [ ] Validar todos os campos obrigatórios
- [ ] Validar regras de negócio (PF não pode ser contribuinte ICMS)

---

### 4️⃣ **Atualizar Frontend - Forms e UI**

#### 4.1 Atualizar types/interfaces do frontend
- [ ] Adicionar campos em interface `Nfe`:
  - `valorICMSDesonerado?: number`
  - `valorFCP?: number`
  - `valorII?: number`
  - `valorOutrasDespesas?: number`
  - `duplicatas?: NfeDuplicata[]`
- [ ] Criar interface `NfeDuplicata`:
  - `id?: string`
  - `numero: string`
  - `dataVencimento: string`
  - `valor: number`

**Arquivo:** `frontend/types/nfe.ts` ou similar

#### 4.2 Criar componente DuplicatasForm
- [ ] Criar: `frontend/components/nfe/duplicatas-form.tsx`
- [ ] Campos: número, data vencimento, valor
- [ ] Botão adicionar duplicata
- [ ] Lista de duplicatas com botão remover
- [ ] Validação: soma das duplicatas = valor total NFe
- [ ] Sugestão automática de valores (dividir total por número de parcelas)

#### 4.3 Atualizar NfeForm - aba Totalizadores
- [ ] Adicionar seção "Totalizadores Opcionais" (collapsed por padrão)
- [ ] Adicionar campos:
  - ICMS Desonerado (Input numérico)
  - FCP - Fundo Combate Pobreza (Input numérico)
  - II - Imposto Importação (Input numérico)
  - Outras Despesas (Input numérico)
- [ ] Adicionar tooltips explicativos

**Arquivo:** `frontend/components/nfe/nfe-form.tsx` ou similar

#### 4.4 Atualizar NfeForm - aba Cobrança
- [ ] Adicionar seção "Duplicatas/Parcelamento"
- [ ] Integrar componente `DuplicatasForm`
- [ ] Adicionar toggle "Pagamento à vista" / "Parcelado"
- [ ] Mostrar resumo: X parcelas de R$ Y

**Arquivo:** `frontend/components/nfe/nfe-form.tsx` ou similar

#### 4.5 Atualizar hook use-nfe-form
- [ ] Adicionar estado para duplicatas: `const [duplicatas, setDuplicatas] = useState<NfeDuplicata[]>([])`
- [ ] Função `adicionarDuplicata(duplicata: NfeDuplicata)`
- [ ] Função `removerDuplicata(index: number)`
- [ ] Função `validarDuplicatas()` - soma = total
- [ ] Incluir duplicatas no payload de envio

**Arquivo:** `frontend/hooks/nfe/use-nfe-form.ts` ou similar

#### 4.6 Atualizar nfe.service.ts
- [ ] Incluir duplicatas no payload de `createNfe()`
- [ ] Incluir duplicatas no payload de `updateNfe()`
- [ ] Garantir que duplicatas sejam enviadas corretamente

**Arquivo:** `frontend/lib/services/nfe.service.ts` ou similar

#### 4.7 Atualizar visualização de NFe
- [ ] Exibir duplicatas em tabela (número, vencimento, valor)
- [ ] Exibir totalizadores opcionais (se preenchidos)
- [ ] Adicionar seção "Cobrança" na visualização

**Arquivo:** `frontend/app/nfes/[id]/page.tsx` ou similar

---

### 5️⃣ **Testes e Validação Final**

#### 5.1 Testar criação de NFe sem duplicatas
- [ ] Criar NFe à vista
- [ ] Validar que duplicatas não são criadas
- [ ] Validar totalizadores opcionais vazios

#### 5.2 Testar criação de NFe com duplicatas
- [ ] Criar NFe parcelada em 3x
- [ ] Validar 3 duplicatas criadas no banco
- [ ] Validar soma das duplicatas = valor total
- [ ] Validar datas de vencimento

#### 5.3 Testar campos de totalizadores raros
- [ ] Criar NFe com `valorFCP` preenchido
- [ ] Criar NFe com `valorII` preenchido
- [ ] Validar que valores são salvos corretamente

#### 5.4 Validar mapper Cliente para NFe
- [ ] Testar conversão de Cliente PF (CPF)
- [ ] Testar conversão de Cliente PJ Contribuinte (CNPJ + IE)
- [ ] Testar conversão de Cliente PJ Não Contribuinte (CNPJ sem IE)
- [ ] Validar erros para clientes inválidos

#### 5.5 Testar migration do banco
- [ ] Verificar tabela `nfe_duplicatas` criada
- [ ] Verificar colunas adicionadas em `nfes`
- [ ] Verificar relacionamentos funcionando

#### 5.6 Validar compatibilidade com XMLs reais
- [ ] Comparar estrutura de dados com XML 1 (PJ)
- [ ] Comparar estrutura de dados com XML 2 (PF)
- [ ] Validar que todos os campos necessários estão presentes
- [ ] Validar que mapeamento está correto

---

## 📈 Progresso

**Total de Tarefas:** 35  
**Concluídas:** 0  
**Em Progresso:** 0  
**Pendentes:** 35

---

## 🎯 Prioridades

### 🔴 Alta Prioridade (Bloqueante)
1. Atualizar Schema Prisma (1.1 - 1.5)
2. Criar Mapper Cliente para NFe (3.1 - 3.4)

### 🟡 Média Prioridade (Importante)
3. Atualizar Backend DTOs (2.1 - 2.6)
4. Atualizar Frontend Forms (4.1 - 4.7)

### 🟢 Baixa Prioridade (Opcional)
5. Testes e Validação (5.1 - 5.6)

---

## 📝 Observações

### Campos Opcionais
Os 4 campos de totalizadores (`valorICMSDesonerado`, `valorFCP`, `valorII`, `valorOutrasDespesas`) são **opcionais** e raramente usados:
- Podem ser implementados mas não são obrigatórios para emissão básica de NFe
- Recomenda-se deixar como campos opcionais no formulário

### Duplicatas
- Duplicatas são necessárias apenas para NFe parceladas (boleto, carnê)
- NFe à vista não precisa de duplicatas
- Validar que soma das duplicatas = valor total da NFe

### Compatibilidade
- O sistema já está 98% compatível
- Após implementação completa: 100% compatível
- Pronto para emissão de NFe em produção

---

## 🚀 Próximos Passos

1. ✅ Começar pela atualização do Schema Prisma
2. ✅ Criar migration e gerar Prisma Client
3. ✅ Implementar Mapper Cliente → NFe
4. ✅ Atualizar DTOs e Services do backend
5. ✅ Atualizar formulários do frontend
6. ✅ Testar fluxo completo

---

**Data de Criação:** 2025-10-21  
**Baseado em:** MAPEAMENTO_COMPLETO_NFE_SCHEMA.md  
**Status:** 🟡 Aguardando Implementação

