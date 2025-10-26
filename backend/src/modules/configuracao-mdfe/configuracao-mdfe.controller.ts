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
import { ConfiguracaoMdfeService } from './configuracao-mdfe.service';
import { UpdateConfiguracaoMdfeDto } from './dto/update-configuracao-mdfe.dto';

@Controller('configuracoes-mdfe')
export class ConfiguracaoMdfeController {
  constructor(private readonly configuracaoNfeService: ConfiguracaoMdfeService) {}

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
    @Body() updateConfiguracaoMdfeDto: UpdateConfiguracaoMdfeDto,
  ) {
    return this.configuracaoNfeService.upsert(emitenteId, updateConfiguracaoMdfeDto);
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

