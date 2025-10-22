import { CST, CSOSN } from './types';

export const CST_ICMS: CST[] = [
  { codigo: '00', descricao: 'Tributada integralmente', tipo: 'ICMS' },
  { codigo: '10', descricao: 'Tributada e com cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '20', descricao: 'Com redução de base de cálculo', tipo: 'ICMS' },
  { codigo: '30', descricao: 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '40', descricao: 'Isenta', tipo: 'ICMS' },
  { codigo: '41', descricao: 'Não tributada', tipo: 'ICMS' },
  { codigo: '50', descricao: 'Suspensão', tipo: 'ICMS' },
  { codigo: '51', descricao: 'Diferimento', tipo: 'ICMS' },
  { codigo: '60', descricao: 'ICMS cobrado anteriormente por substituição tributária', tipo: 'ICMS' },
  { codigo: '70', descricao: 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária', tipo: 'ICMS' },
  { codigo: '90', descricao: 'Outras', tipo: 'ICMS' },
];

export const CST_PIS: CST[] = [
  { codigo: '01', descricao: 'Operação Tributável com Alíquota Básica', tipo: 'PIS' },
  { codigo: '02', descricao: 'Operação Tributável com Alíquota Diferenciada', tipo: 'PIS' },
  { codigo: '03', descricao: 'Operação Tributável com Alíquota por Unidade de Medida de Produto', tipo: 'PIS' },
  { codigo: '04', descricao: 'Operação Tributável Monofásica - Revenda a Alíquota Zero', tipo: 'PIS' },
  { codigo: '05', descricao: 'Operação Tributável por Substituição Tributária', tipo: 'PIS' },
  { codigo: '06', descricao: 'Operação Tributável a Alíquota Zero', tipo: 'PIS' },
  { codigo: '07', descricao: 'Operação Isenta da Contribuição', tipo: 'PIS' },
  { codigo: '08', descricao: 'Operação sem Incidência da Contribuição', tipo: 'PIS' },
  { codigo: '09', descricao: 'Operação com Suspensão da Contribuição', tipo: 'PIS' },
  { codigo: '49', descricao: 'Outras Operações de Saída', tipo: 'PIS' },
  { codigo: '50', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno', tipo: 'PIS' },
  { codigo: '51', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno', tipo: 'PIS' },
  { codigo: '52', descricao: 'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação', tipo: 'PIS' },
  { codigo: '53', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno', tipo: 'PIS' },
  { codigo: '54', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação', tipo: 'PIS' },
  { codigo: '55', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação', tipo: 'PIS' },
  { codigo: '56', descricao: 'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação', tipo: 'PIS' },
  { codigo: '60', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno', tipo: 'PIS' },
  { codigo: '61', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno', tipo: 'PIS' },
  { codigo: '62', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação', tipo: 'PIS' },
  { codigo: '63', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno', tipo: 'PIS' },
  { codigo: '64', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação', tipo: 'PIS' },
  { codigo: '65', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação', tipo: 'PIS' },
  { codigo: '66', descricao: 'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação', tipo: 'PIS' },
  { codigo: '67', descricao: 'Crédito Presumido - Outras Operações', tipo: 'PIS' },
  { codigo: '70', descricao: 'Operação de Aquisição sem Direito a Crédito', tipo: 'PIS' },
  { codigo: '71', descricao: 'Operação de Aquisição com Isenção', tipo: 'PIS' },
  { codigo: '72', descricao: 'Operação de Aquisição com Suspensão', tipo: 'PIS' },
  { codigo: '73', descricao: 'Operação de Aquisição a Alíquota Zero', tipo: 'PIS' },
  { codigo: '74', descricao: 'Operação de Aquisição sem Incidência da Contribuição', tipo: 'PIS' },
  { codigo: '75', descricao: 'Operação de Aquisição por Substituição Tributária', tipo: 'PIS' },
  { codigo: '98', descricao: 'Outras Operações de Entrada', tipo: 'PIS' },
  { codigo: '99', descricao: 'Outras Operações', tipo: 'PIS' },
];

export const CST_COFINS: CST[] = CST_PIS.map(cst => ({ ...cst, tipo: 'COFINS' as const }));

export const CST_IPI: CST[] = [
  { codigo: '00', descricao: 'Entrada com Recuperação de Crédito', tipo: 'IPI' },
  { codigo: '01', descricao: 'Entrada Tributada com Alíquota Zero', tipo: 'IPI' },
  { codigo: '02', descricao: 'Entrada Isenta', tipo: 'IPI' },
  { codigo: '03', descricao: 'Entrada Não-Tributada', tipo: 'IPI' },
  { codigo: '04', descricao: 'Entrada Imune', tipo: 'IPI' },
  { codigo: '05', descricao: 'Entrada com Suspensão', tipo: 'IPI' },
  { codigo: '49', descricao: 'Outras Entradas', tipo: 'IPI' },
  { codigo: '50', descricao: 'Saída Tributada', tipo: 'IPI' },
  { codigo: '51', descricao: 'Saída Tributada com Alíquota Zero', tipo: 'IPI' },
  { codigo: '52', descricao: 'Saída Isenta', tipo: 'IPI' },
  { codigo: '53', descricao: 'Saída Não-Tributada', tipo: 'IPI' },
  { codigo: '54', descricao: 'Saída Imune', tipo: 'IPI' },
  { codigo: '55', descricao: 'Saída com Suspensão', tipo: 'IPI' },
  { codigo: '99', descricao: 'Outras Saídas', tipo: 'IPI' },
];

export const CSOSN_DATA: CSOSN[] = [
  { codigo: '101', descricao: 'Tributada pelo Simples Nacional com permissão de crédito' },
  { codigo: '102', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito' },
  { codigo: '103', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta' },
  { codigo: '201', descricao: 'Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { codigo: '202', descricao: 'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { codigo: '203', descricao: 'Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por substituição tributária' },
  { codigo: '300', descricao: 'Imune' },
  { codigo: '400', descricao: 'Não tributada pelo Simples Nacional' },
  { codigo: '500', descricao: 'ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação' },
  { codigo: '900', descricao: 'Outros' },
];

export const ALL_CST: CST[] = [
  ...CST_ICMS,
  ...CST_PIS,
  ...CST_COFINS,
  ...CST_IPI,
];

