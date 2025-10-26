import { PartialType } from '@nestjs/mapped-types';
import { CreateInutilizacaoNfceDto } from './create-inutilizacao-nfce.dto';

export class UpdateInutilizacaoNfceDto extends PartialType(CreateInutilizacaoNfceDto) {}

