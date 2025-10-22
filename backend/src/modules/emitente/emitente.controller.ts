import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { EmitenteService } from './emitente.service';
import { CreateEmitenteDto } from './dto/create-emitente.dto';
import { UpdateEmitenteDto } from './dto/update-emitente.dto';
import { EmptyStringToUndefinedPipe } from '../../common/pipes/empty-string-to-undefined.pipe';

@Controller('emitentes')
export class EmitenteController {
  constructor(private readonly emitenteService: EmitenteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(EmptyStringToUndefinedPipe, ValidationPipe)
  create(@Body() createEmitenteDto: CreateEmitenteDto) {
    return this.emitenteService.create(createEmitenteDto);
  }

  @Get()
  findAll() {
    return this.emitenteService.findAll();
  }

  @Get('ativo/principal')
  getEmitenteAtivo() {
    return this.emitenteService.getEmitenteAtivo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emitenteService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.emitenteService.findByCnpj(cnpj);
  }

  @Patch(':id')
  @UsePipes(EmptyStringToUndefinedPipe, ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateEmitenteDto: UpdateEmitenteDto,
  ) {
    return this.emitenteService.update(id, updateEmitenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.emitenteService.remove(id);
  }

  @Get(':id/proximo-numero-nfe')
  getProximoNumeroNfe(@Param('id') id: string) {
    return this.emitenteService.getProximoNumeroNfe(id);
  }

  @Get(':id/certificado')
  async getCertificadoAtivo(@Param('id') id: string) {
    const certificado = await this.emitenteService.getCertificadoAtivo(id);

    if (!certificado) {
      return null;
    }

    console.log('Certificado do banco:', {
      validoDe: certificado.validoDe,
      validoAte: certificado.validoAte,
      diasParaVencimento: certificado.diasParaVencimento,
    });

    // Calcular dias para vencimento atualizado
    const hoje = new Date();
    const validoAte = new Date(certificado.validoAte);
    const diffTime = validoAte.getTime() - hoje.getTime();
    const diasParaVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const expirado = diasParaVencimento < 0;
    const proximoVencimento = diasParaVencimento <= 30 && diasParaVencimento >= 0;

    const response = {
      id: certificado.id,
      cnpj: certificado.cnpjCertificado || '',
      cnpjFormatado: this.formatCNPJ(certificado.cnpjCertificado || ''),
      razaoSocial: certificado.razaoSocialCertificado || '',
      titular: certificado.titular || '',
      validFrom: certificado.validoDe.toISOString(),
      validTo: certificado.validoAte.toISOString(),
      daysUntilExpiration: diasParaVencimento,
      expired: expirado,
      issuer: certificado.emissor || '',
      nearExpiration: proximoVencimento,
      dataUpload: certificado.dataUpload.toISOString(),
      arquivoNome: certificado.arquivoNome,
      arquivoTamanho: certificado.arquivoTamanho,
    };

    console.log('Resposta formatada:', response);

    return response;
  }

  private formatCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }
}
