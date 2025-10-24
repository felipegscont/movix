import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProdutoExcecaoDto {
  @IsString()
  cfopId: string;

  @IsString()
  descricaoCfop: string;

  @IsString()
  produtoId: string;

  @IsString()
  descricaoProduto: string;

  @IsBoolean()
  padrao: boolean;
}

export class CreateNaturezaOperacaoDto {
  @IsString()
  @MaxLength(10)
  codigo: string; // Ex: VENDA, DEVOL, etc

  @IsString()
  @MaxLength(200)
  nome: string; // Nome que aparece na NF

  // Dados gerais
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  tipo?: number; // 0=Entrada, 1=Saída

  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @IsOptional()
  @IsBoolean()
  dentroEstado?: boolean;

  @IsOptional()
  @IsBoolean()
  propria?: boolean;

  // Produtos com exceção CFOP
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoExcecaoDto)
  produtosExcecao?: ProdutoExcecaoDto[];

  // Informações adicionais
  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;
}

