import { Module } from '@nestjs/common';
import { InutilizacaoMdfeService } from './inutilizacao-mdfe.service';
import { InutilizacaoMdfeController } from './inutilizacao-mdfe.controller';

@Module({
  controllers: [InutilizacaoMdfeController],
  providers: [InutilizacaoMdfeService],
  exports: [InutilizacaoMdfeService],
})
export class InutilizacaoMdfeModule {}

