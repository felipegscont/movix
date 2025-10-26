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
import { InutilizacaoMdfeService } from './inutilizacao-mdfe.service';
import { UpdateInutilizacaoMdfeDto } from './dto/update-inutilizacao-mdfe.dto';

@Controller('inutilizacoes-mdfe')
export class InutilizacaoMdfeController {
  constructor(private readonly inutilizacaoNfeService: InutilizacaoMdfeService) {}

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
    @Body() updateInutilizacaoMdfeDto: UpdateInutilizacaoMdfeDto,
  ) {
    return this.inutilizacaoNfeService.upsert(emitenteId, updateInutilizacaoMdfeDto);
  }

  @Delete(':emitenteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('emitenteId') emitenteId: string) {
    return this.inutilizacaoNfeService.remove(emitenteId);
  }
}

