import {
  IsString,
  IsInt,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreatePedidoItemDto } from './create-pedido-item.dto';
import { CreatePedidoPagamentoDto } from './create-pedido-pagamento.dto';

export class CreatePedidoDto {
  @IsInt()
  numero: number;

  @Transform(({ value }) => {
    // Se já for ISO completo, retorna como está
    if (value && value.includes('T')) return value;
    // Se for apenas data (YYYY-MM-DD), adiciona hora
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  @IsDateString()
  dataEmissao: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (value.includes('T')) return value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  @IsDateString()
  dataEntrega?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ABERTO', 'FATURADO', 'CANCELADO'])
  status?: string;

  @IsString()
  clienteId: string;

  @IsOptional()
  @IsString()
  vendedorNome?: string;

  @IsOptional()
  @IsString()
  enderecoEntrega?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  subtotal: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorDesconto?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorFrete?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorOutros?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valorTotal: number;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  itens: CreatePedidoItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoPagamentoDto)
  pagamentos?: CreatePedidoPagamentoDto[];
}

