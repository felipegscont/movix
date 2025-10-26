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
import { InutilizacaoNfeService } from './inutilizacao-nfe.service';
import { UpdateInutilizacaoNfeDto } from './dto/update-inutilizacao-nfe.dto';

@Controller('inutilizacoes-nfe')
export class InutilizacaoNfeController {
  constructor(private readonly inutilizacaoNfeService: InutilizacaoNfeService) {}

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
    @Body() updateInutilizacaoNfeDto: UpdateInutilizacaoNfeDto,
  ) {
    return this.inutilizacaoNfeService.upsert(emitenteId, updateInutilizacaoNfeDto);
  }

  @Delete(':emitenteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('emitenteId') emitenteId: string) {
    return this.inutilizacaoNfeService.remove(emitenteId);
  }
}

