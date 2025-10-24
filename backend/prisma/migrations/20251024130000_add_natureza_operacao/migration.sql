-- CreateTable
CREATE TABLE "naturezas_operacao" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "cfopDentroEstadoId" TEXT,
    "cfopForaEstadoId" TEXT,
    "cfopExteriorId" TEXT,
    "sobrescreverCfopProduto" BOOLEAN NOT NULL DEFAULT false,
    "tipoOperacao" INTEGER NOT NULL DEFAULT 1,
    "finalidade" INTEGER NOT NULL DEFAULT 1,
    "consumidorFinal" INTEGER NOT NULL DEFAULT 1,
    "presencaComprador" INTEGER NOT NULL DEFAULT 1,
    "informacoesAdicionaisPadrao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naturezas_operacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "naturezas_operacao_codigo_key" ON "naturezas_operacao"("codigo");

-- AddForeignKey
ALTER TABLE "naturezas_operacao" ADD CONSTRAINT "naturezas_operacao_cfopDentroEstadoId_fkey" FOREIGN KEY ("cfopDentroEstadoId") REFERENCES "cfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naturezas_operacao" ADD CONSTRAINT "naturezas_operacao_cfopForaEstadoId_fkey" FOREIGN KEY ("cfopForaEstadoId") REFERENCES "cfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naturezas_operacao" ADD CONSTRAINT "naturezas_operacao_cfopExteriorId_fkey" FOREIGN KEY ("cfopExteriorId") REFERENCES "cfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

