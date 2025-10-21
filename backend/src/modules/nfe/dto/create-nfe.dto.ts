import { IsString, IsInt, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateNfeDuplicataDto } from './create-nfe-duplicata.dto';

export class CreateNfeItemDto {
  @IsString()
  produtoId: string;

  @IsInt()
  numeroItem: number;

  @IsString()
  cfopId: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 4 })
  quantidadeComercial: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 4 })
  valorUnitario: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorDesconto?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorFrete?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorSeguro?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorOutros?: number;

  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;

  // Tributação ICMS
  @IsOptional()
  @IsString()
  icmsCstId?: string;

  @IsOptional()
  @IsString()
  icmsCsosnId?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  icmsBaseCalculo?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  icmsAliquota?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  icmsValor?: number;

  // Tributação PIS
  @IsString()
  pisCstId: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  pisBaseCalculo?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 4 })
  pisAliquota?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  pisValor?: number;

  // Tributação COFINS
  @IsString()
  cofinsCstId: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  cofinsBaseCalculo?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 4 })
  cofinsAliquota?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  cofinsValor?: number;
}

export class CreateNfePagamentoDto {
  @IsString()
  @IsIn(['01', '02', '03', '04', '05', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '90', '99'])
  formaPagamento: string; // 01=Dinheiro, 02=Cheque, 03=Cartão Crédito, etc

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsOptional()
  @IsString()
  tipoIntegracao?: string;

  @IsOptional()
  @IsString()
  cnpjCredenciadora?: string;

  @IsOptional()
  @IsString()
  bandeira?: string;

  @IsOptional()
  @IsString()
  numeroAutorizacao?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorTroco?: number;
}

export class CreateNfeDto {
  @IsString()
  emitenteId: string;

  @IsString()
  clienteId: string;

  @IsInt()
  serie: number;

  @IsString()
  naturezaOperacao: string;

  @IsInt()
  @IsIn([0, 1])
  tipoOperacao: number; // 0=Entrada, 1=Saída

  @IsInt()
  @IsIn([0, 1])
  consumidorFinal: number; // 0=Não, 1=Sim

  @IsInt()
  @IsIn([0, 1, 2, 3, 4, 5, 9])
  presencaComprador: number; // 0=Não se aplica, 1=Presencial, etc

  @IsOptional()
  @IsDateString()
  dataEmissao?: string;

  @IsOptional()
  @IsDateString()
  dataSaida?: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1, 9])
  modalidadeFrete?: number; // 0=Emitente, 1=Destinatário, 9=Sem frete

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorFrete?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorSeguro?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorDesconto?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorOutros?: number;

  // Totalizadores Raros (baseado em XMLs reais)
  // XML: <vICMSDeson>0.00</vICMSDeson>
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorICMSDesonerado?: number;

  // XML: <vFCP>0.00</vFCP> (Fundo de Combate à Pobreza)
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorFCP?: number;

  // XML: <vII>0.00</vII> (Imposto de Importação)
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorII?: number;

  // XML: <vOutro>0.00</vOutro> (Outras Despesas Acessórias)
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsNumber({ maxDecimalPlaces: 2 })
  valorOutrasDespesas?: number;

  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;

  @IsOptional()
  @IsString()
  informacoesFisco?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNfeItemDto)
  itens: CreateNfeItemDto[];

  // Duplicatas (baseado em XML real)
  // XML: <dup><nDup>001</nDup><dVenc>2025-10-06</dVenc><vDup>7200.00</vDup></dup>
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNfeDuplicataDto)
  duplicatas?: CreateNfeDuplicataDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNfePagamentoDto)
  pagamentos?: CreateNfePagamentoDto[];
}
