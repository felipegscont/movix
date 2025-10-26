import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracaoNfseDto } from './create-configuracao-nfse.dto';

export class UpdateConfiguracaoNfseDto extends PartialType(CreateConfiguracaoNfseDto) {}

