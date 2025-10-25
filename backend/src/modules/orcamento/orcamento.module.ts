import { Module } from '@nestjs/common';
import { OrcamentoService } from './orcamento.service';
import { OrcamentoController } from './orcamento.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PedidoModule } from '../pedido/pedido.module';

@Module({
  imports: [PrismaModule, PedidoModule],
  controllers: [OrcamentoController],
  providers: [OrcamentoService],
  exports: [OrcamentoService],
})
export class OrcamentoModule {}

