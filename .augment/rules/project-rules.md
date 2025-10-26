# 📋 REGRAS DO PROJETO MOVIX NFe

**Sistema de Gestão Fiscal e Emissão de Notas Fiscais Eletrônicas**  
**Versão**: 1.0  
**Data**: 26/10/2025  
**Análise**: Completa e Granular

---

## 🎯 VISÃO GERAL DO PROJETO

### Descrição
Sistema completo de gestão fiscal para emissão de NFe (Nota Fiscal Eletrônica), com backend em NestJS, frontend em Next.js e microserviço PHP para comunicação com SEFAZ.

### Domínio de Negócio
- **Setor**: Fiscal/Tributário
- **Foco**: Emissão de NFe modelo 55
- **Conformidade**: Legislação fiscal brasileira (SEFAZ)
- **Padrão NFe**: IT 2024.002 v.1.10

### Entidades Principais
- **Emitente**: Empresa que emite notas fiscais
- **Cliente**: Destinatário das notas (PF/PJ)
- **Fornecedor**: Fornecedores de produtos
- **Produto**: Itens comercializados
- **NFe**: Nota Fiscal Eletrônica
- **Matriz Fiscal**: Regras de tributação
- **Natureza de Operação**: Tipo de operação fiscal
- **Orçamento/Pedido**: Documentos pré-venda

---

## 🏗️ ARQUITETURA E STACK TECNOLÓGICA

### Backend (NestJS)
```
Tecnologias:
- Framework: NestJS 11.x
- Runtime: Node.js
- Linguagem: TypeScript 5.7.x
- ORM: Prisma 6.17.x
- Banco de Dados: PostgreSQL
- Cache: Redis
- Validação: class-validator, class-transformer
- HTTP Client: Axios
- Autenticação: JWT (passport-jwt)
```

### Frontend (Next.js)
```
Tecnologias:
- Framework: Next.js 15.5.6 (App Router)
- Runtime: React 19.1.0
- Linguagem: TypeScript 5.x
- UI Library: shadcn/ui (Radix UI)
- Estilização: Tailwind CSS 4.x
- Formulários: React Hook Form 7.65.0
- Validação: Zod 4.1.12
- Tabelas: TanStack Table 8.21.3
- Gráficos: Recharts 2.15.4
- Notificações: Sonner 2.0.7
- Temas: next-themes 0.4.6
- Ícones: Lucide React, Tabler Icons
```

### Microserviço NFe (PHP)
```
Tecnologias:
- Linguagem: PHP 8.0+
- Framework: Slim 4.x
- Biblioteca NFe: nfephp-org/sped-nfe 5.1
- Logger: Monolog 2.x
- Env: vlucas/phpdotenv 5.x
- Testes: PHPUnit 9.x
- Code Style: PHP_CodeSniffer 3.x
```

### Infraestrutura
```
- Containerização: Docker + Docker Compose
- Banco de Dados: PostgreSQL (porta 5432)
- Cache: Redis (porta 6379)
- Admin DB: DbGate (porta 3001)
- Backend API: NestJS (porta 3000)
- Frontend: Next.js (porta 3002)
- Microserviço NFe: PHP (porta 8080)
```

---

## 📁 ESTRUTURA DE PASTAS

