import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConfiguracaoNfseService } from './configuracao-nfse.service';
import { UpdateConfiguracaoNfseDto } from './dto/update-configuracao-nfse.dto';

@Controller('configuracoes-nfse')
export class ConfiguracaoNfseController {
  constructor(private readonly configuracaoNfeService: ConfiguracaoNfseService) {}

  @Get(':emitenteId')
  async findByEmitente(@Param('emitenteId') emitenteId: string) {
    const configuracao = await this.configuracaoNfeService.findByEmitente(emitenteId);

    if (!configuracao) {
      throw new NotFoundException('Configuração de NFe não encontrada');
    }

    return configuracao;
  }

  @Post(':emitenteId')
  async upsert(
    @Param('emitenteId') emitenteId: string,
    @Body() updateConfiguracaoNfseDto: UpdateConfiguracaoNfseDto,
  ) {
    return this.configuracaoNfeService.upsert(emitenteId, updateConfiguracaoNfseDto);
  }

  @Post(':emitenteId/incrementar')
  async incrementarNumero(@Param('emitenteId') emitenteId: string) {
    return this.configuracaoNfeService.incrementarProximoNumero(emitenteId);
  }

  @Delete(':emitenteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('emitenteId') emitenteId: string) {
    return this.configuracaoNfeService.remove(emitenteId);
  }
}

