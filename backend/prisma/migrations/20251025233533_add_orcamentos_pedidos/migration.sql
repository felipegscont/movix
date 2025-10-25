/*
  Warnings:

  - You are about to drop the column `cfopId` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `cofinsAliquota` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `cofinsCstId` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `icmsAliquota` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `icmsCsosnId` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `icmsCstId` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `icmsReducao` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `ipiAliquota` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `ipiCstId` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `pisAliquota` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `pisCstId` on the `produtos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_cfopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_cofinsCstId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_icmsCsosnId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_icmsCstId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_ipiCstId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_pisCstId_fkey";

-- AlterTable
ALTER TABLE "nfe_itens" ADD COLUMN     "matrizFiscalId" TEXT;

-- AlterTable
ALTER TABLE "nfes" ADD COLUMN     "naturezaOperacaoId" TEXT,
ADD COLUMN     "pedidoId" TEXT;

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "cfopId",
DROP COLUMN "cofinsAliquota",
DROP COLUMN "cofinsCstId",
DROP COLUMN "icmsAliquota",
DROP COLUMN "icmsCsosnId",
DROP COLUMN "icmsCstId",
DROP COLUMN "icmsReducao",
DROP COLUMN "ipiAliquota",
DROP COLUMN "ipiCstId",
DROP COLUMN "pisAliquota",
DROP COLUMN "pisCstId";

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'EM_ABERTO',
    "clienteId" TEXT NOT NULL,
    "vendedorNome" VARCHAR(100),
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorDesconto" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorFrete" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorOutros" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "pedidoId" TEXT,
    "dataConversao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamento_itens" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(500) NOT NULL,
    "unidade" VARCHAR(10) NOT NULL,
    "quantidade" DECIMAL(15,4) NOT NULL,
    "valorUnitario" DECIMAL(15,4) NOT NULL,
    "valorDesconto" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamento_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEntrega" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    "clienteId" TEXT NOT NULL,
    "vendedorNome" VARCHAR(100),
    "enderecoEntrega" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorDesconto" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorFrete" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorOutros" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_itens" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(500) NOT NULL,
    "unidade" VARCHAR(10) NOT NULL,
    "quantidade" DECIMAL(15,4) NOT NULL,
    "valorUnitario" DECIMAL(15,4) NOT NULL,
    "valorDesconto" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_pagamentos" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "parcela" INTEGER NOT NULL,
    "formaPagamentoId" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_numero_key" ON "orcamentos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_pedidoId_key" ON "orcamentos"("pedidoId");

-- CreateIndex
CREATE INDEX "orcamentos_numero_idx" ON "orcamentos"("numero");

-- CreateIndex
CREATE INDEX "orcamentos_clienteId_idx" ON "orcamentos"("clienteId");

-- CreateIndex
CREATE INDEX "orcamentos_status_idx" ON "orcamentos"("status");

-- CreateIndex
CREATE INDEX "orcamentos_dataEmissao_idx" ON "orcamentos"("dataEmissao");

-- CreateIndex
CREATE INDEX "orcamento_itens_orcamentoId_idx" ON "orcamento_itens"("orcamentoId");

-- CreateIndex
CREATE INDEX "orcamento_itens_produtoId_idx" ON "orcamento_itens"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "orcamento_itens_orcamentoId_numeroItem_key" ON "orcamento_itens"("orcamentoId", "numeroItem");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numero_key" ON "pedidos"("numero");

-- CreateIndex
CREATE INDEX "pedidos_numero_idx" ON "pedidos"("numero");

-- CreateIndex
CREATE INDEX "pedidos_clienteId_idx" ON "pedidos"("clienteId");

-- CreateIndex
CREATE INDEX "pedidos_status_idx" ON "pedidos"("status");

-- CreateIndex
CREATE INDEX "pedidos_dataEmissao_idx" ON "pedidos"("dataEmissao");

-- CreateIndex
CREATE INDEX "pedido_itens_pedidoId_idx" ON "pedido_itens"("pedidoId");

-- CreateIndex
CREATE INDEX "pedido_itens_produtoId_idx" ON "pedido_itens"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_itens_pedidoId_numeroItem_key" ON "pedido_itens"("pedidoId", "numeroItem");

-- CreateIndex
CREATE INDEX "pedido_pagamentos_pedidoId_idx" ON "pedido_pagamentos"("pedidoId");

-- CreateIndex
CREATE INDEX "pedido_pagamentos_formaPagamentoId_idx" ON "pedido_pagamentos"("formaPagamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_pagamentos_pedidoId_parcela_key" ON "pedido_pagamentos"("pedidoId", "parcela");

-- AddForeignKey
ALTER TABLE "nfes" ADD CONSTRAINT "nfes_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfes" ADD CONSTRAINT "nfes_naturezaOperacaoId_fkey" FOREIGN KEY ("naturezaOperacaoId") REFERENCES "naturezas_operacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfe_itens" ADD CONSTRAINT "nfe_itens_matrizFiscalId_fkey" FOREIGN KEY ("matrizFiscalId") REFERENCES "matrizes_fiscais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamento_itens" ADD CONSTRAINT "orcamento_itens_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamento_itens" ADD CONSTRAINT "orcamento_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_pagamentos" ADD CONSTRAINT "pedido_pagamentos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_pagamentos" ADD CONSTRAINT "pedido_pagamentos_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "formas_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