### Backend
```
backend/
├── src/
│   ├── app.module.ts              # Módulo raiz
│   ├── main.ts                    # Bootstrap da aplicação
│   ├── config/                    # Configurações
│   ├── common/                    # Recursos compartilhados
│   │   ├── pipes/                 # Pipes customizados
│   │   └── services/              # Serviços comuns
│   ├── prisma/                    # Prisma service
│   └── modules/                   # Módulos de negócio
│       ├── emitente/              # Gestão de emitentes
│       ├── cliente/               # Gestão de clientes
│       ├── fornecedor/            # Gestão de fornecedores
│       ├── produto/               # Gestão de produtos
│       ├── nfe/                   # Gestão de NFe
│       ├── matriz-fiscal/         # Regras fiscais
│       ├── natureza-operacao/     # Naturezas de operação
│       ├── forma-pagamento/       # Formas de pagamento
│       ├── orcamento/             # Orçamentos
│       ├── pedido/                # Pedidos
│       ├── auxiliares/            # Tabelas auxiliares
│       ├── external-apis/         # APIs externas
│       └── configuracao-nfe/      # Configurações NFe
├── prisma/
│   ├── schema.prisma              # Schema do banco
│   ├── seed.ts                    # Seed principal
│   ├── seeders/                   # Seeders modulares
│   └── migrations/                # Migrações
├── nfe-service/                   # Microserviço PHP
│   ├── public/                    # Entry point
│   ├── src/                       # Código fonte
│   ├── config/                    # Configurações
│   ├── storage/                   # XMLs gerados
│   └── certificates/              # Certificados digitais
└── storage/                       # Armazenamento local
```

### Frontend
```
frontend/
├── app/                           # App Router (Next.js 15)
│   ├── layout.tsx                 # Layout raiz
│   ├── page.tsx                   # Página inicial
│   ├── dashboard/                 # Dashboard
│   ├── cadastros/                 # Cadastros
│   │   ├── clientes/
│   │   ├── fornecedores/
│   │   └── produtos/
│   ├── fiscal/                    # Módulo fiscal
│   │   └── nfe/
│   ├── vendas/                    # Módulo vendas
│   │   ├── orcamentos/
│   │   ├── pedidos/
│   │   └── cupons/
│   ├── configuracoes/             # Configurações
│   │   ├── empresa/
│   │   └── fiscal/
│   └── relatorios/                # Relatórios
├── components/                    # Componentes React
│   ├── ui/                        # Componentes shadcn/ui
│   ├── layout/                    # Layout components
│   ├── cadastros/                 # Componentes de cadastro
│   ├── nfe/                       # Componentes NFe
│   ├── vendas/                    # Componentes vendas
│   ├── configuracoes/             # Componentes config
│   ├── shared/                    # Componentes compartilhados
│   └── data-table-filter/         # Sistema de filtros
├── lib/                           # Bibliotecas
│   ├── services/                  # API clients
│   ├── schemas/                   # Schemas Zod
│   ├── constants/                 # Constantes
│   └── utils/                     # Utilitários
├── hooks/                         # Custom hooks
│   ├── clientes/
│   ├── produtos/
│   ├── fornecedores/
│   └── shared/
└── types/                         # Definições de tipos
```

---

## 🎨 PADRÕES DE CÓDIGO

### Backend (NestJS)

#### 1. Estrutura de Módulos
```typescript
// Padrão: Um módulo por entidade de negócio
@Module({
  imports: [PrismaModule],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
```

