# 🚀 GUIA DE COMANDOS PARA IMPLEMENTAÇÃO

## 📋 ORDEM DE EXECUÇÃO

Execute as tasks na seguinte ordem:
1. Backend - Prisma Schema
2. Backend - Módulos (NFC-e, CT-e, MDF-e, NFS-e)
3. Frontend - Services
4. Frontend - Componentes
5. Testes e Validação

---

## 🗄️ 1. BACKEND - PRISMA SCHEMA

### Comandos para copiar e adaptar models:

```bash
# Não há comando cp para Prisma
# Edite manualmente backend/prisma/schema.prisma
# Adicione os models seguindo o padrão de ConfiguracaoNfe e InutilizacaoNfe
```

### Após adicionar todos os models, execute:

```bash
cd backend
npx prisma db push --accept-data-loss
npx prisma generate
```

---

## 🔧 2. BACKEND - MÓDULOS

### NFC-e

```bash
cd backend/src/modules

# Copiar módulo de configuração
cp -r configuracao-nfe configuracao-nfce

# Copiar módulo de inutilização
cp -r inutilizacao-nfe inutilizacao-nfce

# Renomear arquivos e conteúdo (use find/replace no editor)
# configuracao-nfe -> configuracao-nfce
# ConfiguracaoNfe -> ConfiguracaoNfce
# configuracoes-nfe -> configuracoes-nfce
```

### CT-e

```bash
cd backend/src/modules

# Copiar módulo de configuração
cp -r configuracao-nfe configuracao-cte

# Copiar módulo de inutilização
cp -r inutilizacao-nfe inutilizacao-cte

# Renomear (find/replace):
# configuracao-nfe -> configuracao-cte
# ConfiguracaoNfe -> ConfiguracaoCte
# configuracoes-nfe -> configuracoes-cte
```

### MDF-e

```bash
cd backend/src/modules

# Copiar módulo de configuração
cp -r configuracao-nfe configuracao-mdfe

# Copiar módulo de inutilização
cp -r inutilizacao-nfe inutilizacao-mdfe

# Renomear (find/replace):
# configuracao-nfe -> configuracao-mdfe
# ConfiguracaoNfe -> ConfiguracaoMdfe
# configuracoes-nfe -> configuracoes-mdfe
```

### NFS-e (sem inutilização)

```bash
cd backend/src/modules

# Copiar apenas módulo de configuração
cp -r configuracao-nfe configuracao-nfse

# Renomear (find/replace):
# configuracao-nfe -> configuracao-nfse
# ConfiguracaoNfe -> ConfiguracaoNfse
# configuracoes-nfe -> configuracoes-nfse
```

### Registrar módulos no app.module.ts

```typescript
// backend/src/app.module.ts
import { ConfiguracaoNfceModule } from './modules/configuracao-nfce/configuracao-nfce.module';
import { InutilizacaoNfceModule } from './modules/inutilizacao-nfce/inutilizacao-nfce.module';
import { ConfiguracaoCteModule } from './modules/configuracao-cte/configuracao-cte.module';
import { InutilizacaoCteModule } from './modules/inutilizacao-cte/inutilizacao-cte.module';
import { ConfiguracaoMdfeModule } from './modules/configuracao-mdfe/configuracao-mdfe.module';
import { InutilizacaoMdfeModule } from './modules/inutilizacao-mdfe/inutilizacao-mdfe.module';
import { ConfiguracaoNfseModule } from './modules/configuracao-nfse/configuracao-nfse.module';

@Module({
  imports: [
    // ... outros módulos
    ConfiguracaoNfceModule,
    InutilizacaoNfceModule,
    ConfiguracaoCteModule,
    InutilizacaoCteModule,
    ConfiguracaoMdfeModule,
    InutilizacaoMdfeModule,
    ConfiguracaoNfseModule,
  ],
})
```

---

## 🎨 3. FRONTEND - SERVICES

### NFC-e

```bash
cd frontend/lib/services

# Copiar services
cp configuracao-nfe.service.ts configuracao-nfce.service.ts
cp inutilizacao-nfe.service.ts inutilizacao-nfce.service.ts

# Renomear (find/replace em cada arquivo):
# ConfiguracaoNfe -> ConfiguracaoNfce
# configuracoes-nfe -> configuracoes-nfce
# InutilizacaoNfe -> InutilizacaoNfce
# inutilizacoes-nfe -> inutilizacoes-nfce
```

### CT-e

```bash
cd frontend/lib/services

cp configuracao-nfe.service.ts configuracao-cte.service.ts
cp inutilizacao-nfe.service.ts inutilizacao-cte.service.ts

# Renomear:
# ConfiguracaoNfe -> ConfiguracaoCte
# configuracoes-nfe -> configuracoes-cte
# InutilizacaoNfe -> InutilizacaoCte
# inutilizacoes-nfe -> inutilizacoes-cte
```

### MDF-e

