import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, Min, Max, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatrizFiscalDto {
  // ===== IDENTIFICAÇÃO =====

  // Tipo de Imposto: ICMS, PIS, COFINS, IPI, ISSQN
  @IsString()
  @IsIn(['ICMS', 'PIS', 'COFINS', 'IPI', 'ISSQN'])
  codigo: string;

  @IsString()
  descricao: string;

  // Se aplica a: produtos, servicos
  @IsOptional()
  @IsString()
  @IsIn(['produtos', 'servicos'])
  seAplicaA?: string;

  // Modelo da NF: nfe, nfce, cte, nfse
  @IsOptional()
  @IsString()
  @IsIn(['nfe', 'nfce', 'cte', 'nfse'])
  modeloNF?: string;

  // Regime Tributário (opcional - null = qualquer)
  // 1=Simples Nacional, 2=Lucro Presumido, 3=Lucro Real
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  regimeTributario?: number;

  // Vigência
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  // ===== FILTROS (Quando aplicar) =====

  // UF Destino (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  ufDestino?: string;

  // Produto/Serviço específico (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  produtoId?: string;

  // CFOP (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  cfopId?: string;

  // Tipo de Item (opcional - null = qualquer)
  // 00=Mercadoria para Revenda, 01=Matéria-Prima, 02=Embalagem, etc
  @IsOptional()
  @IsString()
  @IsIn(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '99'])
  tipoItem?: string;

  // NCM (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  ncmId?: string;

  // Campos legados (manter compatibilidade)
  @IsOptional()
  @IsString()
  naturezaOperacaoId?: string;

  @IsOptional()
  @IsString()
  ufOrigem?: string;

  @IsOptional()
  @IsString()
  @IsIn(['contribuinte', 'nao_contribuinte', 'exterior'])
  tipoCliente?: string;

  // ===== DEFINIÇÕES FISCAIS (O que aplicar) =====

  // CST/CSOSN (dinâmico baseado no imposto)
  @IsOptional()
  @IsString()
  cstId?: string; // CST genérico (ICMS, PIS, COFINS, IPI)

  @IsOptional()
  @IsString()
  csosnId?: string; // CSOSN (apenas ICMS Simples Nacional)

  // Alíquotas
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  aliquota?: number; // Alíquota principal

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  reducaoBC?: number; // Redução BC (ICMS)

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  fcp?: number; // FCP (ICMS)

  // ===== CAMPOS LEGADOS (Compatibilidade) =====

  // ICMS
  @IsOptional()
  @IsString()
  icmsCstId?: string;

  @IsOptional()
  @IsString()
  icmsCsosnId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsAliquota?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsReducao?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  icmsModalidadeBC?: number;

  // ICMS ST
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsStAliquota?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsStReducao?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  icmsStModalidadeBC?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsStMva?: number;

  // IPI
  @IsOptional()
  @IsString()
  ipiCstId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  ipiAliquota?: number;

  // PIS
  @IsOptional()
  @IsString()
  pisCstId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  pisAliquota?: number;

  // COFINS
  @IsOptional()
  @IsString()
  cofinsCstId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  cofinsAliquota?: number;

  // ===== CONTROLE =====

  // Prioridade (quanto maior, mais específica)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  prioridade?: number;

  // Ativo/Inativo
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

