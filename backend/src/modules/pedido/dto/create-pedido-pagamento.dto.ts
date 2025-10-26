import { IsString, IsInt, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePedidoPagamentoDto {
  @IsInt()
  parcela: number;

  @IsString()
  formaPagamentoId: string;

  @Transform(({ value }) => {
    if (!value) return value;
    // Se já for ISO completo, retorna como está
    if (value.includes('T')) return value;
    // Se for apenas data (YYYY-MM-DD), adiciona hora
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  @IsDateString()
  dataVencimento: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

