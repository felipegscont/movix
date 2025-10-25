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
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  /**
   * POST /pedidos
   * Criar novo pedido
   */
  @Post()
  create(@Body(ValidationPipe) createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  /**
   * GET /pedidos
   * Listar pedidos com paginação
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

    return this.pedidoService.findAll(pageNum, limitNum, clienteId, status);
  }

  /**
   * GET /pedidos/proximo-numero
   * Obter próximo número de pedido
   */
  @Get('proximo-numero')
  getProximoNumero() {
    return this.pedidoService.getProximoNumero();
  }

  /**
   * GET /pedidos/:id
   * Buscar pedido por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  /**
   * PATCH /pedidos/:id
   * Atualizar pedido
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  /**
   * DELETE /pedidos/:id
   * Remover pedido
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }
}

