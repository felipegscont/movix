import { PartialType } from '@nestjs/mapped-types';
import { CreateInutilizacaoNfeDto } from './create-inutilizacao-nfe.dto';

export class UpdateInutilizacaoNfeDto extends PartialType(CreateInutilizacaoNfeDto) {}

