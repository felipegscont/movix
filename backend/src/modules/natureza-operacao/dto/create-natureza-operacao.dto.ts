import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, Min, Max } from 'class-validator';

export class CreateNaturezaOperacaoDto {
  @IsString()
  @MaxLength(10)
  codigo: string; // Ex: VENDA, DEVOL, etc

  @IsString()
  @MaxLength(200)
  descricao: string; // Ex: Venda de mercadoria

  // CFOP Padrão
  @IsOptional()
  @IsString()
  cfopDentroEstadoId?: string; // CFOP para operações dentro do estado

  @IsOptional()
  @IsString()
  cfopForaEstadoId?: string; // CFOP para operações fora do estado

  @IsOptional()
  @IsString()
  cfopExteriorId?: string; // CFOP para operações com exterior

  @IsOptional()
  @IsBoolean()
  sobrescreverCfopProduto?: boolean; // Se true, usa CFOP da natureza ao invés do produto

  // Configurações da NFe
  @IsInt()
  @Min(0)
  @Max(1)
  tipoOperacao: number; // 0=Entrada, 1=Saída

  @IsInt()
  @Min(1)
  @Max(4)
  finalidade: number; // 1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução

  @IsInt()
  @Min(0)
  @Max(1)
  consumidorFinal: number; // 0=Não, 1=Sim

  @IsInt()
  @Min(0)
  @Max(9)
  presencaComprador: number; // 0=Não se aplica, 1=Presencial, etc

  // Informações Adicionais Padrão
  @IsOptional()
  @IsString()
  informacoesAdicionaisPadrao?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

