import { Module } from '@nestjs/common';
import { InutilizacaoCteService } from './inutilizacao-cte.service';
import { InutilizacaoCteController } from './inutilizacao-cte.controller';

@Module({
  controllers: [InutilizacaoCteController],
  providers: [InutilizacaoCteService],
  exports: [InutilizacaoCteService],
})
export class InutilizacaoCteModule {}

