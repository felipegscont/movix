import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { EmitenteService } from './emitente.service';
import { CreateEmitenteDto } from './dto/create-emitente.dto';
import { UpdateEmitenteDto } from './dto/update-emitente.dto';
import { EmptyStringToUndefinedPipe } from '../../common/pipes/empty-string-to-undefined.pipe';

@Controller('emitentes')
export class EmitenteController {
  constructor(private readonly emitenteService: EmitenteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(EmptyStringToUndefinedPipe, ValidationPipe)
  create(@Body() createEmitenteDto: CreateEmitenteDto) {
    return this.emitenteService.create(createEmitenteDto);
  }

  @Get()
  findAll() {
    return this.emitenteService.findAll();
  }

  @Get('ativo/principal')
  getEmitenteAtivo() {
    return this.emitenteService.getEmitenteAtivo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emitenteService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.emitenteService.findByCnpj(cnpj);
  }

  @Patch(':id')
  @UsePipes(EmptyStringToUndefinedPipe, ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateEmitenteDto: UpdateEmitenteDto,
  ) {
    return this.emitenteService.update(id, updateEmitenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.emitenteService.remove(id);
  }

  @Get(':id/proximo-numero-nfe')
  getProximoNumeroNfe(@Param('id') id: string) {
    return this.emitenteService.getProximoNumeroNfe(id);
  }
}
