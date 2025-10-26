import { IsInt, IsOptional, IsString, Min, Max, MinLength, IsIn } from 'class-validator';

export class CreateConfiguracaoNfceDto {
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

  @IsString()
  @IsOptional()
  cscProducao?: string;

  @IsInt()
  @IsOptional()
  cscIdProducao?: number;

  @IsString()
  @IsOptional()
  formatoImpressaoProducao?: string; // 80mm, 58mm

  @IsString()
  @IsOptional()
  observacoesProducao?: string;

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

  @IsString()
  @IsOptional()
  cscHomologacao?: string;

  @IsInt()
  @IsOptional()
  cscIdHomologacao?: number;

  @IsString()
  @IsOptional()
  formatoImpressaoHomologacao?: string;

  @IsString()
  @IsOptional()
  observacoesHomologacao?: string;

  // Modelo NFCe
  @IsString()
  @IsIn(['4.00'], { message: 'Modelo deve ser 4.00' })
  @IsOptional()
  modeloNfce?: string;
}

