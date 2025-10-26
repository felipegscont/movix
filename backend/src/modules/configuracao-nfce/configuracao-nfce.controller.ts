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
import { ConfiguracaoNfceService } from './configuracao-nfce.service';
import { UpdateConfiguracaoNfceDto } from './dto/update-configuracao-nfce.dto';

@Controller('configuracoes-nfce')
export class ConfiguracaoNfceController {
  constructor(private readonly configuracaoNfeService: ConfiguracaoNfceService) {}

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
    @Body() updateConfiguracaoNfceDto: UpdateConfiguracaoNfceDto,
  ) {
    return this.configuracaoNfeService.upsert(emitenteId, updateConfiguracaoNfceDto);
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

