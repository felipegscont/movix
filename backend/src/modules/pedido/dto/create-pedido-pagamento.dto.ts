import { IsString, IsInt, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePedidoPagamentoDto {
  @IsInt()
  parcela: number;

  @IsString()
  formaPagamentoId: string;

  @IsDateString()
  dataVencimento: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

