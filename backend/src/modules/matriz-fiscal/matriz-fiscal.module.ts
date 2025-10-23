import { Module } from '@nestjs/common';
import { MatrizFiscalService } from './matriz-fiscal.service';
import { MatrizFiscalController } from './matriz-fiscal.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MatrizFiscalController],
  providers: [MatrizFiscalService],
  exports: [MatrizFiscalService],
})
export class MatrizFiscalModule {}

