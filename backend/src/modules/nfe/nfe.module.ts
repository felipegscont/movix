import { Module } from '@nestjs/common';
import { NfeService } from './nfe.service';
import { NfeController } from './nfe.controller';
import { NfeIntegrationService } from './nfe-integration.service';
import { EmitenteModule } from '../emitente/emitente.module';
import { MatrizFiscalModule } from '../matriz-fiscal/matriz-fiscal.module';

@Module({
  imports: [EmitenteModule, MatrizFiscalModule],
  controllers: [NfeController],
  providers: [NfeService, NfeIntegrationService],
  exports: [NfeService, NfeIntegrationService],
})
export class NfeModule {}
