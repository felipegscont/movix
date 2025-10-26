import { Module } from '@nestjs/common';
import { InutilizacaoNfeService } from './inutilizacao-nfe.service';
import { InutilizacaoNfeController } from './inutilizacao-nfe.controller';

@Module({
  controllers: [InutilizacaoNfeController],
  providers: [InutilizacaoNfeService],
  exports: [InutilizacaoNfeService],
})
export class InutilizacaoNfeModule {}

