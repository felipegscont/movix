# 🚀 **Guia de Inicialização - Sistema Movix NFe**

## 📋 **Pré-requisitos**

Antes de iniciar, certifique-se de ter instalado:

- ✅ **Node.js** (versão 18 ou superior)
- ✅ **npm** ou **yarn**
- ✅ **Docker** e **Docker Compose**
- ✅ **Git**

## 🔧 **1. Configuração dos Arquivos de Ambiente**

Os arquivos `.env` já foram criados com as configurações padrão para desenvolvimento:

### **Backend:**
- ✅ `backend/.env` - Configurações principais do backend
- ✅ `backend/nfe-service/.env` - Configurações do microserviço NFe

### **Frontend:**
- ✅ `frontend/.env.local` - Configurações do frontend

## 🐳 **2. Inicializar Serviços Docker (Backend)**

```bash
# Navegar para o diretório backend
cd backend

# Iniciar PostgreSQL, Redis e DbGate
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps
```

**Serviços iniciados:**
- 🗄️ **PostgreSQL**: `localhost:5432`
- 🔄 **Redis**: `localhost:6379`
- 🛠️ **DbGate**: `http://localhost:3001`

## 📦 **3. Configurar Backend (NestJS)**

```bash
# Ainda no diretório backend
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações do banco
npm run prisma:migrate

# Popular banco com dados iniciais (seed)
npm run prisma:seed

# Iniciar o backend em modo desenvolvimento
npm run start:dev
```

**Backend estará rodando em:** `http://localhost:3000`

## 🌐 **4. Configurar Frontend (Next.js)**

```bash
# Abrir novo terminal e navegar para frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o frontend em modo desenvolvimento
npm run dev
```

**Frontend estará rodando em:** `http://localhost:3002`

## 🔧 **5. Configurar Microserviço NFe (PHP)**

```bash
# Abrir novo terminal e navegar para nfe-service
cd backend/nfe-service

# Instalar dependências PHP
composer install

# Iniciar o microserviço
docker-compose up -d
```

**Microserviço NFe estará rodando em:** `http://localhost:8080`

## 🔍 **6. Verificar se Tudo Está Funcionando**

### **Testar Backend:**
```bash
curl http://localhost:3000
# Deve retornar: "Hello World!"
```

### **Testar Frontend:**
Abrir no navegador: `http://localhost:3002`

### **Testar DbGate:**
Abrir no navegador: `http://localhost:3001`

### **Testar Microserviço NFe:**
```bash
curl http://localhost:8080/health
# Deve retornar status de saúde do serviço
```

## 🌐 **7. URLs de Acesso**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3002 | Interface principal do usuário |
| **Backend API** | http://localhost:3000 | API REST do sistema |
| **DbGate** | http://localhost:3001 | Interface de administração do banco |
| **NFe Service** | http://localhost:8080 | Microserviço de NFe |

## 🗄️ **8. Acessar o Banco de Dados**

### **Via DbGate (Recomendado):**
1. Abrir `http://localhost:3001`
2. A conexão já está configurada automaticamente
3. Explorar as tabelas e dados

### **Via linha de comando:**
```bash
# Conectar ao PostgreSQL
docker exec -it movix_postgres_dev psql -U postgres -d movix_nfe

# Listar tabelas
\dt

# Sair
\q
```

## 🧪 **9. Testar Funcionalidades**

### **Testar APIs do Backend:**
```bash
# Listar clientes
curl http://localhost:3000/clientes

# Listar produtos
curl http://localhost:3000/produtos

# Listar NFes
curl http://localhost:3000/nfes

# Health check do NFe service
curl http://localhost:3000/nfes/health
```

### **Testar Frontend:**
1. Abrir `http://localhost:3002`
2. Navegar pelo menu lateral
3. Testar páginas de clientes, produtos, etc.

## 🛠️ **10. Comandos Úteis**

### **Backend:**
```bash
# Parar e reiniciar containers
docker-compose down
docker-compose up -d

# Ver logs dos containers
docker-compose logs -f

# Resetar banco de dados
npm run prisma:migrate:reset

# Abrir Prisma Studio
npm run prisma:studio
```

### **Frontend:**
```bash
# Build para produção
npm run build

# Iniciar em modo produção
npm run start
```

## 🚨 **11. Solução de Problemas**

### **Porta em uso:**
```bash
# Verificar portas em uso
netstat -tlnp | grep -E ':(3000|3001|3002|5432|6379|8080)'

# Matar processo em porta específica
sudo fuser -k 3000/tcp
```

### **Problemas com Docker:**
```bash
# Limpar containers e volumes
docker-compose down -v
docker system prune -f

# Reconstruir containers
docker-compose up -d --build
```

### **Problemas com Banco:**
```bash
# Resetar banco completamente
npm run prisma:migrate:reset
npm run prisma:seed
```

### **Problemas com Node Modules:**
```bash
# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📊 **12. Próximos Passos**

Após a inicialização bem-sucedida:

1. ✅ **Explorar o sistema** através do frontend
2. ✅ **Cadastrar um emitente** em `/configuracoes/emitente`
3. ✅ **Adicionar clientes** em `/clientes`
4. ✅ **Cadastrar produtos** em `/produtos`
5. ✅ **Criar uma NFe** em `/nfes/nova`
6. ✅ **Configurar certificado digital** para ambiente de produção

## 🔐 **13. Configurações de Produção**

Para ambiente de produção, altere nos arquivos `.env`:

### **Backend (.env):**
```env
NODE_ENV=production
NFE_AMBIENTE=1
JWT_SECRET=sua_chave_secreta_forte
CERT_PATH=./certificates/certificado_producao.pfx
CERT_PASSWORD=senha_real_do_certificado
```

### **NFe Service (.env):**
```env
APP_ENV=production
APP_DEBUG=false
NFE_AMBIENTE=1
EMPRESA_CNPJ=cnpj_real_da_empresa
CERT_PATH=/path/to/real/certificate.pfx
```

## 📞 **14. Suporte**

Se encontrar problemas:

1. Verificar logs dos containers: `docker-compose logs`
2. Verificar logs do backend: console do terminal
3. Verificar logs do frontend: console do navegador
4. Consultar documentação específica de cada módulo

---

## ✅ **Checklist de Inicialização**

- [ ] Docker containers iniciados
- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 3002
- [ ] DbGate acessível na porta 3001
- [ ] NFe Service rodando na porta 8080
- [ ] Banco de dados migrado e populado
- [ ] APIs respondendo corretamente
- [ ] Interface frontend carregando

**🎉 Sistema pronto para uso!**
