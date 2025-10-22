import React, { useState, useRef } from "react"
import { toast } from "sonner"
import type { CertificadoState, CertificadoInfo } from "../types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function useCertificado() {
  const [certificado, setCertificado] = useState<CertificadoState>({
    file: null,
    password: "",
    info: null,
    valid: null,
    uploading: false,
    validating: false,
  })

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Validar certificado
  const validateCertificado = async (file: File, password: string) => {
    if (!file || !password) return

    try {
      setCertificado(prev => ({ ...prev, validating: true, valid: null }))

      const formData = new FormData()
      formData.append('certificado', file)
      formData.append('password', password)

      const response = await fetch(`${API_URL}/emitentes/validate-certificate`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao validar certificado')
      }

      const result = await response.json()
      
      setCertificado(prev => ({
        ...prev,
        valid: true,
        info: result.data.certificateInfo,
      }))
      
      if (result.data.certificateInfo.nearExpiration) {
        toast.warning(
          `Certificado válido! Atenção: vence em ${result.data.certificateInfo.daysUntilExpiration} dias`,
          { duration: 5000 }
        )
      } else if (result.data.certificateInfo.expired) {
        toast.error("Certificado expirado! Não é possível usar este certificado.")
        setCertificado(prev => ({ ...prev, valid: false }))
      } else {
        toast.success("Certificado validado com sucesso!")
      }
    } catch (error: any) {
      console.error("Erro ao validar certificado:", error)
      setCertificado(prev => ({ ...prev, valid: false }))
      toast.error(error.message || "Erro ao validar certificado. Verifique o arquivo e a senha.")
    } finally {
      setCertificado(prev => ({ ...prev, validating: false }))
    }
  }

  // Manipular mudança de arquivo
  const handleFileChange = (file: File | null) => {
    if (!file) return

    // Validar extensão
    const allowedExtensions = ['.pfx', '.p12']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Apenas arquivos .pfx ou .p12 são permitidos")
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB")
      return
    }

    setCertificado(prev => ({
      ...prev,
      file,
      valid: null,
      info: null,
    }))
    
    // Se já tem senha, validar automaticamente
    if (certificado.password) {
      validateCertificado(file, certificado.password)
    }
  }

  // Manipular mudança de senha
  const handlePasswordChange = (password: string) => {
    setCertificado(prev => ({ ...prev, password }))
    
    // Limpar timeout anterior
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }
    
    // Se já tem arquivo, validar automaticamente após digitar a senha
    if (certificado.file && password.length >= 4) {
      validationTimeoutRef.current = setTimeout(() => {
        validateCertificado(certificado.file!, password)
      }, 1000)
    } else {
      setCertificado(prev => ({ ...prev, valid: null, info: null }))
    }
  }

  // Validar ao sair do campo (onBlur)
  const handlePasswordBlur = () => {
    if (certificado.file && certificado.password.length >= 4) {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }
      validateCertificado(certificado.file, certificado.password)
    }
  }

  // Upload do certificado
  const uploadCertificado = async (emitenteId: string) => {
    if (!certificado.file || !certificado.password) {
      toast.error("Selecione um certificado e digite a senha")
      return false
    }

    if (certificado.valid === false) {
      toast.error("Certificado inválido. Corrija antes de enviar.")
      return false
    }

    try {
      setCertificado(prev => ({ ...prev, uploading: true }))

      const formData = new FormData()
      formData.append('certificado', certificado.file)
      formData.append('password', certificado.password)

      const response = await fetch(`${API_URL}/emitentes/${emitenteId}/certificado`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao enviar certificado')
      }

      const result = await response.json()
      
      setCertificado(prev => ({
        ...prev,
        info: result.data.certificateInfo,
      }))

      toast.success("Certificado enviado com sucesso!")
      return true
    } catch (error: any) {
      console.error("Erro ao enviar certificado:", error)
      toast.error(error.message || "Erro ao enviar certificado")
      return false
    } finally {
      setCertificado(prev => ({ ...prev, uploading: false }))
    }
  }

  return {
    certificado,
    handleFileChange,
    handlePasswordChange,
    handlePasswordBlur,
    uploadCertificado,
    validateCertificado,
  }
}

