import { PartialType } from '@nestjs/mapped-types';
import { CreateMatrizFiscalDto } from './create-matriz-fiscal.dto';

export class UpdateMatrizFiscalDto extends PartialType(CreateMatrizFiscalDto) {}

