import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface EmitenteData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string | null;
  cnae: string;
  regimeTributario: number;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  municipio: {
    nome: string;
    estado: string;
  };
  telefone: string;
  email: string;
  site: string | null;
  certificadoPath: string | null;
  certificadoPassword: string | null;
  ambienteNfe: number;
  proximoNumeroNfe: number;
  serieNfe: number;
  ativo: boolean;
}

/**
 * Seed para criar/atualizar o emitente placeholder do sistema
 *
 * IMPORTANTE: Este seed garante que SEMPRE exista UM ÚNICO emitente no sistema.
 * O emitente é criado com dados placeholder que serão atualizados pelo usuário.
 *
 * Regras:
 * - Se não existir emitente: CRIA o placeholder
 * - Se já existir emitente: NÃO FAZ NADA (mantém os dados do usuário)
 * - NUNCA cria múltiplos emitentes
 * - NUNCA exclui o emitente
 */
export async function seedEmitentePlaceholder(prisma: PrismaClient) {
  console.log('   🏢 Emitente Placeholder...');

  // Verificar se já existe algum emitente
  const emitenteExistente = await prisma.emitente.findFirst();

  if (emitenteExistente) {
    console.log('      ℹ️  Emitente já existe, mantendo dados atuais');
    return;
  }

  // Ler dados do JSON
  const jsonPath = path.join(__dirname, 'data', 'emitente-placeholder.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const emitenteData: EmitenteData = JSON.parse(jsonData);

  // Buscar estado
  const estado = await prisma.estado.findUnique({
    where: { sigla: emitenteData.municipio.estado },
  });

  if (!estado) {
    console.log(`      ⚠️  Estado ${emitenteData.municipio.estado} não encontrado, pulando seed de emitente`);
    return;
  }

  // Buscar município
  const municipio = await prisma.municipio.findFirst({
    where: {
      nome: emitenteData.municipio.nome,
      estadoId: estado.id,
    },
  });

  if (!municipio) {
    console.log(`      ⚠️  Município ${emitenteData.municipio.nome} não encontrado, pulando seed de emitente`);
    return;
  }

  // Criar emitente placeholder
  const emitente = await prisma.emitente.create({
    data: {
      cnpj: emitenteData.cnpj,
      razaoSocial: emitenteData.razaoSocial,
      nomeFantasia: emitenteData.nomeFantasia,
      inscricaoEstadual: emitenteData.inscricaoEstadual,
      inscricaoMunicipal: emitenteData.inscricaoMunicipal,
      cnae: emitenteData.cnae,
      regimeTributario: emitenteData.regimeTributario,
      logradouro: emitenteData.logradouro,
      numero: emitenteData.numero,
      complemento: emitenteData.complemento,
      bairro: emitenteData.bairro,
      cep: emitenteData.cep,
      municipioId: municipio.id,
      estadoId: estado.id,
      telefone: emitenteData.telefone,
      email: emitenteData.email,
      site: emitenteData.site,
      certificadoPath: emitenteData.certificadoPath,
      certificadoPassword: emitenteData.certificadoPassword,
      ambienteNfe: emitenteData.ambienteNfe,
      proximoNumeroNfe: emitenteData.proximoNumeroNfe,
      serieNfe: emitenteData.serieNfe,
      ativo: emitenteData.ativo,
    },
  });

  console.log('      ✓ Emitente placeholder criado com sucesso');
  console.log(`      📋 CNPJ: ${emitente.cnpj}`);
  console.log(`      📋 Razão Social: ${emitente.razaoSocial}`);
  console.log('      ℹ️  Configure os dados reais em: Configurações > Emitente');
}

