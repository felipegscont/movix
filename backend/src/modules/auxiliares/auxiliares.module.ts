import { Module } from '@nestjs/common';
import { AuxiliaresController } from './auxiliares.controller';
import { ExternalApisModule } from '../external-apis/external-apis.module';

@Module({
  imports: [ExternalApisModule],
  controllers: [AuxiliaresController],
})
export class AuxiliaresModule {}
