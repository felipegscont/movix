import { PartialType } from '@nestjs/mapped-types';
import { CreateInutilizacaoMdfeDto } from './create-inutilizacao-mdfe.dto';

export class UpdateInutilizacaoMdfeDto extends PartialType(CreateInutilizacaoMdfeDto) {}

