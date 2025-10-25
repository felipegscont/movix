import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrcamentoService } from './orcamento.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoDto } from './dto/update-orcamento.dto';

@Controller('orcamentos')
export class OrcamentoController {
  constructor(private readonly orcamentoService: OrcamentoService) {}

  /**
   * POST /orcamentos
   * Criar novo orçamento
   */
  @Post()
  create(@Body(ValidationPipe) createOrcamentoDto: CreateOrcamentoDto) {
    return this.orcamentoService.create(createOrcamentoDto);
  }

  /**
   * GET /orcamentos
   * Listar orçamentos com paginação
   */
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('clienteId') clienteId?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.orcamentoService.findAll(pageNum, limitNum, clienteId, status);
  }

  /**
   * GET /orcamentos/proximo-numero
   * Obter próximo número de orçamento
   */
  @Get('proximo-numero')
  getProximoNumero() {
    return this.orcamentoService.getProximoNumero();
  }

  /**
   * GET /orcamentos/:id
   * Buscar orçamento por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orcamentoService.findOne(id);
  }

  /**
   * PATCH /orcamentos/:id
   * Atualizar orçamento
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateOrcamentoDto: UpdateOrcamentoDto) {
    return this.orcamentoService.update(id, updateOrcamentoDto);
  }

  /**
   * DELETE /orcamentos/:id
   * Remover orçamento
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orcamentoService.remove(id);
  }

  /**
   * POST /orcamentos/:id/cancelar
   * Cancelar orçamento
   */
  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.orcamentoService.cancelar(id);
  }

  /**
   * POST /orcamentos/:id/converter-em-pedido
   * Converter orçamento em pedido
   */
  @Post(':id/converter-em-pedido')
  converterEmPedido(@Param('id') id: string) {
    return this.orcamentoService.converterEmPedido(id);
  }
}

