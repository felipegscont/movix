import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { EmitenteModule } from './modules/emitente/emitente.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { FornecedorModule } from './modules/fornecedor/fornecedor.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { NfeModule } from './modules/nfe/nfe.module';
import { AuxiliaresModule } from './modules/auxiliares/auxiliares.module';
import { ExternalApisModule } from './modules/external-apis/external-apis.module';
import { NaturezaOperacaoModule } from './modules/natureza-operacao/natureza-operacao.module';
import { FormaPagamentoModule } from './modules/forma-pagamento/forma-pagamento.module';
import { MatrizFiscalModule } from './modules/matriz-fiscal/matriz-fiscal.module';
import { OrcamentoModule } from './modules/orcamento/orcamento.module';
import { PedidoModule } from './modules/pedido/pedido.module';
import { ConfiguracaoNfeModule } from './modules/configuracao-nfe/configuracao-nfe.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    CommonModule,
    EmitenteModule,
    ClienteModule,
    FornecedorModule,
    ProdutoModule,
    NfeModule,
    AuxiliaresModule,
    ExternalApisModule,
    NaturezaOperacaoModule,
    FormaPagamentoModule,
    MatrizFiscalModule,
    OrcamentoModule,
    PedidoModule,
    ConfiguracaoNfeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
