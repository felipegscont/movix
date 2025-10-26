import { IsInt, IsOptional, IsString, Min, Max, MinLength } from 'class-validator';

export class CreateInutilizacaoCteDto {
  // Inutilização Produção
  @IsInt()
  @IsOptional()
  numeroInicialInutilizarProducao?: number;

  @IsInt()
  @IsOptional()
  numeroFinalInutilizarProducao?: number;

  @IsInt()
  @IsOptional()
  serieInutilizarProducao?: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  anoInutilizarProducao?: number;

  @IsString()
  @MinLength(15, { message: 'Justificativa deve ter no mínimo 15 caracteres' })
  @IsOptional()
  justificativaInutilizarProducao?: string;

  // Inutilização Homologação
  @IsInt()
  @IsOptional()
  numeroInicialInutilizarHomologacao?: number;

  @IsInt()
  @IsOptional()
  numeroFinalInutilizarHomologacao?: number;

  @IsInt()
  @IsOptional()
  serieInutilizarHomologacao?: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  anoInutilizarHomologacao?: number;

  @IsString()
  @MinLength(15, { message: 'Justificativa deve ter no mínimo 15 caracteres' })
  @IsOptional()
  justificativaInutilizarHomologacao?: string;
}

