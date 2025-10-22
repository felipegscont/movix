-- AlterTable
ALTER TABLE "clientes" ADD COLUMN "inscricaoSuframa" VARCHAR(15);

-- CreateTable
CREATE TABLE "certificados_digitais" (
    "id" TEXT NOT NULL,
    "emitenteId" TEXT NOT NULL,
    "arquivoPath" VARCHAR(500) NOT NULL,
    "arquivoNome" VARCHAR(255) NOT NULL,
    "arquivoTamanho" INTEGER NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "cnpjCertificado" VARCHAR(14),
    "razaoSocialCertificado" VARCHAR(200),
    "titular" VARCHAR(200),
    "emissor" VARCHAR(200),
    "numeroSerie" VARCHAR(100),
    "validoDe" TIMESTAMP(3) NOT NULL,
    "validoAte" TIMESTAMP(3) NOT NULL,
    "diasParaVencimento" INTEGER NOT NULL,
    "expirado" BOOLEAN NOT NULL DEFAULT false,
    "proximoVencimento" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaValidacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificados_digitais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "certificados_digitais_emitenteId_idx" ON "certificados_digitais"("emitenteId");

-- CreateIndex
CREATE INDEX "certificados_digitais_validoAte_idx" ON "certificados_digitais"("validoAte");

-- AddForeignKey
ALTER TABLE "certificados_digitais" ADD CONSTRAINT "certificados_digitais_emitenteId_fkey" FOREIGN KEY ("emitenteId") REFERENCES "emitentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

