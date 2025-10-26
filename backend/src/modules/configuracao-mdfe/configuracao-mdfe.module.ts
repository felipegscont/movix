import { Module } from '@nestjs/common';
import { ConfiguracaoMdfeService } from './configuracao-mdfe.service';
import { ConfiguracaoMdfeController } from './configuracao-mdfe.controller';

@Module({
  controllers: [ConfiguracaoMdfeController],
  providers: [ConfiguracaoMdfeService],
  exports: [ConfiguracaoMdfeService],
})
export class ConfiguracaoMdfeModule {}

