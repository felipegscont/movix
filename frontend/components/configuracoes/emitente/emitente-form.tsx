"use client"

import { useState } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconBuilding, IconMapPin, IconPhone, IconCertificate, IconFileTypePdf, IconReceipt } from "@tabler/icons-react"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"
import { useEmitenteForm } from "@/hooks/emitente/use-emitente-form"
import { useCertificado } from "@/hooks/emitente/use-certificado"
import { useCnpjLookup } from "@/hooks/emitente/use-cnpj-lookup"
import { useCepLookup } from "@/hooks/emitente/use-cep-lookup"
import { DadosBasicosSection } from "./sections/dados-basicos-section"
import { EnderecoSection } from "./sections/endereco-section"
import { ContatoSection } from "./sections/contato-section"
import { NfeSection } from "./sections/nfe-section"
import { CertificadoSection } from "./sections/certificado-section"
import type { EmitenteFormData } from "@/lib/schemas/emitente.schema"

export function EmitenteForm() {
  const {
    form,
    loading,
    setLoading,
    loadingData,
    emitenteId,
    setEmitenteId,
    estados,
    municipios,
    loadingEstados,
    loadingMunicipios,
    loadMunicipios,
    certificadoInfo: certificadoInfoFromDb,
  } = useEmitenteForm()

  const {
    certificado,
    handleFileChange,
    handlePasswordChange,
    handlePasswordBlur,
    uploadCertificado,
  } = useCertificado()

  const { loading: loadingCnpj, consultarCnpj, formatCNPJ } = useCnpjLookup(form as any, estados, loadMunicipios)
  const { loading: loadingCep, consultarCep, formatCEP } = useCepLookup(form as any, estados, loadMunicipios)

  const [accordionValue, setAccordionValue] = useState<string[]>([])

  const onSubmit = async (data: EmitenteFormData) => {
    try {
      // Validar certificado antes de salvar, se houver
      if (certificado.file && certificado.password) {
        if (certificado.valid === null) {
          toast.error("Aguarde a validação do certificado antes de salvar")
          return
        }
        if (certificado.valid === false) {
          toast.error("Certificado inválido. Corrija o certificado antes de salvar.")
          return
        }
        if (certificado.info?.expired) {
          toast.error("Certificado expirado. Não é possível salvar com certificado vencido.")
          return
        }
      }

      setLoading(true)

      let savedEmitenteId = emitenteId

      if (emitenteId) {
        await EmitenteService.update(emitenteId, data)
        toast.success("Emitente atualizado com sucesso!")
      } else {
        const emitente = await EmitenteService.create(data)
        savedEmitenteId = emitente.id
        setEmitenteId(emitente.id)
        toast.success("Emitente cadastrado com sucesso!")
      }

      // Se há certificado selecionado e validado, fazer upload automaticamente
      if (certificado.file && certificado.password && savedEmitenteId && certificado.valid) {
        toast.info("Enviando certificado digital...")
        await uploadCertificado(savedEmitenteId)
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar emitente")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="space-y-2">
        {/* Skeleton para cada accordion */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="border rounded-lg p-6">
            <div className="flex items-center gap-3">
              {/* Ícone circular */}
              <Skeleton className="h-10 w-10 rounded-full" />
              {/* Título e descrição */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        ))}
        {/* Skeleton para botão */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Alerta informativo */}
        {!emitenteId && (
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertTitle>Primeiro Acesso</AlertTitle>
            <AlertDescription>
              Configure os dados da sua empresa para começar a emitir NFes.
              Digite o CNPJ da sua empresa no campo abaixo para buscar os dados automaticamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Accordion para todas as seções */}
        <Accordion
          type="multiple"
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full space-y-2"
        >
          {/* Accordion: Dados Básicos */}
          <AccordionItem value="basicos" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconBuilding className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Dados da Empresa</h3>
                  <p className="text-sm text-muted-foreground">Informações básicas do emitente</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4">
                <DadosBasicosSection
                  form={form as any}
                  loadingCnpj={loadingCnpj}
                  onConsultarCnpj={consultarCnpj}
                  formatCNPJ={formatCNPJ}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Endereço */}
          <AccordionItem value="endereco" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconMapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Endereço</h3>
                  <p className="text-sm text-muted-foreground">Localização da empresa</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4">
                <EnderecoSection
                  form={form as any}
                  estados={estados as any}
                  municipios={municipios as any}
                  loadingEstados={loadingEstados}
                  loadingMunicipios={loadingMunicipios}
                  loadingCep={loadingCep}
                  onConsultarCep={consultarCep}
                  formatCEP={formatCEP}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Contato */}
          <AccordionItem value="contato" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconPhone className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Informações de Contato</h3>
                  <p className="text-sm text-muted-foreground">Dados para contato</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4">
                <ContatoSection form={form as any} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Configurações NFe */}
          <AccordionItem value="nfe" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconReceipt className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Configurações de NFe</h3>
                  <p className="text-sm text-muted-foreground">Parâmetros para emissão de Notas Fiscais</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4">
                <NfeSection form={form as any} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Certificado Digital */}
          <AccordionItem value="certificado" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconFileTypePdf className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Certificado Digital</h3>
                  <p className="text-sm text-muted-foreground">Certificado A1 para assinatura de NFes</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4">
                <CertificadoSection
                  certificado={certificado}
                  certificadoInfoFromDb={certificadoInfoFromDb}
                  onFileChange={handleFileChange}
                  onPasswordChange={handlePasswordChange}
                  onPasswordBlur={handlePasswordBlur}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading}>
            {loading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!loading && <IconDeviceFloppy className="h-4 w-4 mr-2" />}
            {loading ? "Salvando..." : emitenteId ? "Atualizar Configurações" : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

