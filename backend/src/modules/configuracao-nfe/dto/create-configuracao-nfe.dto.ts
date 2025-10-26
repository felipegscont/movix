import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

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
  @IsOptional()
  anoInutilizarProducao?: number;

  @IsString()
  @IsOptional()
  justificativaInutilizarProducao?: string;

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
  @IsOptional()
  anoInutilizarHomologacao?: number;

  @IsString()
  @IsOptional()
  justificativaInutilizarHomologacao?: string;
}

