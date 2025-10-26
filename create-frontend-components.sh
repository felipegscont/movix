#!/bin/bash

# Script para criar componentes frontend automaticamente
# Uso: ./create-frontend-components.sh

set -e

echo "🚀 Criando componentes frontend..."

cd frontend/components/configuracoes/fiscal

# Função para criar componentes
create_components() {
    local DOC_TYPE=$1  # nfce, cte, mdfe, nfse
    local DOC_NAME=$2  # Nfce, Cte, Mdfe, Nfse
    local DOC_FULL=$3  # NFC-e, CT-e, MDF-e, NFS-e
    local HAS_INUT=$4  # true/false
    
    echo ""
    echo "📦 Criando componentes para $DOC_FULL..."
    
    # Copiar componente principal
    echo "  ✏️  Criando $DOC_TYPE-form.tsx..."
    cp nfe-form.tsx $DOC_TYPE-form.tsx
    
    # Renomear conteúdo - Form principal
    sed -i "s/nfe-form/$DOC_TYPE-form/g" $DOC_TYPE-form.tsx
    sed -i "s/NfeForm/${DOC_NAME}Form/g" $DOC_TYPE-form.tsx
    sed -i "s/ConfiguracaoNfe/Configuracao$DOC_NAME/g" $DOC_TYPE-form.tsx
    sed -i "s/InutilizacaoNfe/Inutilizacao$DOC_NAME/g" $DOC_TYPE-form.tsx
    sed -i "s/configuracao-nfe/configuracao-$DOC_TYPE/g" $DOC_TYPE-form.tsx
    sed -i "s/inutilizacao-nfe/inutilizacao-$DOC_TYPE/g" $DOC_TYPE-form.tsx
    sed -i "s/modeloNfe/modelo$DOC_NAME/g" $DOC_TYPE-form.tsx
    
    # Copiar componente de tabs
    echo "  ✏️  Criando $DOC_TYPE-form-tabs.tsx..."
    cp nfe-form-tabs.tsx $DOC_TYPE-form-tabs.tsx
    
    # Renomear conteúdo - Form tabs
    sed -i "s/NfeConfigFields/${DOC_NAME}ConfigFields/g" $DOC_TYPE-form-tabs.tsx
    sed -i "s/NfeInutilizacaoFields/${DOC_NAME}InutilizacaoFields/g" $DOC_TYPE-form-tabs.tsx
    
    # Se não tiver inutilização, remover código relacionado
    if [ "$HAS_INUT" = "false" ]; then
        echo "  ⚠️  Removendo código de inutilização de $DOC_TYPE-form.tsx..."
        # Aqui você precisaria fazer edições mais complexas
        # Por enquanto, vamos deixar e fazer manualmente depois
    fi
    
    echo "  ✅ Componentes $DOC_FULL criados!"
}

# Criar componentes
create_components "nfce" "Nfce" "NFC-e" "true"
create_components "cte" "Cte" "CT-e" "true"
create_components "mdfe" "Mdfe" "MDF-e" "true"
create_components "nfse" "Nfse" "NFS-e" "false"

cd ../../../..

echo ""
echo "✅ Todos os componentes criados com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Ajustar campos específicos nos formulários"
echo "  2. Atualizar/criar pages"
echo "  3. Testar cada formulário"

