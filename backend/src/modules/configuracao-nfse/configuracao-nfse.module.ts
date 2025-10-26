import { Module } from '@nestjs/common';
import { ConfiguracaoNfseService } from './configuracao-nfse.service';
import { ConfiguracaoNfseController } from './configuracao-nfse.controller';

@Module({
  controllers: [ConfiguracaoNfseController],
  providers: [ConfiguracaoNfseService],
  exports: [ConfiguracaoNfseService],
})
export class ConfiguracaoNfseModule {}

