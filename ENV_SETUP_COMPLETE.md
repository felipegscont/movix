# ✅ Configuração de Ambiente Completa

## 📁 Arquivos `.env.example` Criados

### ✅ Backend (`backend/.env.example`)
```env
NODE_ENV=development
PORT=3000

# PostgreSQL (alinhado com docker-compose.yml)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/movix_nfe?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movix_nfe

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=movix_jwt_secret_dev_2024

# Microserviço NFe
NFE_SERVICE_URL=http://localhost:8080
NFE_SERVICE_API_KEY=movix_nfe_api_key_dev_2024

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./storage/uploads
```

### ✅ Microserviço NFe (`backend/nfe-service/.env.example`)
```env
APP_ENV=development
APP_DEBUG=true

# NFe (2=Homologação, 1=Produção)
NFE_AMBIENTE=2

# Certificado Digital
CERT_PATH=/var/www/html/certificates/certificado.pfx
CERT_PASSWORD=

# Emitente Padrão (usado apenas para testes)
EMPRESA_CNPJ=00000000000000
EMPRESA_RAZAO_SOCIAL=Empresa Teste LTDA
EMPRESA_UF=SP

# Segurança (deve ser igual ao backend)
API_KEY=movix_nfe_api_key_dev_2024

# Logs
LOG_LEVEL=debug
LOG_PATH=/var/www/html/logs
```

### ✅ Frontend (`frontend/.env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🔒 Arquivos `.gitignore` Atualizados

### ✅ Raiz do Projeto (`.gitignore`)
- Ignora `.env` e variações
- **Permite** `.env.example` em todos os módulos

### ✅ Backend (`backend/.gitignore`)
- Ignora `.env` e variações
- **Permite** `.env.example`
- **Permite** `nfe-service/.env.example`

### ✅ Frontend (`frontend/.gitignore`)
- Ignora `.env*`
- **Permite** `.env.example`

### ✅ Microserviço NFe (`backend/nfe-service/.gitignore`) - **NOVO**
- Ignora `.env` e variações
- **Permite** `.env.example`
- Ignora certificados `.pfx`, `.pem`, `.key`
- Ignora XMLs e uploads gerados
- Permite `.gitkeep` para manter estrutura de pastas

---

## 📂 Estrutura de Pastas Criada

```
backend/nfe-service/
├── certificates/
│   └── .gitkeep          ✅ NOVO
├── storage/
│   ├── xmls/
│   │   └── .gitkeep      ✅ NOVO
│   └── uploads/
│       └── .gitkeep      ✅ NOVO
├── .env.example          ✅ Já existia (atualizado)
└── .gitignore            ✅ NOVO
```

---

## 🚀 Como Usar

### 1️⃣ Primeira Vez (Setup Inicial)

```bash
# Backend
cd backend
cp .env.example .env

# Microserviço NFe
cd nfe-service
cp .env.example .env
cd ..

# Frontend
cd ../frontend
cp .env.example .env
cd ..
```

### 2️⃣ Iniciar Docker

```bash
cd backend
docker-compose up -d
```

### 3️⃣ Iniciar Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### 4️⃣ Iniciar Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Verificação

### Docker Containers
```bash
cd backend
docker-compose ps
```

Deve mostrar:
- ✅ `movix_postgres_dev` (porta 5432) - healthy
- ✅ `movix_dbgate_dev` (porta 3001) - running
- ✅ `movix_redis_dev` (porta 6379) - healthy

### Acessos
- **Frontend:** http://localhost:3002
- **Backend API:** http://localhost:3000
- **DbGate:** http://localhost:3001

---

## 🔑 Pontos Importantes

1. **Senhas Padrão:** As senhas no `.env.example` são para desenvolvimento. **NUNCA use em produção!**

2. **API Key:** A chave `movix_nfe_api_key_dev_2024` deve ser **igual** no backend e no microserviço NFe.

3. **Certificados:** Nunca commite certificados digitais (`.pfx`, `.pem`, `.key`). O `.gitignore` já está configurado para ignorá-los.

4. **Database URL:** A `DATABASE_URL` deve corresponder exatamente às variáveis `POSTGRES_*` do docker-compose.

5. **Git:** Os arquivos `.env.example` **SERÃO commitados** no repositório. Os arquivos `.env` **NÃO serão**.

---

## 📝 Checklist de Commit

Antes de fazer commit, verifique:

- [ ] `.env.example` está atualizado em todos os módulos
- [ ] `.env` **NÃO** está sendo commitado
- [ ] Certificados **NÃO** estão sendo commitados
- [ ] `.gitignore` está correto em todos os módulos
- [ ] Pastas vazias têm `.gitkeep`

---

## 🎯 Próxima Vez que Clonar o Repo

```bash
# 1. Copiar .env
cp backend/.env.example backend/.env
cp backend/nfe-service/.env.example backend/nfe-service/.env
cp frontend/.env.example frontend/.env

# 2. Iniciar Docker
cd backend && docker-compose up -d

# 3. Setup Backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 4. Rodar Backend
npm run start:dev

# 5. Rodar Frontend (outro terminal)
cd ../frontend
npm install
npm run dev
```

---

## ✅ Status

- ✅ `.env.example` criados e alinhados
- ✅ `.gitignore` configurados corretamente
- ✅ Estrutura de pastas criada
- ✅ Docker testado e funcionando
- ✅ Pronto para commit no Git
- ✅ Pronto para desenvolvimento

**Tudo configurado e pronto para uso! 🎉**

