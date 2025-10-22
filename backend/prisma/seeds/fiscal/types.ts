export interface CFOP {
  codigo: string;
  descricao: string;
  aplicacao?: string;
  tipo: 'ENTRADA' | 'SAIDA';
}

export interface CST {
  codigo: string;
  descricao: string;
  tipo: 'ICMS' | 'PIS' | 'COFINS' | 'IPI';
}

export interface CSOSN {
  codigo: string;
  descricao: string;
}

export interface FiscalData {
  cfops: CFOP[];
  csts: CST[];
  csosns: CSOSN[];
}

