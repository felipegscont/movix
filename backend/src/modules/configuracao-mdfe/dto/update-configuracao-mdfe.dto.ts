import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracaoMdfeDto } from './create-configuracao-mdfe.dto';

export class UpdateConfiguracaoMdfeDto extends PartialType(CreateConfiguracaoMdfeDto) {}

