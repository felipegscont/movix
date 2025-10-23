/**
 * Loader automático de NCM da API oficial do Siscomex
 * Fonte: Portal Único Siscomex - Receita Federal do Brasil
 * URL: https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json
 */

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { NCMData } from './ncm-data';

const NCM_API_URL = 'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json?perfil=PUBLICO';
const NCM_CACHE_FILE = path.join(__dirname, '../data/ncm.json');

/**
 * Remove tags HTML/XML e normaliza a descrição do NCM
 */
function cleanDescription(descricao: string): string {
  if (!descricao) return '';

  return descricao
    // Remover tags HTML/XML como <i>, </i>, <b>, etc
    .replace(/<[^>]+>/g, '')
    // Remover múltiplos espaços
    .replace(/\s+/g, ' ')
    // Remover espaços no início e fim
    .trim();
}

interface NCMApiResponse {
  Nomenclaturas: Array<{
    Codigo: string;
    Descricao: string;
    Data_Inicio: string;
    Data_Fim: string;
    Tipo_Ato_Ini: string;
    Numero_Ato_Ini: string;
    Ano_Ato_Ini: string;
  }>;
}

/**
 * Baixa NCMs da API oficial do Siscomex
 */
async function downloadNCMs(): Promise<NCMData[]> {
  console.log('   📥 Baixando NCMs da API Siscomex...');

  try {
    const response = await axios.get<NCMApiResponse>(NCM_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 60000, // 60 segundos
      maxRedirects: 5,
    });

    const apiData = response.data;

    if (!apiData.Nomenclaturas || !Array.isArray(apiData.Nomenclaturas)) {
      throw new Error('Formato de resposta inválido da API');
    }

    // Filtrar apenas NCMs vigentes
    // Data_Fim vem no formato "DD/MM/YYYY" ou "31/12/9999" para vigentes
    const hoje = new Date();
    const ncmsVigentes = apiData.Nomenclaturas
      .filter(ncm => {
        if (!ncm.Data_Fim) return true;

        // Converter data brasileira DD/MM/YYYY para Date
        const [dia, mes, ano] = ncm.Data_Fim.split('/').map(Number);

        // Se ano é 9999, considerar como vigente indefinidamente
        if (ano === 9999) return true;

        const dataFim = new Date(ano, mes - 1, dia);
        return dataFim > hoje;
      })
      .map(ncm => ({
        codigo: ncm.Codigo.replace(/[\.\s]/g, ''),
        descricao: cleanDescription(ncm.Descricao),
        unidade: undefined, // API não fornece unidade
      }));

    console.log(`   ✓ ${ncmsVigentes.length} NCMs baixados da API`);

    // Salvar cache
    const dataDir = path.dirname(NCM_CACHE_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(NCM_CACHE_FILE, JSON.stringify(ncmsVigentes, null, 2));
    console.log(`   ✓ Cache salvo em ${NCM_CACHE_FILE}`);

    return ncmsVigentes;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`API retornou erro ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Sem resposta da API. Verifique sua conexão com a internet.');
    } else {
      throw new Error(`Erro ao processar resposta da API: ${error.message}`);
    }
  }
}

/**
 * Carrega NCMs do cache local
 */
function loadFromCache(): NCMData[] | null {
  if (!fs.existsSync(NCM_CACHE_FILE)) {
    return null;
  }

  try {
    const data = fs.readFileSync(NCM_CACHE_FILE, 'utf-8');
    const jsonData = JSON.parse(data);

    // Verificar se é o formato da API Siscomex {Nomenclaturas: [...]}
    let ncmsRaw: any[];
    if (jsonData.Nomenclaturas && Array.isArray(jsonData.Nomenclaturas)) {
      ncmsRaw = jsonData.Nomenclaturas;
    } else if (Array.isArray(jsonData)) {
      ncmsRaw = jsonData;
    } else {
      console.warn(`   ⚠️  Formato de cache inválido`);
      return null;
    }

    // Converter para o formato esperado e filtrar vigentes
    // NCM tem 8 dígitos: 6 do SH + 2 do Mercosul
    const hoje = new Date();
    const ncms: NCMData[] = ncmsRaw
      .filter(ncm => {
        // Remover pontos e espaços
        const codigoLimpo = ncm.Codigo.replace(/[\.\s]/g, '');

        // Apenas NCMs com exatamente 8 dígitos (formato completo para NFe)
        if (codigoLimpo.length !== 8) return false;

        // Apenas dígitos numéricos
        if (!/^\d{8}$/.test(codigoLimpo)) return false;

        // Filtrar vigentes
        if (!ncm.Data_Fim) return true;

        // Converter data brasileira DD/MM/YYYY para Date
        const parts = ncm.Data_Fim.split('/');
        if (parts.length !== 3) return true;

        const [dia, mes, ano] = parts.map(Number);

        // Se ano é 9999, considerar como vigente indefinidamente
        if (ano === 9999) return true;

        const dataFim = new Date(ano, mes - 1, dia);
        return dataFim > hoje;
      })
      .map(ncm => ({
        codigo: ncm.Codigo.replace(/[\.\s]/g, ''),
        descricao: cleanDescription(ncm.Descricao),
        unidade: undefined,
      }));

    console.log(`   ✓ ${ncms.length} NCMs vigentes carregados do cache`);
    return ncms;
  } catch (error: any) {
    console.warn(`   ⚠️  Erro ao ler cache: ${error.message}`);
    return null;
  }
}

/**
 * Carrega NCMs da tabela oficial do Siscomex
 * Estratégia:
 * 1. Carrega do cache local (arquivo ncm.json já incluído no projeto)
 * 2. Se não existir, lança erro (cache é obrigatório)
 *
 * NOTA: O arquivo ncm.json contém ~10.500 NCMs de 8 dígitos da tabela oficial
 * do Siscomex/Receita Federal, já incluído no repositório.
 */
export async function loadNCMs(): Promise<NCMData[]> {
  // Carregar do cache (obrigatório)
  const cached = loadFromCache();

  if (!cached || cached.length === 0) {
    throw new Error(
      'Arquivo ncm.json não encontrado ou vazio. ' +
      'O arquivo deve estar em: backend/prisma/seeds/data/ncm.json'
    );
  }

  console.log(`   ✓ ${cached.length} NCMs carregados da tabela oficial Siscomex`);
  return cached;
}

/**
 * Força atualização do cache baixando da API
 */
export async function updateNCMCache(): Promise<void> {
  console.log('🔄 Atualizando cache de NCMs...');
  
  try {
    await downloadNCMs();
    console.log('✅ Cache de NCMs atualizado com sucesso');
  } catch (error) {
    console.error(`❌ Erro ao atualizar cache: ${error.message}`);
    throw error;
  }
}

