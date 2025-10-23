import { IsString, IsOptional, IsDecimal, IsBoolean, Length, Matches, IsIn, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProdutoDto {
  @IsString()
  @Length(1, 50)
  codigo: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  codigoBarras?: string;

  @IsString()
  @Length(1, 500)
  descricao: string;

  @IsOptional()
  @IsString()
  descricaoComplementar?: string;

  // Classificação Fiscal
  @IsString()
  ncmId: string;

  @IsOptional()
  @IsString()
  cestId?: string;

  @IsOptional()
  @IsString()
  cfopId?: string;

  // Unidades
  @IsString()
  @Length(1, 10)
  unidade: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  unidadeTributavel?: string;

  // Valores
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 4 })
  valorUnitario: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  valorCusto?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  margemLucro?: number;

  // Estoque
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 4 })
  estoqueAtual?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  estoqueMinimo?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  estoqueMaximo?: number;

  // Dimensões e Peso
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  peso?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  altura?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  largura?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 4 })
  profundidade?: number;

  // Tributação
  @IsString()
  @IsIn(['0', '1', '2', '3', '4', '5', '6', '7', '8'])
  origem: string; // 0=Nacional, 1=Estrangeira, etc

  // Impostos - ICMS
  @IsOptional()
  @IsString()
  icmsCstId?: string; // Para regime normal

  @IsOptional()
  @IsString()
  icmsCsosnId?: string; // Para Simples Nacional

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  icmsAliquota?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  icmsReducao?: number;

  // Impostos - PIS
  @IsOptional()
  @IsString()
  pisCstId?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 4 })
  pisAliquota?: number;

  // Impostos - COFINS
  @IsOptional()
  @IsString()
  cofinsCstId?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 4 })
  cofinsAliquota?: number;

  // Impostos - IPI
  @IsOptional()
  @IsString()
  ipiCstId?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  ipiAliquota?: number;

  // Fornecedor
  @IsOptional()
  @IsString()
  fornecedorId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
