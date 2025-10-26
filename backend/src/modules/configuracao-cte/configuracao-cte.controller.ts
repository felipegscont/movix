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
import { ConfiguracaoCteService } from './configuracao-cte.service';
import { UpdateConfiguracaoCteDto } from './dto/update-configuracao-cte.dto';

@Controller('configuracoes-cte')
export class ConfiguracaoCteController {
  constructor(private readonly configuracaoNfeService: ConfiguracaoCteService) {}

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
    @Body() updateConfiguracaoCteDto: UpdateConfiguracaoCteDto,
  ) {
    return this.configuracaoNfeService.upsert(emitenteId, updateConfiguracaoCteDto);
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

