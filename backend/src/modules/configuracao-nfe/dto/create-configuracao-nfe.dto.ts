import { IsInt, IsOptional, IsString, Min, Max, MinLength, IsIn } from 'class-validator';

export class CreateConfiguracaoNfeDto {
  @IsInt()
  @Min(1)
  @Max(2)
  @IsOptional()
  ambienteAtivo?: number;

  // Produção
  @IsInt()
  @Min(1)
  @Max(999)
  @IsOptional()
  serieProducao?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  proximoNumeroProducao?: number;

  @IsInt()
  @IsOptional()
  tipoFreteProducao?: number;

  @IsInt()
  @IsOptional()
  indicadorPresencaProducao?: number;

  @IsInt()
  @IsOptional()
  orientacaoImpressaoProducao?: number;

  @IsString()
  @IsOptional()
  ieSubstitutoProducao?: string;

  @IsString()
  @IsOptional()
  observacoesProducao?: string;

  @IsString()
  @IsOptional()
  documentosAutorizadosProducao?: string;

  // Homologação
  @IsInt()
  @Min(1)
  @Max(999)
  @IsOptional()
  serieHomologacao?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  proximoNumeroHomologacao?: number;

  @IsInt()
  @IsOptional()
  tipoFreteHomologacao?: number;

  @IsInt()
  @IsOptional()
  indicadorPresencaHomologacao?: number;

  @IsInt()
  @IsOptional()
  orientacaoImpressaoHomologacao?: number;

  @IsString()
  @IsOptional()
  ieSubstitutoHomologacao?: string;

  @IsString()
  @IsOptional()
  observacoesHomologacao?: string;

  @IsString()
  @IsOptional()
  documentosAutorizadosHomologacao?: string;

  // Modelo NFe
  @IsString()
  @IsIn(['4.00'], { message: 'Modelo deve ser 4.00' })
  @IsOptional()
  modeloNfe?: string;
}

