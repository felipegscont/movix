import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracaoNfceDto } from './create-configuracao-nfce.dto';

export class UpdateConfiguracaoNfceDto extends PartialType(CreateConfiguracaoNfceDto) {}

