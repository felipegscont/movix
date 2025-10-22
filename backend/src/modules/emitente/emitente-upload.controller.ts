import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { EmitenteService } from './emitente.service';
import { CertificateValidatorService } from './certificate-validator.service';

// Configuração do storage para certificados
const certificateStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'storage', 'certificates');
    
    // Criar diretório se não existir
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nome do arquivo: emitente_id + timestamp + extensão
    const emitenteId = req.params.id;
    const timestamp = Date.now();
    const ext = extname(file.originalname);
    const filename = `${emitenteId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// Filtro para aceitar apenas arquivos .pfx ou .p12
const certificateFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pfx', '.p12'];
  const ext = extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Apenas arquivos .pfx ou .p12 são permitidos'), false);
  }
};

@Controller('emitentes')
export class EmitenteUploadController {
  constructor(
    private readonly emitenteService: EmitenteService,
    private readonly certificateValidator: CertificateValidatorService,
  ) {}

  @Post('validate-certificate')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('certificado', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'storage', 'temp');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          const filename = `temp_${timestamp}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: certificateFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async validateCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    if (!password) {
      throw new BadRequestException('Senha do certificado é obrigatória');
    }

    try {
      // Validar o certificado
      const certificadoPath = file.path;
      const certInfo = await this.certificateValidator.validateCertificate(
        certificadoPath,
        password,
      );

      // Remover arquivo temporário após validação
      const fs = require('fs');
      fs.unlinkSync(certificadoPath);

      if (!certInfo.valid || certInfo.expired) {
        throw new BadRequestException(
          certInfo.error || 'Certificado inválido ou expirado',
        );
      }

      return {
        success: true,
        message: 'Certificado validado com sucesso',
        data: {
          certificateInfo: {
            cnpj: certInfo.cnpj,
            cnpjFormatado: certInfo.cnpj
              ? this.certificateValidator.formatCNPJ(certInfo.cnpj)
              : undefined,
            razaoSocial: certInfo.razaoSocial,
            titular: certInfo.titular,
            validFrom: certInfo.validFrom,
            validTo: certInfo.validTo,
            daysUntilExpiration: certInfo.daysUntilExpiration,
            expired: certInfo.expired,
            issuer: certInfo.issuer,
            nearExpiration: this.certificateValidator.isNearExpiration(
              certInfo.daysUntilExpiration,
            ),
          },
        },
      };
    } catch (error) {
      // Tentar remover arquivo temporário em caso de erro
      try {
        const fs = require('fs');
        if (file.path && existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (cleanupError) {
        // Ignorar erro de limpeza
      }
      throw error;
    }
  }

  @Post(':id/certificado')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('certificado', {
      storage: certificateStorage,
      fileFilter: certificateFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadCertificado(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    if (!password) {
      throw new BadRequestException('Senha do certificado é obrigatória');
    }

    // Validar o certificado
    const certificadoPath = file.path;
    const certInfo = await this.certificateValidator.validateCertificate(
      certificadoPath,
      password,
    );

    if (!certInfo.valid) {
      throw new BadRequestException(
        certInfo.error || 'Certificado inválido ou expirado',
      );
    }

    // Verificar se está próximo do vencimento
    if (this.certificateValidator.isNearExpiration(certInfo.daysUntilExpiration)) {
      // Apenas aviso, não bloqueia
      console.warn(
        `Certificado próximo do vencimento: ${certInfo.daysUntilExpiration} dias`,
      );
    }

    // Atualizar o caminho do certificado no emitente
    await this.emitenteService.updateCertificadoPath(id, certificadoPath);

    // Salvar informações do certificado na tabela
    const certificadoSalvo = await this.emitenteService.saveCertificadoInfo(id, {
      arquivoPath: certificadoPath,
      arquivoNome: file.originalname,
      arquivoTamanho: file.size,
      senha: password, // TODO: Criptografar a senha antes de salvar
      cnpjCertificado: certInfo.cnpj,
      razaoSocialCertificado: certInfo.razaoSocial,
      titular: certInfo.titular,
      emissor: certInfo.issuer,
      numeroSerie: certInfo.serialNumber,
      validoDe: certInfo.validFrom,
      validoAte: certInfo.validTo,
      diasParaVencimento: certInfo.daysUntilExpiration,
      expirado: certInfo.expired,
      proximoVencimento: this.certificateValidator.isNearExpiration(
        certInfo.daysUntilExpiration,
      ),
    });

    return {
      success: true,
      message: 'Certificado enviado e validado com sucesso',
      data: {
        certificadoId: certificadoSalvo.id,
        filename: file.filename,
        size: file.size,
        path: certificadoPath,
        certificateInfo: {
          cnpj: certInfo.cnpj,
          cnpjFormatado: certInfo.cnpj
            ? this.certificateValidator.formatCNPJ(certInfo.cnpj)
            : undefined,
          razaoSocial: certInfo.razaoSocial,
          titular: certInfo.titular,
          validFrom: certInfo.validFrom,
          validTo: certInfo.validTo,
          daysUntilExpiration: certInfo.daysUntilExpiration,
          expired: certInfo.expired,
          issuer: certInfo.issuer,
          nearExpiration: this.certificateValidator.isNearExpiration(
            certInfo.daysUntilExpiration,
          ),
        },
      },
    };
  }
}

