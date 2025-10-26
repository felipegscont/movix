import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateConfiguracaoNfeDto {
  @IsInt()
  @Min(1)
  @Max(2)
  @IsOptional()
  ambiente?: number;

  @IsInt()
  @Min(1)
  @Max(999)
  @IsOptional()
  serie?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  proximoNumero?: number;

  @IsInt()
  @Min(0)
  @Max(9)
  @IsOptional()
  tipoFrete?: number;

  @IsInt()
  @Min(0)
  @Max(9)
  @IsOptional()
  indicadorPresenca?: number;

  @IsInt()
  @Min(1)
  @Max(2)
  @IsOptional()
  orientacaoImpressao?: number;

  @IsString()
  @IsOptional()
  ieSubstitutoTributario?: string;

  @IsString()
  @IsOptional()
  observacoesPadrao?: string;

  @IsString()
  @IsOptional()
  documentosAutorizados?: string;
}

