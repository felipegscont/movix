import { PartialType } from '@nestjs/mapped-types';
import { CreateInutilizacaoCteDto } from './create-inutilizacao-cte.dto';

export class UpdateInutilizacaoCteDto extends PartialType(CreateInutilizacaoCteDto) {}

