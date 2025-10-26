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
import { InutilizacaoCteService } from './inutilizacao-cte.service';
import { UpdateInutilizacaoCteDto } from './dto/update-inutilizacao-cte.dto';

@Controller('inutilizacoes-cte')
export class InutilizacaoCteController {
  constructor(private readonly inutilizacaoNfeService: InutilizacaoCteService) {}

  @Get(':emitenteId')
  async findByEmitente(@Param('emitenteId') emitenteId: string) {
    const inutilizacao = await this.inutilizacaoNfeService.findByEmitente(emitenteId);

    if (!inutilizacao) {
      throw new NotFoundException('Inutilização de NFe não encontrada');
    }

    return inutilizacao;
  }

  @Post(':emitenteId')
  async upsert(
    @Param('emitenteId') emitenteId: string,
    @Body() updateInutilizacaoCteDto: UpdateInutilizacaoCteDto,
  ) {
    return this.inutilizacaoNfeService.upsert(emitenteId, updateInutilizacaoCteDto);
  }

  @Delete(':emitenteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('emitenteId') emitenteId: string) {
    return this.inutilizacaoNfeService.remove(emitenteId);
  }
}

