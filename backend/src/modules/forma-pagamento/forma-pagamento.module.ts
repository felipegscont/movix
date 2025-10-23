import { Module } from '@nestjs/common';
import { FormaPagamentoController } from './forma-pagamento.controller';
import { FormaPagamentoService } from './forma-pagamento.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormaPagamentoController],
  providers: [FormaPagamentoService],
  exports: [FormaPagamentoService],
})
export class FormaPagamentoModule {}

