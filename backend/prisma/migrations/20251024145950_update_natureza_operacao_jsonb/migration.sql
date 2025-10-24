/*
  Warnings:

  - You are about to drop the column `ativo` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `cfopDentroEstadoId` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `cfopExteriorId` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `cfopForaEstadoId` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `consumidorFinal` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `finalidade` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `informacoesAdicionaisPadrao` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `presencaComprador` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `sobrescreverCfopProduto` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `tipoOperacao` on the `naturezas_operacao` table. All the data in the column will be lost.
  - Added the required column `nome` to the `naturezas_operacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."naturezas_operacao" DROP CONSTRAINT "naturezas_operacao_cfopDentroEstadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."naturezas_operacao" DROP CONSTRAINT "naturezas_operacao_cfopExteriorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."naturezas_operacao" DROP CONSTRAINT "naturezas_operacao_cfopForaEstadoId_fkey";

-- Adicionar novas colunas primeiro
ALTER TABLE "naturezas_operacao"
ADD COLUMN     "nome" VARCHAR(100),
ADD COLUMN     "ativa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cfops" JSONB,
ADD COLUMN     "dentro_estado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "informacoes_adicionais" TEXT,
ADD COLUMN     "produtosExcecao" JSONB,
ADD COLUMN     "propria" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo" INTEGER NOT NULL DEFAULT 1;

-- Migrar dados existentes
UPDATE "naturezas_operacao" SET
  "nome" = "descricao",
  "ativa" = "ativo",
  "tipo" = "tipoOperacao",
  "informacoes_adicionais" = "informacoesAdicionaisPadrao"
WHERE "nome" IS NULL;

-- Tornar nome obrigatório após migração
ALTER TABLE "naturezas_operacao" ALTER COLUMN "nome" SET NOT NULL;

-- Remover colunas antigas
ALTER TABLE "naturezas_operacao"
DROP COLUMN "ativo",
DROP COLUMN "cfopDentroEstadoId",
DROP COLUMN "cfopExteriorId",
DROP COLUMN "cfopForaEstadoId",
DROP COLUMN "consumidorFinal",
DROP COLUMN "finalidade",
DROP COLUMN "informacoesAdicionaisPadrao",
DROP COLUMN "presencaComprador",
DROP COLUMN "sobrescreverCfopProduto",
DROP COLUMN "tipoOperacao";

-- Ajustar outras colunas
ALTER TABLE "naturezas_operacao"
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
