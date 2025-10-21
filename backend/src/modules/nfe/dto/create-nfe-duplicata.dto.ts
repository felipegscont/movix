import { IsString, IsDateString, IsNumber, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para criação de duplicata da NFe
 * Baseado no XML real: <dup><nDup>001</nDup><dVenc>2025-10-06</dVenc><vDup>7200.00</vDup></dup>
 */
export class CreateNfeDuplicataDto {
  /**
   * Número da duplicata
   * Exemplo: "001", "002", "003"
   * XML: <nDup>001</nDup>
   */
  @IsString()
  @Length(1, 20)
  numero: string;

  /**
   * Data de vencimento da duplicata
   * Formato: YYYY-MM-DD ou ISO 8601
   * XML: <dVenc>2025-10-06</dVenc>
   */
  @IsDateString()
  dataVencimento: string;

  /**
   * Valor da duplicata
   * Deve ser maior que 0
   * XML: <vDup>7200.00</vDup>
   */
  @IsNumber()
  @Min(0.01, { message: 'Valor da duplicata deve ser maior que zero' })
  @Type(() => Number)
  valor: number;
}

