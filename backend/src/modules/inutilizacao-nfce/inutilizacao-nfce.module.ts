import { Module } from '@nestjs/common';
import { InutilizacaoNfceService } from './inutilizacao-nfce.service';
import { InutilizacaoNfceController } from './inutilizacao-nfce.controller';

@Module({
  controllers: [InutilizacaoNfceController],
  providers: [InutilizacaoNfceService],
  exports: [InutilizacaoNfceService],
})
export class InutilizacaoNfceModule {}

