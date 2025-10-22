import { IsString, IsOptional, IsInt, IsBoolean, IsEmail, Length, Matches, IsIn, ValidateIf, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Validador customizado para garantir consistência entre Inscrição Estadual e Indicador de IE
 * Regras:
 * - Se indicadorIE = 1 (Contribuinte ICMS) → DEVE ter inscricaoEstadual
 * - Se indicadorIE = 2 (Isento) → NÃO deve ter inscricaoEstadual
 * - Se indicadorIE = 9 (Não contribuinte) → NÃO deve ter inscricaoEstadual
 * - Se tipo = FISICA → indicadorIE DEVE ser 9
 */
function IsConsistentWithIE(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isConsistentWithIE',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as CreateClienteDto;

          // Se é pessoa física, indicadorIE deve ser 9
          if (obj.tipo === 'FISICA' && value !== 9) {
            return false;
          }

          // Se indicadorIE = 1 (Contribuinte), DEVE ter IE
          if (value === 1 && (!obj.inscricaoEstadual || obj.inscricaoEstadual.trim() === '')) {
            return false;
          }

          // Se indicadorIE = 2 ou 9 (Isento ou Não contribuinte), NÃO deve ter IE
          if ((value === 2 || value === 9) && obj.inscricaoEstadual && obj.inscricaoEstadual.trim() !== '') {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as CreateClienteDto;

          if (obj.tipo === 'FISICA' && args.value !== 9) {
            return 'Pessoa física deve ser sempre "Não contribuinte" (indicadorIE = 9)';
          }

          if (args.value === 1) {
            return 'Contribuinte ICMS (indicadorIE = 1) deve ter Inscrição Estadual preenchida';
          }

          if ((args.value === 2 || args.value === 9)) {
            return 'Cliente Isento ou Não contribuinte não deve ter Inscrição Estadual preenchida';
          }

          return 'Inconsistência entre Inscrição Estadual e Indicador de IE';
        },
      },
    });
  };
}

export class CreateClienteDto {
  @IsString()
  @IsIn(['FISICA', 'JURIDICA'])
  tipo: string;

  @IsString()
  @Length(11, 14)
  @Matches(/^\d{11,14}$/, { message: 'Documento deve conter apenas números' })
  documento: string; // CPF ou CNPJ

  @IsString()
  @Length(1, 200)
  nome: string; // Nome ou Razão Social

  @IsOptional()
  @IsString()
  @Length(1, 200)
  nomeFantasia?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  inscricaoMunicipal?: string;

  // Endereço
  @IsString()
  @Length(1, 200)
  logradouro: string;

  @IsString()
  @Length(1, 20)
  numero: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  complemento?: string;

  @IsString()
  @Length(1, 100)
  bairro: string;

  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  cep: string;

  @IsString()
  municipioId: string;

  @IsString()
  estadoId: string;

  // Contato
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  celular?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Configurações Fiscais
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 9], { message: 'Indicador de IE deve ser 1 (Contribuinte), 2 (Isento) ou 9 (Não contribuinte)' })
  @IsConsistentWithIE()
  indicadorIE?: number; // 1=Contribuinte ICMS, 2=Isento, 9=Não contribuinte

  @IsOptional()
  @IsString()
  @Length(1, 15)
  @Matches(/^\d+$/, { message: 'Inscrição SUFRAMA deve conter apenas números' })
  inscricaoSuframa?: string; // Inscrição SUFRAMA (Zona Franca de Manaus)

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
