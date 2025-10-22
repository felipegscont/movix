import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';

export interface CertificateInfo {
  valid: boolean;
  cnpj?: string;
  razaoSocial?: string;
  titular?: string;
  validFrom: Date;
  validTo: Date;
  daysUntilExpiration: number;
  expired: boolean;
  issuer: string;
  serialNumber: string;
  error?: string;
}

@Injectable()
export class CertificateValidatorService {
  private readonly logger = new Logger(CertificateValidatorService.name);

  /**
   * Valida um certificado .pfx/.p12 e extrai informações
   */
  async validateCertificate(
    filePath: string,
    password: string,
  ): Promise<CertificateInfo> {
    try {
      // Ler o arquivo do certificado
      const p12Buffer = fs.readFileSync(filePath);
      const p12Der = forge.util.decode64(p12Buffer.toString('base64'));
      
      // Tentar abrir o certificado com a senha
      let p12Asn1;
      try {
        p12Asn1 = forge.asn1.fromDer(p12Der);
      } catch (error) {
        throw new BadRequestException('Arquivo de certificado inválido ou corrompido');
      }

      let p12;
      try {
        p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
      } catch (error) {
        throw new BadRequestException('Senha do certificado incorreta');
      }

      // Extrair o certificado
      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBag = certBags[forge.pki.oids.certBag]?.[0];

      if (!certBag || !certBag.cert) {
        throw new BadRequestException('Certificado não encontrado no arquivo');
      }

      const cert = certBag.cert;

      // Extrair informações do certificado
      const subject = cert.subject.attributes;
      const issuer = cert.issuer.attributes;
      
      // Extrair CNPJ do subject (pode estar em diferentes campos)
      let cnpj = this.extractCNPJ(subject);
      
      // Extrair razão social / titular
      const razaoSocial = this.getAttributeValue(subject, 'CN') || 
                          this.getAttributeValue(subject, 'O');
      
      const titular = this.getAttributeValue(subject, 'CN');

      // Datas de validade
      const validFrom = cert.validity.notBefore;
      const validTo = cert.validity.notAfter;
      const now = new Date();
      
      // Calcular dias até expiração
      const daysUntilExpiration = Math.ceil(
        (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const expired = now > validTo;

      // Emissor do certificado
      const issuerName = this.getAttributeValue(issuer, 'CN') || 
                         this.getAttributeValue(issuer, 'O') || 
                         'Desconhecido';

      // Número de série
      const serialNumber = cert.serialNumber;

      this.logger.log(`Certificado validado: ${titular} - CNPJ: ${cnpj} - Válido até: ${validTo.toLocaleDateString('pt-BR')}`);

      return {
        valid: !expired,
        cnpj,
        razaoSocial,
        titular,
        validFrom,
        validTo,
        daysUntilExpiration,
        expired,
        issuer: issuerName,
        serialNumber,
      };
    } catch (error) {
      this.logger.error(`Erro ao validar certificado: ${error.message}`);
      
      if (error instanceof BadRequestException) {
        throw error;
      }

      return {
        valid: false,
        validFrom: new Date(),
        validTo: new Date(),
        daysUntilExpiration: 0,
        expired: true,
        issuer: '',
        serialNumber: '',
        error: error.message || 'Erro ao validar certificado',
      };
    }
  }

  /**
   * Extrai CNPJ do subject do certificado
   */
  private extractCNPJ(attributes: any[]): string | undefined {
    // Tentar extrair do serialNumber (formato comum: CNPJ:00000000000000)
    const serialNumber = this.getAttributeValue(attributes, 'serialNumber');
    if (serialNumber) {
      const cnpjMatch = serialNumber.match(/(\d{14})/);
      if (cnpjMatch) {
        return cnpjMatch[1];
      }
    }

    // Tentar extrair do CN (Common Name)
    const cn = this.getAttributeValue(attributes, 'CN');
    if (cn) {
      const cnpjMatch = cn.match(/(\d{14})/);
      if (cnpjMatch) {
        return cnpjMatch[1];
      }
    }

    // Tentar extrair do OU (Organizational Unit)
    const ou = this.getAttributeValue(attributes, 'OU');
    if (ou) {
      const cnpjMatch = ou.match(/(\d{14})/);
      if (cnpjMatch) {
        return cnpjMatch[1];
      }
    }

    return undefined;
  }

  /**
   * Obtém o valor de um atributo pelo nome ou OID
   */
  private getAttributeValue(attributes: any[], name: string): string | undefined {
    const attr = attributes.find(
      (a) => a.name === name || a.shortName === name || a.type === name
    );
    return attr?.value;
  }

  /**
   * Valida se o certificado está próximo do vencimento
   */
  isNearExpiration(daysUntilExpiration: number): boolean {
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  }

  /**
   * Formata CNPJ
   */
  formatCNPJ(cnpj: string): string {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
}