```bash
cd frontend/lib/services

cp configuracao-nfe.service.ts configuracao-mdfe.service.ts
cp inutilizacao-nfe.service.ts inutilizacao-mdfe.service.ts

# Renomear:
# ConfiguracaoNfe -> ConfiguracaoMdfe
# configuracoes-nfe -> configuracoes-mdfe
# InutilizacaoNfe -> InutilizacaoMdfe
# inutilizacoes-nfe -> inutilizacoes-mdfe
```

### NFS-e (sem inutilização)

```bash
cd frontend/lib/services

cp configuracao-nfe.service.ts configuracao-nfse.service.ts

# Renomear:
# ConfiguracaoNfe -> ConfiguracaoNfse
# configuracoes-nfe -> configuracoes-nfse
```

---

## 🖼️ 4. FRONTEND - COMPONENTES

### NFC-e

```bash
cd frontend/components/configuracoes/fiscal

# Copiar componentes
cp nfe-form.tsx nfce-form.tsx
cp nfe-form-tabs.tsx nfce-form-tabs.tsx

# Renomear (find/replace):
# NfeForm -> NfceForm
# nfe-form -> nfce-form
# ConfiguracaoNfe -> ConfiguracaoNfce
# InutilizacaoNfe -> InutilizacaoNfce
```

### CT-e

```bash
cd frontend/components/configuracoes/fiscal

cp nfe-form.tsx cte-form.tsx
cp nfe-form-tabs.tsx cte-form-tabs.tsx

# Renomear:
# NfeForm -> CteForm
# nfe-form -> cte-form
# ConfiguracaoNfe -> ConfiguracaoCte
# InutilizacaoNfe -> InutilizacaoCte
```

### MDF-e

```bash
cd frontend/components/configuracoes/fiscal

cp nfe-form.tsx mdfe-form.tsx
cp nfe-form-tabs.tsx mdfe-form-tabs.tsx

# Renomear:
# NfeForm -> MdfeForm
# nfe-form -> mdfe-form
# ConfiguracaoNfe -> ConfiguracaoMdfe
# InutilizacaoNfe -> InutilizacaoMdfe
```

### NFS-e (sem inutilização)

```bash
cd frontend/components/configuracoes/fiscal

cp nfe-form.tsx nfse-form.tsx
cp nfe-form-tabs.tsx nfse-form-tabs.tsx

# Renomear:
# NfeForm -> NfseForm
# nfe-form -> nfse-form
# ConfiguracaoNfe -> ConfiguracaoNfse
# Remover imports e código de InutilizacaoNfe
```

---

## 📄 5. ATUALIZAR PAGES

### NFC-e

```typescript
// frontend/app/configuracoes/fiscal/nfce/page.tsx
import { NfceForm } from "@/components/configuracoes/fiscal/nfce-form"

export default function NfcePage() {
  return <NfceForm />
}
```

### CT-e

```typescript
// frontend/app/configuracoes/fiscal/cte/page.tsx
import { CteForm } from "@/components/configuracoes/fiscal/cte-form"

export default function CtePage() {
  return <CteForm />
}
```

### MDF-e (criar diretório)

```bash
mkdir -p frontend/app/configuracoes/fiscal/mdfe
```

```typescript
// frontend/app/configuracoes/fiscal/mdfe/page.tsx
import { MdfeForm } from "@/components/configuracoes/fiscal/mdfe-form"

export default function MdfePage() {
  return <MdfeForm />
}
```

### NFS-e

```typescript
// frontend/app/configuracoes/fiscal/nfse/page.tsx
import { NfseForm } from "@/components/configuracoes/fiscal/nfse-form"

export default function NfsePage() {
  return <NfseForm />
}
```

---

## ✅ 6. CHECKLIST DE RENOMEAÇÃO

Para cada documento (NFC-e, CT-e, MDF-e, NFS-e), certifique-se de renomear:

### Backend
- [ ] Nome do módulo (pasta)
- [ ] Nome dos arquivos (.controller.ts, .service.ts, .module.ts)
- [ ] Nome das classes (Controller, Service, Module)
- [ ] Nome dos DTOs
- [ ] Endpoints (URLs)
- [ ] Imports

### Frontend
- [ ] Nome dos arquivos (.tsx, .service.ts)
- [ ] Nome dos componentes
- [ ] Nome das interfaces TypeScript
- [ ] URLs de API
- [ ] Imports

---

## 🧪 7. TESTAR

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev

# Acessar:
# http://localhost:3002/configuracoes/fiscal/nfce
# http://localhost:3002/configuracoes/fiscal/cte
# http://localhost:3002/configuracoes/fiscal/mdfe
# http://localhost:3002/configuracoes/fiscal/nfse
```

---

## 📝 NOTAS IMPORTANTES

1. **Find/Replace Global**: Use o editor de código para fazer find/replace em todos os arquivos de uma vez
2. **Campos Específicos**: Adicione campos específicos de cada documento após copiar
3. **Validações**: Ajuste validações conforme necessário para cada tipo de documento
4. **Testes**: Teste cada módulo individualmente antes de passar para o próximo

---

Ver IMPLEMENTATION_PLAN.md para detalhes sobre campos específicos de cada documento.

