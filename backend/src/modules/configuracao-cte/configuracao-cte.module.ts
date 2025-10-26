import { Module } from '@nestjs/common';
import { ConfiguracaoCteService } from './configuracao-cte.service';
import { ConfiguracaoCteController } from './configuracao-cte.controller';

@Module({
  controllers: [ConfiguracaoCteController],
  providers: [ConfiguracaoCteService],
  exports: [ConfiguracaoCteService],
})
export class ConfiguracaoCteModule {}

