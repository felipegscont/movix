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
}

