import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePedidoItemDto {
  @IsInt()
  numeroItem: number;

  @IsString()
  produtoId: string;

  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @IsString()
  unidade: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 4 })
  quantidade: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 4 })
  valorUnitario: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorDesconto?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorTotal: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

