# 🚀 Inicialização Rápida - Movix NFe

## ⚡ 3 Passos para Rodar o Sistema

### 1️⃣ Configurar .env

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

### 2️⃣ Iniciar Docker (Banco de Dados)

```bash
cd backend
docker-compose up -d
```

Aguarde ~30 segundos e verifique:
```bash
docker-compose ps
```

### 3️⃣ Iniciar Backend e Frontend

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Acessar

- **Frontend:** http://localhost:3002
- **Backend:** http://localhost:3000
- **DbGate:** http://localhost:3001

---

## 🛑 Parar

```bash
# Ctrl+C nos terminais do backend e frontend

# Parar Docker
cd backend
docker-compose down
```

---

## 🔄 Reiniciar do Zero

```bash
cd backend
docker-compose down -v
docker-compose up -d
# Aguardar 30 segundos
npx prisma migrate reset --force
npx prisma db seed
npm run start:dev
```

