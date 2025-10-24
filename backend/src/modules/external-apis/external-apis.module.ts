import { Module } from '@nestjs/common';
import { ExternalApisController } from './external-apis.controller';
import { CnpjLookupService } from './services/cnpj-lookup.service';
import { CepLookupService } from './services/cep-lookup.service';
import { IbgeDataService } from './services/ibge-data.service';
import { IbgeCacheService } from './services/ibge-cache.service';
import { ExternalApiService } from './services/external-api.service';
import { IbgeSeedService } from './services/ibge-seed.service';

@Module({
  controllers: [ExternalApisController],
  providers: [
    CnpjLookupService,
    CepLookupService,
    IbgeDataService,
    IbgeCacheService,
    ExternalApiService,
    IbgeSeedService,
  ],
  exports: [
    CnpjLookupService,
    CepLookupService,
    IbgeDataService,
    IbgeCacheService,
    ExternalApiService,
    IbgeSeedService,
  ],
})
export class ExternalApisModule {}
