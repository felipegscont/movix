import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { CFOP } from './types';

const CFOP_SOURCE = 'https://gist.githubusercontent.com/reinaldoacdc/b9ad02386c7fdb7a5c066769d224ac67/raw';
const DATA_DIR = path.join(__dirname, '../data');
const CFOP_FILE = path.join(DATA_DIR, 'cfop.json');

interface CFOPResponse {
  list: Array<{
    codigo: string;
    descricao: string;
  }>;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function determineTipo(codigo: string): 'ENTRADA' | 'SAIDA' {
  const first = codigo.charAt(0);
  return ['1', '2', '3'].includes(first) ? 'ENTRADA' : 'SAIDA';
}

export async function loadCFOPs(): Promise<CFOP[]> {
  ensureDataDir();

  if (fs.existsSync(CFOP_FILE)) {
    const data: CFOPResponse = JSON.parse(fs.readFileSync(CFOP_FILE, 'utf-8'));
    return data.list.map(item => ({
      codigo: item.codigo,
      descricao: item.descricao,
      tipo: determineTipo(item.codigo),
    }));
  }

  try {
    const response = await axios.get<CFOPResponse>(CFOP_SOURCE, { timeout: 30000 });
    fs.writeFileSync(CFOP_FILE, JSON.stringify(response.data, null, 2));
    
    return response.data.list.map(item => ({
      codigo: item.codigo,
      descricao: item.descricao,
      tipo: determineTipo(item.codigo),
    }));
  } catch (error) {
    throw new Error(`Falha ao carregar CFOPs: ${error}`);
  }
}

