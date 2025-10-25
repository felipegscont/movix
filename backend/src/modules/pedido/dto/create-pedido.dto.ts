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

  @IsDateString()
  dataEmissao: string;

  @IsOptional()
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

