import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatrizFiscalDto {
  // Identificação
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  // ===== CONDIÇÕES (Quando aplicar) =====

  // Natureza da Operação (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  naturezaOperacaoId?: string;

  // UF Origem/Destino (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  ufOrigem?: string; // "SP", "RJ", etc

  @IsOptional()
  @IsString()
  ufDestino?: string; // "SP", "RJ", etc

  // Tipo de Cliente (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  @IsIn(['contribuinte', 'nao_contribuinte', 'exterior'])
  tipoCliente?: string;

  // NCM (opcional - null = qualquer)
  @IsOptional()
  @IsString()
  ncmId?: string;

  // Regime Tributário (opcional - null = qualquer)
  // 1=Simples Nacional, 2=Lucro Presumido, 3=Lucro Real
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  regimeTributario?: number;

  // ===== RESULTADO (O que aplicar) =====

  // CFOP
  @IsString()
  cfopId: string;

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
  @IsIn([0, 1, 2, 3])
  icmsModalidadeBC?: number; // 0=Margem, 1=Pauta, 2=Máximo, 3=Operação

  // ICMS ST (Substituição Tributária)
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
  @IsIn([0, 1, 2, 3])
  icmsStModalidadeBC?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  icmsStMva?: number; // Margem Valor Agregado

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

