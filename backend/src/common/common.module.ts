import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageService } from './services/file-storage.service';
import { DatabaseInitService } from './services/database-init.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FileStorageService, DatabaseInitService],
  exports: [FileStorageService],
})
export class CommonModule {}
