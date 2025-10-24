/*
  Warnings:

  - You are about to drop the column `cfops` on the `naturezas_operacao` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `naturezas_operacao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "naturezas_operacao" DROP COLUMN "cfops",
DROP COLUMN "descricao",
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "natureza_operacao_cfops" (
    "id" TEXT NOT NULL,
    "naturezaOperacaoId" TEXT NOT NULL,
    "cfopId" TEXT NOT NULL,
    "padrao" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "natureza_operacao_cfops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "natureza_operacao_cfops_naturezaOperacaoId_cfopId_key" ON "natureza_operacao_cfops"("naturezaOperacaoId", "cfopId");

-- AddForeignKey
ALTER TABLE "natureza_operacao_cfops" ADD CONSTRAINT "natureza_operacao_cfops_naturezaOperacaoId_fkey" FOREIGN KEY ("naturezaOperacaoId") REFERENCES "naturezas_operacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "natureza_operacao_cfops" ADD CONSTRAINT "natureza_operacao_cfops_cfopId_fkey" FOREIGN KEY ("cfopId") REFERENCES "cfop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
