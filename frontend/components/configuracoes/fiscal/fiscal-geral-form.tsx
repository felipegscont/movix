"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { StaticCombobox } from "@/components/shared/combobox/static-combobox"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconCertificate, IconFileText, IconBuilding } from "@tabler/icons-react"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"
import { useCertificado } from "@/hooks/emitente/use-certificado"
import { CertificadoSection } from "@/components/configuracoes/emitente/sections/certificado-section"

const REGIME_TRIBUTARIO_OPTIONS = [
  { value: 1, label: "Simples Nacional" },
  { value: 2, label: "Simples Nacional - Excesso de Sublimite de Receita Bruta" },
  { value: 3, label: "Regime Normal" },
]

const fiscalGeralSchema = z.object({
  regimeTributario: z.number().min(1).max(3),
  enviarNotasPorEmail: z.boolean().default(false),
})

type FiscalGeralFormData = z.infer<typeof fiscalGeralSchema>

export function FiscalGeralForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)
  const [certificadoInfoFromDb, setCertificadoInfoFromDb] = useState<any>(null)
  const [showNoEmitenteDialog, setShowNoEmitenteDialog] = useState(false)

  const {
    certificado,
    handleFileChange,
    handlePasswordChange,
    handlePasswordBlur,
    uploadCertificado,
  } = useCertificado()

  const form = useForm<FiscalGeralFormData>({
    resolver: zodResolver(fiscalGeralSchema),
    defaultValues: {
      regimeTributario: 1,
      enviarNotasPorEmail: false,
    },
  })

  // Carregar dados do emitente
  useEffect(() => {
    async function loadEmitente() {
      try {
        setLoadingData(true)
        console.log("🔵 [FiscalGeralForm] Carregando emitente...")
        const emitente = await EmitenteService.getEmitenteAtivo()
        console.log("📦 [FiscalGeralForm] Emitente recebido:", emitente)

        if (emitente) {
          setEmitenteId(emitente.id)
          console.log("🆔 [FiscalGeralForm] EmitenteId definido:", emitente.id)

          // Verificar se o campo existe
          console.log("📧 [FiscalGeralForm] enviarNotasPorEmail do backend:", emitente.enviarNotasPorEmail)
          console.log("📧 [FiscalGeralForm] Tipo:", typeof emitente.enviarNotasPorEmail)

          // Preencher formulário
          const formData = {
            regimeTributario: emitente.regimeTributario || 1,
            enviarNotasPorEmail: emitente.enviarNotasPorEmail || false,
          }
          console.log("📝 [FiscalGeralForm] Dados para form.reset:", formData)

          form.reset(formData)

          console.log("✅ [FiscalGeralForm] Formulário resetado")
          console.log("📋 [FiscalGeralForm] Valores do formulário após reset:", form.getValues())

          // Carregar informações do certificado se existir
          if (emitente.certificadoPath) {
            const certInfo = await EmitenteService.getCertificadoAtivo(emitente.id)
            if (certInfo) {
              setCertificadoInfoFromDb(certInfo)
            }
          }
        } else {
          console.warn("⚠️ [FiscalGeralForm] Nenhum emitente encontrado")
          // Nenhum emitente encontrado - mostrar dialog
          setShowNoEmitenteDialog(true)
        }
      } catch (error) {
        console.error("❌ [FiscalGeralForm] Erro ao carregar emitente:", error)
        toast.error("Erro ao carregar dados")
      } finally {
        setLoadingData(false)
        console.log("🏁 [FiscalGeralForm] Carregamento finalizado")
      }
    }

    loadEmitente()
  }, [form])

  const onSubmit = async (data: FiscalGeralFormData) => {
    if (!emitenteId) {
      toast.error("Configure os dados da empresa primeiro em Configurações > Empresa > Geral")
      return
    }

    try {
      setLoading(true)

      // Salvar configurações fiscais
      await EmitenteService.update(emitenteId, {
        regimeTributario: data.regimeTributario,
        enviarNotasPorEmail: data.enviarNotasPorEmail,
      })

      // Se há certificado selecionado e validado, fazer upload
      if (certificado.file && certificado.password && certificado.valid) {
        toast.info("Enviando certificado digital...")
        const uploadResult = await uploadCertificado(emitenteId)
        
        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Erro ao fazer upload do certificado")
          return
        }

        // Recarregar informações do certificado
        const certInfo = await EmitenteService.getCertificadoInfo(emitenteId)
        if (certInfo.data) {
          setCertificadoInfoFromDb(certInfo.data)
        }
      }

      toast.success("Configurações fiscais salvas com sucesso!")
    } catch (error: any) {
      console.error("Erro ao salvar:", error)
      toast.error(error.message || "Erro ao salvar configurações")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!emitenteId) {
    return (
      <Alert variant="destructive">
        <IconAlertCircle className="h-4 w-4" />
        <AlertTitle>Empresa não configurada</AlertTitle>
        <AlertDescription>
          Configure os dados da empresa em{" "}
          <a href="/configuracoes/empresa/geral" className="underline font-medium">
            Configurações &gt; Empresa &gt; Geral
          </a>
          {" "}antes de configurar as opções fiscais.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="multiple" className="space-y-4" defaultValue={["regime", "certificado"]}>
          {/* Accordion: Regime Tributário */}
          <AccordionItem value="regime" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconFileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Regime Tributário</h3>
                  <p className="text-sm text-muted-foreground">Configurações de tributação da empresa</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="pt-4 space-y-4">
                {/* Regime Tributário */}
                <FormField
                  control={form.control}
                  name="regimeTributario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regime Tributário *</FormLabel>
                      <FormControl>
                        <StaticCombobox
                          options={REGIME_TRIBUTARIO_OPTIONS}
                          value={field.value}
                          onValueChange={(value) => field.onChange(value as number)}
                          placeholder="Selecione o regime"
                        />
                      </FormControl>
                      <FormDescription>
                        Regime de tributação da empresa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Enviar Notas por Email */}
                <FormField
                  control={form.control}
                  name="enviarNotasPorEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Enviar notas fiscais por e-mail
                        </FormLabel>
                        <FormDescription>
                          Enviar automaticamente as notas fiscais para o e-mail do cliente
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Certificado Digital */}
          <AccordionItem value="certificado" className="border rounded-lg !border-b">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <IconCertificate className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold">Certificado Digital</h3>
                  <p className="text-sm text-muted-foreground">Certificado A1 para assinatura de documentos fiscais</p>
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

        {/* Botão Salvar */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