#### 2. Controllers
```typescript
// Padrão: RESTful, validação com pipes
@Controller('entities')
export class EntityController {
  constructor(private readonly service: EntityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) dto: CreateEntityDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll(
      parseInt(page || '1'),
      parseInt(limit || '10')
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEntityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

#### 3. Services
```typescript
// Padrão: Lógica de negócio, validações, Prisma
@Injectable()
export class EntityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEntityDto) {
    // 1. Validações de negócio
    // 2. Verificar duplicatas
    // 3. Criar no banco com relacionamentos
    return this.prisma.entity.create({
      data: dto,
      include: { relations: true },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.entity.findMany({ skip, take: limit }),
      this.prisma.entity.count(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

#### 4. DTOs (Data Transfer Objects)
```typescript
// Padrão: class-validator decorators
export class CreateEntityDto {
  @IsString()
  @Length(1, 200)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedDto)
  items: NestedDto[];
}
```

#### 5. Prisma Schema
```prisma
// Padrão: Nomenclatura clara, relacionamentos explícitos
model Entity {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(200)
  value     Decimal  @db.Decimal(15, 2)
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  relatedId String
  related   Related @relation(fields: [relatedId], references: [id])

  @@map("entities")
}
```

### Frontend (Next.js + React)

#### 1. Componentes
```typescript
// Padrão: "use client" quando necessário, TypeScript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ComponentProps {
  title: string
  onAction: () => void
}

export function Component({ title, onAction }: ComponentProps) {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onAction} disabled={loading}>
        Action
      </Button>
    </div>
  )
}
```

#### 2. Custom Hooks
```typescript
// Padrão: Lógica reutilizável, estado e efeitos
"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

export function useEntity() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/entities')
      const result = await response.json()
      setData(result.data)
    } catch (error) {
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, loadData }
}
```

#### 3. Services (API Clients)
```typescript
// Padrão: Classe estática, métodos async
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export class EntityService {
  static async getAll(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams({
      page: (params?.page || 1).toString(),
      limit: (params?.limit || 10).toString(),
    })

    const response = await fetch(`${API_BASE_URL}/entities?${queryParams}`)
    if (!response.ok) {
      throw new Error('Erro ao buscar dados')
    }
    return response.json()
  }

  static async create(data: CreateEntityData) {
    const response = await fetch(`${API_BASE_URL}/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Erro ao criar')
    }
    return response.json()
  }
}
```

#### 4. Schemas (Zod)
```typescript
// Padrão: Validação com Zod
import { z } from "zod"

export const entitySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(200),
  email: z.string().email("Email inválido").optional(),
  value: z.number().min(0, "Valor deve ser positivo"),
})

