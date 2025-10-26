#!/bin/bash

# Script para criar módulos fiscais automaticamente
# Uso: ./create-fiscal-modules.sh

set -e

echo "🚀 Criando módulos fiscais..."

# Função para criar módulo
create_module() {
    local DOC_TYPE=$1  # cte, mdfe, nfse
    local DOC_NAME=$2  # Cte, Mdfe, Nfse
    local DOC_FULL=$3  # CT-e, MDF-e, NFS-e
    
    echo ""
    echo "📦 Criando módulos para $DOC_FULL..."
    
    # Copiar módulos
    cd backend/src/modules
    cp -r configuracao-nfe configuracao-$DOC_TYPE
    
    # Só copiar inutilização se não for NFS-e
    if [ "$DOC_TYPE" != "nfse" ]; then
        cp -r inutilizacao-nfe inutilizacao-$DOC_TYPE
    fi
    
    # Renomear conteúdo - Configuração
    echo "  ✏️  Renomeando configuracao-$DOC_TYPE..."
    cd configuracao-$DOC_TYPE
    find . -type f -name "*.ts" -exec sed -i "s/configuracao-nfe/configuracao-$DOC_TYPE/g" {} +
    find . -type f -name "*.ts" -exec sed -i "s/ConfiguracaoNfe/Configuracao$DOC_NAME/g" {} +
    find . -type f -name "*.ts" -exec sed -i "s/configuracoes-nfe/configuracoes-$DOC_TYPE/g" {} +
    find . -type f -name "*.ts" -exec sed -i "s/modeloNfe/modelo$DOC_NAME/g" {} +
    
    # Renomear arquivos - Configuração
    mv configuracao-nfe.controller.ts configuracao-$DOC_TYPE.controller.ts
    mv configuracao-nfe.service.ts configuracao-$DOC_TYPE.service.ts
    mv configuracao-nfe.module.ts configuracao-$DOC_TYPE.module.ts
    cd dto
    mv create-configuracao-nfe.dto.ts create-configuracao-$DOC_TYPE.dto.ts
    mv update-configuracao-nfe.dto.ts update-configuracao-$DOC_TYPE.dto.ts
    cd ../..
    
    # Renomear conteúdo - Inutilização (se não for NFS-e)
    if [ "$DOC_TYPE" != "nfse" ]; then
        echo "  ✏️  Renomeando inutilizacao-$DOC_TYPE..."
        cd inutilizacao-$DOC_TYPE
        find . -type f -name "*.ts" -exec sed -i "s/inutilizacao-nfe/inutilizacao-$DOC_TYPE/g" {} +
        find . -type f -name "*.ts" -exec sed -i "s/InutilizacaoNfe/Inutilizacao$DOC_NAME/g" {} +
        find . -type f -name "*.ts" -exec sed -i "s/inutilizacoes-nfe/inutilizacoes-$DOC_TYPE/g" {} +
        
        # Renomear arquivos - Inutilização
        mv inutilizacao-nfe.controller.ts inutilizacao-$DOC_TYPE.controller.ts
        mv inutilizacao-nfe.service.ts inutilizacao-$DOC_TYPE.service.ts
        mv inutilizacao-nfe.module.ts inutilizacao-$DOC_TYPE.module.ts
        cd dto
        mv create-inutilizacao-nfe.dto.ts create-inutilizacao-$DOC_TYPE.dto.ts
        mv update-inutilizacao-nfe.dto.ts update-inutilizacao-$DOC_TYPE.dto.ts
        cd ../..
    fi
    
    cd ../../..
    
    echo "  ✅ Módulos $DOC_FULL criados!"
}

# Criar módulos
create_module "cte" "Cte" "CT-e"
create_module "mdfe" "Mdfe" "MDF-e"
create_module "nfse" "Nfse" "NFS-e"

echo ""
echo "✅ Todos os módulos criados com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Adicionar campos específicos nos DTOs"
echo "  2. Registrar módulos no app.module.ts"
echo "  3. Testar endpoints"

