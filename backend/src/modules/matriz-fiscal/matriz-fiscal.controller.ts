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
import { MatrizFiscalService } from './matriz-fiscal.service';
import { CreateMatrizFiscalDto } from './dto/create-matriz-fiscal.dto';
import { UpdateMatrizFiscalDto } from './dto/update-matriz-fiscal.dto';

@Controller('matrizes-fiscais')
export class MatrizFiscalController {
  constructor(private readonly matrizFiscalService: MatrizFiscalService) {}

  /**
   * POST /matrizes-fiscais
   * Criar nova matriz fiscal
   */
  @Post()
  create(@Body() createMatrizFiscalDto: CreateMatrizFiscalDto) {
    return this.matrizFiscalService.create(createMatrizFiscalDto);
  }

  /**
   * GET /matrizes-fiscais
   * Listar todas as matrizes fiscais com filtros e paginação
   */
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('codigo') codigo?: string, // Filtrar por tipo de imposto (ICMS, PIS, etc)
    @Query('seAplicaA') seAplicaA?: string, // Filtrar por produtos/servicos
    @Query('modeloNF') modeloNF?: string, // Filtrar por modelo NF
    @Query('produtoId') produtoId?: string, // Filtrar por produto
    @Query('ufDestino') ufDestino?: string, // Filtrar por UF
    @Query('ativo') ativo?: string,
    // Filtros legados
    @Query('naturezaOperacaoId') naturezaOperacaoId?: string,
    @Query('ufOrigem') ufOrigem?: string,
    @Query('tipoCliente') tipoCliente?: string,
  ) {
    const skip = (page - 1) * limit;

    return this.matrizFiscalService.findAll({
      skip,
      take: limit,
      codigo,
      seAplicaA,
      modeloNF,
      produtoId,
      ufDestino,
      ativo: ativo === 'true' ? true : ativo === 'false' ? false : undefined,
      // Filtros legados
      naturezaOperacaoId,
      ufOrigem,
      tipoCliente,
    });
  }

  /**
   * GET /matrizes-fiscais/ativas
   * Listar apenas matrizes fiscais ativas
   */
  @Get('ativas')
  findActive(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const skip = (page - 1) * limit;

    return this.matrizFiscalService.findAll({
      skip,
      take: limit,
      ativo: true,
    });
  }

  /**
   * POST /matrizes-fiscais/buscar-aplicavel
   * Buscar matriz fiscal aplicável baseado em condições
   * Este endpoint será usado ao adicionar itens na NFe
   */
  @Post('buscar-aplicavel')
  buscarAplicavel(
    @Body()
    params: {
      naturezaOperacaoId: string;
      ufOrigem: string;
      ufDestino: string;
      tipoCliente: 'contribuinte' | 'nao_contribuinte' | 'exterior';
      ncmId: string;
      regimeTributario: number;
    },
  ) {
    return this.matrizFiscalService.buscarMatrizAplicavel(params);
  }

  /**
   * GET /matrizes-fiscais/:id
   * Buscar matriz fiscal por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matrizFiscalService.findOne(id);
  }

  /**
   * PATCH /matrizes-fiscais/:id
   * Atualizar matriz fiscal
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatrizFiscalDto: UpdateMatrizFiscalDto,
  ) {
    return this.matrizFiscalService.update(id, updateMatrizFiscalDto);
  }

  /**
   * DELETE /matrizes-fiscais/:id
   * Remover matriz fiscal
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matrizFiscalService.remove(id);
  }
}

