import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { EmitenteService } from './emitente.service';
import { EmitenteController } from './emitente.controller';
import { EmitenteUploadController } from './emitente-upload.controller';
import { CertificateValidatorService } from './certificate-validator.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './storage/certificates',
    }),
  ],
  controllers: [EmitenteController, EmitenteUploadController],
  providers: [EmitenteService, CertificateValidatorService],
  exports: [EmitenteService],
})
export class EmitenteModule {}
