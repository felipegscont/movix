/*
  Warnings:

  - You are about to drop the column `ambienteNfe` on the `emitentes` table. All the data in the column will be lost.
  - You are about to drop the column `proximoNumeroNfe` on the `emitentes` table. All the data in the column will be lost.
  - You are about to drop the column `serieNfe` on the `emitentes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "emitentes" DROP COLUMN "ambienteNfe",
DROP COLUMN "proximoNumeroNfe",
DROP COLUMN "serieNfe",
ADD COLUMN     "enviarNotasPorEmail" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "configuracoes_nfe" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "ambienteAtivo" INTEGER NOT NULL DEFAULT 2,
    "serieProducao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroProducao" INTEGER NOT NULL DEFAULT 1,
    "tipoFreteProducao" INTEGER DEFAULT 1,
    "indicadorPresencaProducao" INTEGER DEFAULT 2,
    "orientacaoImpressaoProducao" INTEGER DEFAULT 1,
    "ieSubstitutoProducao" VARCHAR(20),
    "observacoesProducao" TEXT,
    "documentosAutorizadosProducao" TEXT,
    "serieHomologacao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroHomologacao" INTEGER NOT NULL DEFAULT 1,
    "tipoFreteHomologacao" INTEGER DEFAULT 1,
    "indicadorPresencaHomologacao" INTEGER DEFAULT 2,
    "orientacaoImpressaoHomologacao" INTEGER DEFAULT 1,
    "ieSubstitutoHomologacao" VARCHAR(20),
    "observacoesHomologacao" TEXT,
    "documentosAutorizadosHomologacao" TEXT,
    "modeloNfe" VARCHAR(10) NOT NULL DEFAULT '4.00',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inutilizacoes_nfe" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "numeroInicialInutilizarProducao" INTEGER,
    "numeroFinalInutilizarProducao" INTEGER,
    "serieInutilizarProducao" INTEGER,
    "anoInutilizarProducao" INTEGER,
    "justificativaInutilizarProducao" TEXT,
    "numeroInicialInutilizarHomologacao" INTEGER,
    "numeroFinalInutilizarHomologacao" INTEGER,
    "serieInutilizarHomologacao" INTEGER,
    "anoInutilizarHomologacao" INTEGER,
    "justificativaInutilizarHomologacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inutilizacoes_nfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_nfce" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "ambienteAtivo" INTEGER NOT NULL DEFAULT 2,
    "serieProducao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroProducao" INTEGER NOT NULL DEFAULT 1,
    "cscProducao" VARCHAR(100),
    "cscIdProducao" INTEGER DEFAULT 1,
    "formatoImpressaoProducao" VARCHAR(10),
    "observacoesProducao" TEXT,
    "serieHomologacao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroHomologacao" INTEGER NOT NULL DEFAULT 1,
    "cscHomologacao" VARCHAR(100),
    "cscIdHomologacao" INTEGER DEFAULT 1,
    "formatoImpressaoHomologacao" VARCHAR(10),
    "observacoesHomologacao" TEXT,
    "modeloNfce" VARCHAR(10) NOT NULL DEFAULT '4.00',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inutilizacoes_nfce" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "numeroInicialInutilizarProducao" INTEGER,
    "numeroFinalInutilizarProducao" INTEGER,
    "serieInutilizarProducao" INTEGER,
    "anoInutilizarProducao" INTEGER,
    "justificativaInutilizarProducao" TEXT,
    "numeroInicialInutilizarHomologacao" INTEGER,
    "numeroFinalInutilizarHomologacao" INTEGER,
    "serieInutilizarHomologacao" INTEGER,
    "anoInutilizarHomologacao" INTEGER,
    "justificativaInutilizarHomologacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inutilizacoes_nfce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_cte" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "ambienteAtivo" INTEGER NOT NULL DEFAULT 2,
    "serieProducao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroProducao" INTEGER NOT NULL DEFAULT 1,
    "tipoServicoProducao" INTEGER DEFAULT 0,
    "modalTransporteProducao" INTEGER DEFAULT 1,
    "orientacaoImpressaoProducao" INTEGER DEFAULT 1,
    "ieSubstitutoProducao" VARCHAR(20),
    "observacoesProducao" TEXT,
    "serieHomologacao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroHomologacao" INTEGER NOT NULL DEFAULT 1,
    "tipoServicoHomologacao" INTEGER DEFAULT 0,
    "modalTransporteHomologacao" INTEGER DEFAULT 1,
    "orientacaoImpressaoHomologacao" INTEGER DEFAULT 1,
    "ieSubstitutoHomologacao" VARCHAR(20),
    "observacoesHomologacao" TEXT,
    "modeloCte" VARCHAR(10) NOT NULL DEFAULT '4.00',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_cte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inutilizacoes_cte" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "numeroInicialInutilizarProducao" INTEGER,
    "numeroFinalInutilizarProducao" INTEGER,
    "serieInutilizarProducao" INTEGER,
    "anoInutilizarProducao" INTEGER,
    "justificativaInutilizarProducao" TEXT,
    "numeroInicialInutilizarHomologacao" INTEGER,
    "numeroFinalInutilizarHomologacao" INTEGER,
    "serieInutilizarHomologacao" INTEGER,
    "anoInutilizarHomologacao" INTEGER,
    "justificativaInutilizarHomologacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inutilizacoes_cte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_mdfe" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "ambienteAtivo" INTEGER NOT NULL DEFAULT 2,
    "serieProducao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroProducao" INTEGER NOT NULL DEFAULT 1,
    "tipoEmitenteProducao" INTEGER DEFAULT 1,
    "tipoTransportadorProducao" INTEGER DEFAULT 1,
    "observacoesProducao" TEXT,
    "serieHomologacao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroHomologacao" INTEGER NOT NULL DEFAULT 1,
    "tipoEmitenteHomologacao" INTEGER DEFAULT 1,
    "tipoTransportadorHomologacao" INTEGER DEFAULT 1,
    "observacoesHomologacao" TEXT,
    "modeloMdfe" VARCHAR(10) NOT NULL DEFAULT '3.00',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_mdfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inutilizacoes_mdfe" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "numeroInicialInutilizarProducao" INTEGER,
    "numeroFinalInutilizarProducao" INTEGER,
    "serieInutilizarProducao" INTEGER,
    "anoInutilizarProducao" INTEGER,
    "justificativaInutilizarProducao" TEXT,
    "numeroInicialInutilizarHomologacao" INTEGER,
    "numeroFinalInutilizarHomologacao" INTEGER,
    "serieInutilizarHomologacao" INTEGER,
    "anoInutilizarHomologacao" INTEGER,
    "justificativaInutilizarHomologacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inutilizacoes_mdfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_nfse" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "ambienteAtivo" INTEGER NOT NULL DEFAULT 2,
    "serieProducao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroProducao" INTEGER NOT NULL DEFAULT 1,
    "codigoMunicipioProducao" VARCHAR(7),
    "codigoServicoProducao" VARCHAR(20),
    "aliquotaIssProducao" DECIMAL(5,2),
    "itemListaServicoProducao" VARCHAR(10),
    "regimeTributacaoProducao" INTEGER DEFAULT 1,
    "incentivoFiscalProducao" BOOLEAN NOT NULL DEFAULT false,
    "observacoesProducao" TEXT,
    "serieHomologacao" INTEGER NOT NULL DEFAULT 1,
    "proximoNumeroHomologacao" INTEGER NOT NULL DEFAULT 1,
    "codigoMunicipioHomologacao" VARCHAR(7),
    "codigoServicoHomologacao" VARCHAR(20),
    "aliquotaIssHomologacao" DECIMAL(5,2),
    "itemListaServicoHomologacao" VARCHAR(10),
    "regimeTributacaoHomologacao" INTEGER DEFAULT 1,
    "incentivoFiscalHomologacao" BOOLEAN NOT NULL DEFAULT false,
    "observacoesHomologacao" TEXT,
    "modeloNfse" VARCHAR(10) NOT NULL DEFAULT '1.00',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_nfse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfe_emitenteId_key" ON "configuracoes_nfe"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "inutilizacoes_nfe_emitenteId_key" ON "inutilizacoes_nfe"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfce_emitenteId_key" ON "configuracoes_nfce"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "inutilizacoes_nfce_emitenteId_key" ON "inutilizacoes_nfce"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_cte_emitenteId_key" ON "configuracoes_cte"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "inutilizacoes_cte_emitenteId_key" ON "inutilizacoes_cte"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_mdfe_emitenteId_key" ON "configuracoes_mdfe"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "inutilizacoes_mdfe_emitenteId_key" ON "inutilizacoes_mdfe"("emitenteId");

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_nfse_emitenteId_key" ON "configuracoes_nfse"("emitenteId");

-- AddForeignKey
ALTER TABLE "configuracoes_nfe" ADD CONSTRAINT "configuracoes_nfe_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inutilizacoes_nfe" ADD CONSTRAINT "inutilizacoes_nfe_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nfce" ADD CONSTRAINT "configuracoes_nfce_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inutilizacoes_nfce" ADD CONSTRAINT "inutilizacoes_nfce_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_cte" ADD CONSTRAINT "configuracoes_cte_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inutilizacoes_cte" ADD CONSTRAINT "inutilizacoes_cte_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_mdfe" ADD CONSTRAINT "configuracoes_mdfe_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inutilizacoes_mdfe" ADD CONSTRAINT "inutilizacoes_mdfe_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracoes_nfse" ADD CONSTRAINT "configuracoes_nfse_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
