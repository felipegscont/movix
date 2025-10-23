import { Module } from '@nestjs/common';
import { AuxiliaresController } from './auxiliares.controller';
import { AuxiliaresService } from './auxiliares.service';
import { ExternalApisModule } from '../external-apis/external-apis.module';

@Module({
  imports: [ExternalApisModule],
  controllers: [AuxiliaresController],
  providers: [AuxiliaresService],
  exports: [AuxiliaresService],
})
export class AuxiliaresModule {}
