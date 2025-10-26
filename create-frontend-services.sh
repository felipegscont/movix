#!/bin/bash

# Script para criar services frontend automaticamente
# Uso: ./create-frontend-services.sh

set -e

echo "🚀 Criando services frontend..."

cd frontend/lib/services

# Função para criar services
create_services() {
    local DOC_TYPE=$1  # nfce, cte, mdfe, nfse
    local DOC_NAME=$2  # Nfce, Cte, Mdfe, Nfse
    local DOC_FULL=$3  # NFC-e, CT-e, MDF-e, NFS-e
    local HAS_INUT=$4  # true/false
    
    echo ""
    echo "📦 Criando services para $DOC_FULL..."
    
    # Copiar service de configuração
    echo "  ✏️  Criando configuracao-$DOC_TYPE.service.ts..."
    cp configuracao-nfe.service.ts configuracao-$DOC_TYPE.service.ts
    
    # Renomear conteúdo - Configuração
    sed -i "s/ConfiguracaoNfe/Configuracao$DOC_NAME/g" configuracao-$DOC_TYPE.service.ts
    sed -i "s/configuracoes-nfe/configuracoes-$DOC_TYPE/g" configuracao-$DOC_TYPE.service.ts
    sed -i "s/configuração de NFe/configuração de $DOC_FULL/g" configuracao-$DOC_TYPE.service.ts
    sed -i "s/modeloNfe/modelo$DOC_NAME/g" configuracao-$DOC_TYPE.service.ts
    
    # Copiar service de inutilização (se aplicável)
    if [ "$HAS_INUT" = "true" ]; then
        echo "  ✏️  Criando inutilizacao-$DOC_TYPE.service.ts..."
        cp inutilizacao-nfe.service.ts inutilizacao-$DOC_TYPE.service.ts
        
        # Renomear conteúdo - Inutilização
        sed -i "s/InutilizacaoNfe/Inutilizacao$DOC_NAME/g" inutilizacao-$DOC_TYPE.service.ts
        sed -i "s/inutilizacoes-nfe/inutilizacoes-$DOC_TYPE/g" inutilizacao-$DOC_TYPE.service.ts
        sed -i "s/inutilização de NFe/inutilização de $DOC_FULL/g" inutilizacao-$DOC_TYPE.service.ts
    fi
    
    echo "  ✅ Services $DOC_FULL criados!"
}

# Criar services
create_services "nfce" "Nfce" "NFC-e" "true"
create_services "cte" "Cte" "CT-e" "true"
create_services "mdfe" "Mdfe" "MDF-e" "true"
create_services "nfse" "Nfse" "NFS-e" "false"

cd ../../..

echo ""
echo "✅ Todos os services criados com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Ajustar interfaces TypeScript com campos específicos"
echo "  2. Criar componentes de formulário"
echo "  3. Criar pages"

