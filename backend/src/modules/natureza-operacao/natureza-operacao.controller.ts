import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { NaturezaOperacaoService } from './natureza-operacao.service';
import { CreateNaturezaOperacaoDto } from './dto/create-natureza-operacao.dto';
import { UpdateNaturezaOperacaoDto } from './dto/update-natureza-operacao.dto';

@Controller('naturezas-operacao')
export class NaturezaOperacaoController {
  constructor(private readonly naturezaOperacaoService: NaturezaOperacaoService) {}

  @Post()
  create(@Body() createNaturezaOperacaoDto: CreateNaturezaOperacaoDto) {
    return this.naturezaOperacaoService.create(createNaturezaOperacaoDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.naturezaOperacaoService.findAll(page, limit, search);
  }

  @Get('ativas')
  getAtivas() {
    return this.naturezaOperacaoService.getAtivas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.naturezaOperacaoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNaturezaOperacaoDto: UpdateNaturezaOperacaoDto,
  ) {
    return this.naturezaOperacaoService.update(id, updateNaturezaOperacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.naturezaOperacaoService.remove(id);
  }

  // Endpoints para gerenciar CFOPs
  @Post(':id/cfops')
  addCFOP(
    @Param('id') id: string,
    @Body() body: { cfopId: string; padrao?: boolean },
  ) {
    return this.naturezaOperacaoService.addCFOP(id, body.cfopId, body.padrao || false);
  }

  @Delete(':id/cfops/:cfopId')
  removeCFOP(
    @Param('id') id: string,
    @Param('cfopId') cfopId: string,
  ) {
    return this.naturezaOperacaoService.removeCFOP(id, cfopId);
  }

  @Patch(':id/cfops/:cfopId')
  updateCFOPPadrao(
    @Param('id') id: string,
    @Param('cfopId') cfopId: string,
    @Body() body: { padrao: boolean },
  ) {
    return this.naturezaOperacaoService.updateCFOPPadrao(id, cfopId, body.padrao);
  }

  @Get(':id/cfops')
  getCFOPs(@Param('id') id: string) {
    return this.naturezaOperacaoService.getCFOPs(id);
  }
}

