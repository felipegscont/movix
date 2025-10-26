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
import { ConfiguracaoNfeService } from './configuracao-nfe.service';
import { UpdateConfiguracaoNfeDto } from './dto/update-configuracao-nfe.dto';

@Controller('configuracoes-nfe')
export class ConfiguracaoNfeController {
  constructor(private readonly configuracaoNfeService: ConfiguracaoNfeService) {}

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
    @Body() updateConfiguracaoNfeDto: UpdateConfiguracaoNfeDto,
  ) {
    return this.configuracaoNfeService.upsert(emitenteId, updateConfiguracaoNfeDto);
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

