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
  @IsOptional()
  @IsString()
  @IsIn(['produto', 'servico'])
  tipoItem?: string;

  // NCM (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  ncmId?: string;

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

