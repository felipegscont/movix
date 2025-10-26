import { Module } from '@nestjs/common';
import { ConfiguracaoNfceService } from './configuracao-nfce.service';
import { ConfiguracaoNfceController } from './configuracao-nfce.controller';

@Module({
  controllers: [ConfiguracaoNfceController],
  providers: [ConfiguracaoNfceService],
  exports: [ConfiguracaoNfceService],
})
export class ConfiguracaoNfceModule {}

