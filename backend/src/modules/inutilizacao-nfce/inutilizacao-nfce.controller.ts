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
import { InutilizacaoNfceService } from './inutilizacao-nfce.service';
import { UpdateInutilizacaoNfceDto } from './dto/update-inutilizacao-nfce.dto';

@Controller('inutilizacoes-nfce')
export class InutilizacaoNfceController {
  constructor(private readonly inutilizacaoNfeService: InutilizacaoNfceService) {}

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
    @Body() updateInutilizacaoNfceDto: UpdateInutilizacaoNfceDto,
  ) {
    return this.inutilizacaoNfeService.upsert(emitenteId, updateInutilizacaoNfceDto);
  }

  @Delete(':emitenteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('emitenteId') emitenteId: string) {
    return this.inutilizacaoNfeService.remove(emitenteId);
  }
}