export type EntityFormData = z.infer<typeof entitySchema>
```

#### 5. Formulários (React Hook Form)
```typescript
// Padrão: React Hook Form + Zod
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function EntityForm() {
  const form = useForm<EntityFormData>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: "",
      value: 0,
    },
  })

  const onSubmit = async (data: EntityFormData) => {
    try {
      await EntityService.create(data)
      toast.success("Criado com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* campos */}
      </form>
    </Form>
  )
}
```

---

## 🔒 REGRAS DE NEGÓCIO FISCAIS

### 1. Emitente
- ✅ CNPJ obrigatório (14 dígitos)
- ✅ Regime tributário: 1=Simples, 2=Presumido, 3=Real
- ✅ Certificado digital A1 (.pfx) obrigatório para produção
- ✅ Configuração NFe separada (série, ambiente, numeração)
- ✅ Apenas um emitente ativo por vez

### 2. Cliente
- ✅ Tipo: FISICA (CPF 11 dígitos) ou JURIDICA (CNPJ 14 dígitos)
- ✅ Indicador IE: 1=Contribuinte, 2=Isento, 9=Não contribuinte
- ✅ Validação automática de indicador IE baseado em tipo e IE
- ✅ Endereço completo obrigatório
- ✅ Soft delete se tiver NFe vinculada

### 3. Produto
- ✅ NCM obrigatório (8 dígitos)
- ✅ CEST opcional (7 dígitos, formato XX.XXX.XX)
- ✅ Unidade de medida (UN, KG, M, etc)
- ✅ Valores com 4 casas decimais
- ✅ Controle de estoque (atual, mínimo, máximo)

### 4. NFe (Nota Fiscal Eletrônica)
- ✅ Numeração sequencial por série
- ✅ Código numérico aleatório (8 dígitos)
- ✅ Status: DIGITACAO, ASSINADA, ENVIADA, AUTORIZADA, CANCELADA
- ✅ Tipo operação: 0=Entrada, 1=Saída
- ✅ Consumidor final: 0=Não, 1=Sim
- ✅ Presença comprador: 0-5, 9
- ✅ Modalidade frete: 0-4, 9
- ✅ Itens com impostos detalhados (ICMS, IPI, PIS, COFINS)
- ✅ Duplicatas/Parcelas para pagamento a prazo
- ✅ XMLs: original, assinado, autorizado

### 5. Matriz Fiscal
- ✅ Regras de tributação por combinação de:
  - Natureza de operação
  - UF origem/destino
  - Tipo de cliente (contribuinte/não contribuinte)
  - NCM do produto
  - Regime tributário
- ✅ CST/CSOSN específicos por imposto
- ✅ Alíquotas configuráveis
- ✅ Redução de base de cálculo
- ✅ FCP (Fundo de Combate à Pobreza)

### 6. Natureza de Operação
- ✅ Código único (ex: VENDA, DEVOL)
- ✅ Tipo: 0=Entrada, 1=Saída
- ✅ CFOPs associados
- ✅ Produtos com exceção de CFOP (JSONB)
- ✅ Informações adicionais padrão

### 7. Pagamentos NFe (IT 2024.002 v.1.10)
- ✅ 26 formas de pagamento (01-20, 90, 91, 99)
- ✅ Código 91 - Pagamento Posterior (novo em 2025)
- ✅ Campos específicos por tipo:
  - Cartão: bandeira, CNPJ credenciadora, autorização
  - PIX: chave, QR Code
  - Boleto: código de barras
- ✅ Validação de soma = valor total NFe
- ✅ Troco para dinheiro

---

## ✅ VALIDAÇÕES E REGRAS DE QUALIDADE

### Backend

#### 1. Validação de Dados
```typescript
// SEMPRE usar class-validator nos DTOs
@IsString()
@Length(14, 14)
@Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
cnpj: string;

// Transform para números
@Transform(({ value }) => parseFloat(value))
@IsNumber({ maxDecimalPlaces: 2 })
valor: number;

// Validação condicional
@ValidateIf(o => o.tipo === 'JURIDICA')
@IsString()
inscricaoEstadual?: string;
```

#### 2. Tratamento de Erros
```typescript
// SEMPRE usar exceções do NestJS
throw new NotFoundException('Entidade não encontrada');
throw new BadRequestException('Dados inválidos');
throw new ConflictException('Registro já existe');
throw new HttpException('Erro customizado', HttpStatus.BAD_REQUEST);
```

#### 3. Pipes Customizados
```typescript
// EmptyStringToUndefinedPipe: Converter strings vazias em undefined
@UsePipes(EmptyStringToUndefinedPipe, ValidationPipe)
```

#### 4. Validação Global
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
}));
```

### Frontend

#### 1. Validação de Formulários
```typescript
// SEMPRE usar Zod + React Hook Form
const schema = z.object({
  cnpj: z.string()
    .length(14, "CNPJ deve ter 14 dígitos")
    .regex(/^\d{14}$/, "CNPJ deve conter apenas números"),
})
```

#### 2. Feedback ao Usuário
```typescript
// SEMPRE usar toast (sonner)
toast.success("Operação realizada com sucesso!")
toast.error("Erro ao processar")
toast.warning("Atenção: verifique os dados")
toast.info("Informação importante")
```

#### 3. Loading States
```typescript
// SEMPRE mostrar loading durante operações assíncronas
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await service.create(data)
  } finally {
    setLoading(false)
  }
}
```

---

## 🔐 SEGURANÇA

### Backend
- ✅ CORS configurado para origens específicas
- ✅ Validação de entrada com class-validator
- ✅ Whitelist de propriedades (forbidNonWhitelisted)
- ✅ Certificados digitais protegidos
- ✅ API Key para microserviço NFe
- ✅ JWT para autenticação (preparado)

### Frontend
- ✅ Variáveis de ambiente (.env.local)
- ✅ Validação client-side com Zod
- ✅ Sanitização de inputs
- ✅ HTTPS em produção

### Microserviço PHP
- ✅ API Key obrigatória
- ✅ Validação de Content-Type
- ✅ Rate limiting
- ✅ Logs de auditoria
- ✅ Certificados em diretório protegido

---

## 📊 BANCO DE DADOS

### Convenções Prisma
```prisma
// 1. IDs: SEMPRE cuid()
id String @id @default(cuid())

// 2. Timestamps: SEMPRE incluir
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// 3. Soft delete: campo ativo
ativo Boolean @default(true)

// 4. Nomes de tabela: plural, snake_case
@@map("nome_tabelas")

// 5. Relacionamentos: SEMPRE explícitos
relatedId String
related   Related @relation(fields: [relatedId], references: [id])

// 6. Índices: para campos de busca
@@index([campo])

// 7. Unique: para campos únicos
campo String @unique

// 8. Decimais: precisão adequada
valor Decimal @db.Decimal(15, 2)  // Valores monetários
quantidade Decimal @db.Decimal(15, 4)  // Quantidades
```

### Migrations
```bash
# Desenvolvimento
npm run db:migrate:dev

# Produção
npm run db:migrate

# Reset (cuidado!)
npm run db:migrate:reset
```

### Seeds
```bash
# Executar seed
npm run db:seed

# Ordem de execução:
# 1. Estados e Municípios (IBGE)
# 2. NCM, CFOP, CST, CSOSN
# 3. Naturezas de Operação
# 4. Formas de Pagamento
# 5. Emitente placeholder
```

---

## 🧪 TESTES

### Backend (Jest)
```typescript
// Padrão: arquivo.spec.ts
describe('EntityService', () => {
  let service: EntityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityService, PrismaService],
    }).compile();

    service = module.get<EntityService>(EntityService);
  });

  it('should create entity', async () => {
    const dto = { name: 'Test' };
    const result = await service.create(dto);
    expect(result).toBeDefined();
  });
});
```

### Comandos
```bash
# Backend
npm run test              # Testes unitários
npm run test:watch        # Watch mode
npm run test:cov          # Cobertura
npm run test:e2e          # Testes E2E

# Microserviço PHP
composer test             # PHPUnit
composer cs-check         # Code style
composer cs-fix           # Fix code style
```

---

## 📝 DOCUMENTAÇÃO

### README.md
- ✅ Descrição clara do projeto
- ✅ Instruções de instalação
- ✅ Comandos disponíveis
- ✅ Estrutura do projeto
- ✅ Tecnologias utilizadas

### Comentários no Código
```typescript
// SEMPRE comentar lógica complexa
/**
 * Calcula impostos baseado na matriz fiscal
 * @param item - Item da NFe
 * @param matriz - Matriz fiscal aplicável
 * @returns Impostos calculados
 */
async calcularImpostos(item: NfeItem, matriz: MatrizFiscal) {
  // Lógica complexa aqui
}
```

### JSDoc para Funções Públicas
```typescript
/**
 * Busca matriz fiscal aplicável
 * 
 * @param params - Parâmetros de busca
 * @param params.naturezaOperacaoId - ID da natureza
 * @param params.ufOrigem - UF de origem
 * @param params.ufDestino - UF de destino
 * @returns Matriz fiscal ou null
 */
async buscarMatrizAplicavel(params: BuscarMatrizParams) {
  // ...
}
```

---

## 🚀 DEPLOY E AMBIENTES

### Ambientes
```
- development: Desenvolvimento local
- homologation: Homologação (SEFAZ ambiente 2)
- production: Produção (SEFAZ ambiente 1)
```

### Variáveis de Ambiente

#### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
REDIS_URL=redis://localhost:6379
JWT_SECRET=secret
NFE_SERVICE_URL=http://localhost:8080
NFE_SERVICE_API_KEY=api_key
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Microserviço PHP (.env)
```bash
APP_ENV=development
NFE_AMBIENTE=2  # 1=Produção, 2=Homologação
CERT_PATH=/path/to/cert.pfx
CERT_PASSWORD=senha
API_KEY=api_key
```

---

## 📦 DEPENDÊNCIAS E VERSIONAMENTO

### Gerenciamento de Pacotes
- ✅ Backend: npm (package-lock.json)
- ✅ Frontend: npm (package-lock.json)
- ✅ Microserviço: Composer (composer.lock)

### Versionamento Semântico
```
MAJOR.MINOR.PATCH
- MAJOR: Mudanças incompatíveis
- MINOR: Novas funcionalidades compatíveis
- PATCH: Correções de bugs
```

### Atualização de Dependências
```bash
# Verificar atualizações
npm outdated

# Atualizar (cuidado com breaking changes)
npm update

# Audit de segurança
npm audit
npm audit fix
```

---

## 🎯 BOAS PRÁTICAS ESPECÍFICAS DO PROJETO

### 1. Nomenclatura
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Classes**: PascalCase
- **Arquivos**: kebab-case.ts
- **Componentes React**: PascalCase.tsx
- **Hooks**: use-nome-hook.ts

### 2. Imports
```typescript
// Ordem de imports:
// 1. Bibliotecas externas
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/client';

// 2. Imports internos (aliases)
import { CreateDto } from './dto/create.dto';
import { Entity } from '@/types';

// 3. Imports relativos
import { helper } from '../utils/helper';
```

### 3. Estrutura de Arquivos
```
module/
├── module.module.ts           # Módulo
├── module.controller.ts       # Controller
├── module.service.ts          # Service
├── module.controller.spec.ts  # Testes controller
├── module.service.spec.ts     # Testes service
└── dto/                       # DTOs
    ├── create-module.dto.ts
    └── update-module.dto.ts
```

### 4. Commits (Conventional Commits)
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
chore: tarefas de manutenção
```

### 5. Git Flow
```
main: Produção
develop: Desenvolvimento
feature/*: Novas funcionalidades
hotfix/*: Correções urgentes
release/*: Preparação de release
```

---

## 🔍 TROUBLESHOOTING

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Reiniciar serviços
docker-compose restart postgres

# Verificar logs
docker-compose logs postgres
```

#### 2. Erro de Migração Prisma
```bash
# Resetar banco (CUIDADO: apaga dados!)
npm run db:migrate:reset

# Gerar client Prisma
npm run db:generate

# Aplicar migrations
npm run db:migrate
```

#### 3. Erro de Certificado NFe
```bash
# Verificar se certificado existe
ls -la backend/nfe-service/certificates/

# Validar certificado
openssl pkcs12 -info -in certificado.pfx

# Verificar permissões
chmod 600 certificado.pfx
```

#### 4. Erro de CORS
```typescript
// Adicionar origem no main.ts
app.enableCors({
  origin: ['http://localhost:3002'],
  credentials: true,
});
```

---

## 📚 REFERÊNCIAS E RECURSOS

### Documentação Oficial
- NestJS: https://docs.nestjs.com/
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- shadcn/ui: https://ui.shadcn.com/
- NFe (SEFAZ): https://www.nfe.fazenda.gov.br/

### Bibliotecas Principais
- class-validator: https://github.com/typestack/class-validator
- Zod: https://zod.dev/
- React Hook Form: https://react-hook-form.com/
- TanStack Table: https://tanstack.com/table
- nfephp: https://github.com/nfephp-org/sped-nfe

### Padrões Fiscais
- IT 2024.002 v.1.10 (NFe)
- Manual de Orientação do Contribuinte (MOC)
- Tabela de CFOP
- Tabela de NCM
- Tabela de CST/CSOSN

---

## ✨ CONCLUSÃO

Este documento estabelece as regras e padrões para o desenvolvimento do projeto Movix NFe. Todos os desenvolvedores devem seguir estas diretrizes para manter a consistência, qualidade e manutenibilidade do código.

**Última Atualização**: 26/10/2025  
**Versão**: 1.0  
**Responsável**: Equipe Movix

