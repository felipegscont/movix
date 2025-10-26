import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracaoCteDto } from './create-configuracao-cte.dto';

export class UpdateConfiguracaoCteDto extends PartialType(CreateConfiguracaoCteDto) {}

