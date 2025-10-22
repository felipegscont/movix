import { Module } from '@nestjs/common';
import { NaturezaOperacaoService } from './natureza-operacao.service';
import { NaturezaOperacaoController } from './natureza-operacao.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NaturezaOperacaoController],
  providers: [NaturezaOperacaoService],
  exports: [NaturezaOperacaoService],
})
export class NaturezaOperacaoModule {}

