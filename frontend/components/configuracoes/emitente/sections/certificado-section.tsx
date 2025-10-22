import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconLoader2, IconCheck, IconAlertCircle, IconFileTypePdf } from "@tabler/icons-react"
import type { CertificadoState } from "../types"

interface CertificadoSectionProps {
  certificado: CertificadoState
  onFileChange: (file: File | null) => void
  onPasswordChange: (password: string) => void
  onPasswordBlur: () => void
}

export function CertificadoSection({
  certificado,
  onFileChange,
  onPasswordChange,
  onPasswordBlur,
}: CertificadoSectionProps) {
  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconFileTypePdf className="h-4 w-4" />
          Certificado Digital A1
        </CardTitle>
        <CardDescription className="text-xs">
          Arquivo .pfx ou .p12 para assinar NFes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          {/* Campo de Arquivo */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Arquivo do Certificado</label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".pfx,.p12"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                disabled={certificado.uploading || certificado.validating}
                className="cursor-pointer text-sm h-9"
              />
              {certificado.validating && (
                <div className="flex items-center justify-center px-2 bg-blue-100 text-blue-700 rounded-md">
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
              )}
              {certificado.valid === true && (
                <div className="flex items-center justify-center px-2 bg-green-100 text-green-700 rounded-md">
                  <IconCheck className="h-3.5 w-3.5" />
                </div>
              )}
              {certificado.valid === false && (
                <div className="flex items-center justify-center px-2 bg-red-100 text-red-700 rounded-md">
                  <IconAlertCircle className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            {certificado.file && (
              <p className="text-xs text-muted-foreground">
                {certificado.file.name} ({(certificado.file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Campo de Senha */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Senha do Certificado</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Digite a senha"
                value={certificado.password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onBlur={onPasswordBlur}
                disabled={certificado.uploading || certificado.validating}
                className="h-9 text-sm"
              />
              {certificado.validating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {certificado.validating
                ? "Validando..."
                : certificado.valid === true
                ? "✓ Validado"
                : certificado.valid === false
                ? "✗ Inválido"
                : "Digite a senha para validar"}
            </p>
          </div>
        </div>

        {/* Informações do Certificado Validado */}
        {certificado.info && certificado.valid && (
          <div className={`rounded-lg border-2 p-3 ${
            certificado.info.expired 
              ? "border-red-500 bg-red-50" 
              : certificado.info.nearExpiration 
              ? "border-yellow-500 bg-yellow-50" 
              : "border-green-500 bg-green-50"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {certificado.info.expired ? (
                <IconAlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <IconCheck className="h-4 w-4 text-green-600" />
              )}
              <span className={`text-sm font-semibold ${
                certificado.info.expired 
                  ? "text-red-900" 
                  : certificado.info.nearExpiration 
                  ? "text-yellow-900" 
                  : "text-green-900"
              }`}>
                {certificado.info.expired ? "Certificado Expirado" : "Certificado Validado"}
              </span>
              {certificado.info.nearExpiration && !certificado.info.expired && (
                <span className="text-[10px] bg-yellow-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Próximo do vencimento
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {certificado.info.cnpjFormatado && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-gray-600 uppercase">CNPJ</span>
                  <span className="font-semibold text-gray-900">{certificado.info.cnpjFormatado}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-gray-600 uppercase">Validade</span>
                <span className="font-semibold text-gray-900">
                  {new Date(certificado.info.validFrom).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })} - {new Date(certificado.info.validTo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </span>
              </div>
              {certificado.info.titular && (
                <div className="flex flex-col col-span-2">
                  <span className="text-[10px] font-medium text-gray-600 uppercase">Titular</span>
                  <span className="font-semibold text-gray-900 text-xs">{certificado.info.titular}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-gray-600 uppercase">Vencimento</span>
                <span className={`font-bold text-sm ${
                  certificado.info.expired 
                    ? "text-red-700" 
                    : certificado.info.daysUntilExpiration <= 30 
                    ? "text-yellow-700" 
                    : "text-green-700"
                }`}>
                  {certificado.info.expired ? "Expirado" : `${certificado.info.daysUntilExpiration} dias`}
                </span>
              </div>
              {certificado.info.issuer && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-gray-600 uppercase">Autoridade Certificadora</span>
                  <span className="font-semibold text-gray-900 truncate" title={certificado.info.issuer}>{certificado.info.issuer}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requisitos */}
        {!certificado.valid && (
          <Alert className="py-2">
            <IconAlertCircle className="h-3.5 w-3.5" />
            <AlertTitle className="text-xs">Requisitos</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Formato .pfx ou .p12 (máx. 5MB)</li>
                <li>Certificado A1 dentro da validade</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

