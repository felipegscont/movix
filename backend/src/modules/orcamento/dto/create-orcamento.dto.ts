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
import { CreateOrcamentoItemDto } from './create-orcamento-item.dto';

export class CreateOrcamentoDto {
  @IsInt()
  numero: number;

  @Transform(({ value }) => {
    if (value && value.includes('T')) return value;
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  @IsDateString()
  dataEmissao: string;

  @Transform(({ value }) => {
    if (value && value.includes('T')) return value;
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }
    return value;
  })
  @IsDateString()
  dataValidade: string;

  @IsOptional()
  @IsString()
  @IsIn(['EM_ABERTO', 'APROVADO', 'CANCELADO'])
  status?: string;

  @IsString()
  clienteId: string;

  @IsOptional()
  @IsString()
  vendedorNome?: string;

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
  @Type(() => CreateOrcamentoItemDto)
  itens: CreateOrcamentoItemDto[];
}

