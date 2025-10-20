import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Controller('fornecedores')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedorService.create(createFornecedorDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.fornecedorService.findAll(pageNum, limitNum, search);
  }

  @Get('select')
  getFornecedoresForSelect() {
    return this.fornecedorService.getFornecedoresForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedorService.findOne(id);
  }

  @Get('documento/:documento')
  findByDocumento(@Param('documento') documento: string) {
    return this.fornecedorService.findByDocumento(documento);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateFornecedorDto: UpdateFornecedorDto,
  ) {
    return this.fornecedorService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.fornecedorService.remove(id);
  }
}

