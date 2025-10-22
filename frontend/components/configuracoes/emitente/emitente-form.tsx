"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconSearch, IconUpload, IconFileTypePdf, IconCheck, IconBuilding, IconMapPin, IconPhone, IconFileText, IconCertificate } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import { ExternalApiService } from "@/lib/services/external-api.service"
import { Skeleton } from "@/components/ui/skeleton"

const emitenteSchema = z.object({
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(14),
  razaoSocial: z.string().min(3, "Razão social é obrigatória"),
  nomeFantasia: z.string().optional(),
  inscricaoEstadual: z.string().optional(), // Opcional - pode ser preenchido pela API externa
  inscricaoMunicipal: z.string().optional(),
  cnae: z.string().optional(), // Opcional - preenchido pela API externa
  regimeTributario: z.number().min(1).max(3),
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(8),
  municipioId: z.string().min(1, "Município é obrigatório"),
  estadoId: z.string().min(1, "Estado é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  site: z.string().optional(),
  ambienteNfe: z.number().min(1).max(2),
  serieNfe: z.number().min(1).max(999),
  proximoNumeroNfe: z.number().min(1),
  ativo: z.boolean().default(true),
})

type EmitenteFormData = z.infer<typeof emitenteSchema>

export function EmitenteForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)
  const [estados, setEstados] = useState<any[]>([])
  const [municipios, setMunicipios] = useState<any[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null)
  const [uploadingCertificado, setUploadingCertificado] = useState(false)
  const [certificadoUploaded, setCertificadoUploaded] = useState(false)
  const [certificadoPassword, setCertificadoPassword] = useState("")
  const [certificadoInfo, setCertificadoInfo] = useState<any>(null)
  const [accordionValue, setAccordionValue] = useState<string[]>(["basicos"])
  const [validatingCertificado, setValidatingCertificado] = useState(false)
  const [certificadoValid, setCertificadoValid] = useState<boolean | null>(null)

  const form = useForm<EmitenteFormData>({
    resolver: zodResolver(emitenteSchema),
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      nomeFantasia: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      cnae: "",
      regimeTributario: 1,
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      municipioId: "",
      estadoId: "",
      telefone: "",
      email: "",
      site: "",
      ambienteNfe: 2, // Homologação por padrão
      serieNfe: 1,
      proximoNumeroNfe: 1,
      ativo: true,
    },
  })

  const watchEstadoId = form.watch("estadoId")

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (watchEstadoId) {
      loadMunicipios(watchEstadoId)
    }
  }, [watchEstadoId])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      
      // Carregar estados
      await loadEstados()

      // Tentar carregar emitente ativo
      const emitente = await EmitenteService.getEmitenteAtivo()

      if (emitente) {
        setEmitenteId(emitente.id)

        // Ao editar, abre todas as seções
        setAccordionValue(["basicos", "endereco", "contato", "fiscal", "nfe"])

        // Carregar municípios do estado antes de setar o formulário
        if (emitente.estadoId) {
          await loadMunicipios(emitente.estadoId)
        }

        // Preencher formulário
        form.reset({
          cnpj: emitente.cnpj,
          razaoSocial: emitente.razaoSocial,
          nomeFantasia: emitente.nomeFantasia || "",
          inscricaoEstadual: emitente.inscricaoEstadual,
          inscricaoMunicipal: emitente.inscricaoMunicipal || "",
          cnae: emitente.cnae,
          regimeTributario: emitente.regimeTributario,
          logradouro: emitente.logradouro,
          numero: emitente.numero,
          complemento: emitente.complemento || "",
          bairro: emitente.bairro,
          cep: emitente.cep,
          municipioId: emitente.municipioId,
          estadoId: emitente.estadoId,
          telefone: emitente.telefone || "",
          email: emitente.email || "",
          site: emitente.site || "",
          ambienteNfe: emitente.ambienteNfe,
          serieNfe: emitente.serieNfe,
          proximoNumeroNfe: emitente.proximoNumeroNfe,
          ativo: emitente.ativo,
        })
      } else {
        // Emitente não existe ainda, mantém valores padrão
        console.log("Nenhum emitente cadastrado ainda")
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados iniciais")
    } finally {
      setLoadingData(false)
    }
  }

  const loadEstados = async () => {
    try {
      setLoadingEstados(true)
      const data = await AuxiliarService.getEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
      toast.error("Erro ao carregar estados")
    } finally {
      setLoadingEstados(false)
    }
  }

  const loadMunicipios = async (estadoId: string) => {
    try {
      setLoadingMunicipios(true)
      const data = await AuxiliarService.getMunicipios(estadoId)
      setMunicipios(data)
    } catch (error) {
      console.error("Erro ao carregar municípios:", error)
      toast.error("Erro ao carregar municípios")
    } finally {
      setLoadingMunicipios(false)
    }
  }

  const onSubmit = async (data: EmitenteFormData) => {
    try {
      // Validar certificado antes de salvar, se houver
      if (certificadoFile && certificadoPassword) {
        if (certificadoValid === null) {
          toast.error("Aguarde a validação do certificado antes de salvar")
          return
        }
        if (certificadoValid === false) {
          toast.error("Certificado inválido. Corrija o certificado antes de salvar.")
          return
        }
        if (certificadoInfo?.expired) {
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
      if (certificadoFile && certificadoPassword && savedEmitenteId && certificadoValid) {
        toast.info("Enviando certificado digital...")
        await uploadCertificadoInternal(savedEmitenteId)
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar emitente")
    } finally {
      setLoading(false)
    }
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 14)
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 8)
  }

  const handleCnpjChange = async (value: string) => {
    const numbers = value.replace(/\D/g, "")

    // Se completou 14 dígitos, consulta automaticamente
    if (numbers.length === 14 && !loadingCnpj) {
      await consultarCnpj(numbers)
    }
  }

  const consultarCnpj = async (cnpj: string) => {
    try {
      setLoadingCnpj(true)
      const data = await ExternalApiService.consultarCnpj(cnpj)

      if (data) {
        // Preencher dados automaticamente
        form.setValue("razaoSocial", data.razaoSocial || "")
        form.setValue("nomeFantasia", data.nomeFantasia || "")

        // CNAE - preencher se disponível
        if (data.cnae) {
          form.setValue("cnae", data.cnae)
        }

        // Inscrição Estadual - preencher se disponível
        if (data.inscricoesEstaduais && data.inscricoesEstaduais.length > 0) {
          // Pega a primeira inscrição ativa
          const inscricaoAtiva = data.inscricoesEstaduais.find(ie => ie.ativo)
          if (inscricaoAtiva) {
            form.setValue("inscricaoEstadual", inscricaoAtiva.numero)
          }
        }

        // Endereço
        form.setValue("logradouro", data.logradouro || "")
        form.setValue("numero", data.numero || "")
        form.setValue("complemento", data.complemento || "")
        form.setValue("bairro", data.bairro || "")
        form.setValue("cep", data.cep?.replace(/\D/g, "") || "")

        // Telefone e email
        if (data.telefone) {
          form.setValue("telefone", data.telefone)
        }
        if (data.email) {
          form.setValue("email", data.email)
        }

        // Buscar estado e município
        if (data.uf) {
          const estado = estados.find(e => e.uf === data.uf)
          if (estado) {
            form.setValue("estadoId", estado.id)

            // Carregar municípios e selecionar
            await loadMunicipios(estado.id)

            // Aguardar um pouco para os municípios carregarem
            setTimeout(() => {
              const municipio = municipios.find(m =>
                m.nome.toLowerCase() === data.municipio?.toLowerCase()
              )
              if (municipio) {
                form.setValue("municipioId", municipio.id)
              }
            }, 500)
          }
        }

        toast.success("Dados do CNPJ carregados com sucesso!")
      }
    } catch (error: any) {
      console.error("Erro ao consultar CNPJ:", error)
      toast.error("Erro ao consultar CNPJ. Preencha os dados manualmente.")
    } finally {
      setLoadingCnpj(false)
    }
  }

  const handleCertificadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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

      setCertificadoFile(file)
      setCertificadoUploaded(false)
      setCertificadoValid(null)
      setCertificadoInfo(null)

      // Se já tem senha, validar automaticamente
      if (certificadoPassword) {
        validateCertificado(file, certificadoPassword)
      }
    }
  }

  const validateCertificado = async (file: File, password: string) => {
    if (!file || !password) return

    try {
      setValidatingCertificado(true)
      setCertificadoValid(null)

      const formData = new FormData()
      formData.append('certificado', file)
      formData.append('password', password)

      // Criar um emitente temporário apenas para validar o certificado
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/emitentes/validate-certificate`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao validar certificado')
      }

      const result = await response.json()

      setCertificadoValid(true)
      setCertificadoInfo(result.data.certificateInfo)

      // Mensagem de sucesso com informações do certificado
      if (result.data.certificateInfo.nearExpiration) {
        toast.warning(
          `Certificado válido! Atenção: vence em ${result.data.certificateInfo.daysUntilExpiration} dias`,
          { duration: 5000 }
        )
      } else if (result.data.certificateInfo.expired) {
        toast.error("Certificado expirado! Não é possível usar este certificado.")
        setCertificadoValid(false)
      } else {
        toast.success("Certificado validado com sucesso!")
      }
    } catch (error: any) {
      console.error("Erro ao validar certificado:", error)
      setCertificadoValid(false)
      toast.error(error.message || "Erro ao validar certificado. Verifique o arquivo e a senha.")
    } finally {
      setValidatingCertificado(false)
    }
  }

  // Ref para armazenar o timeout
  const validationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handlePasswordChange = (password: string) => {
    setCertificadoPassword(password)

    // Limpar timeout anterior
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }

    // Se já tem arquivo, validar automaticamente após digitar a senha
    if (certificadoFile && password.length >= 4) {
      // Debounce de 1000ms para não validar a cada tecla
      validationTimeoutRef.current = setTimeout(() => {
        validateCertificado(certificadoFile, password)
      }, 1000)
    } else {
      // Resetar validação se senha for muito curta
      setCertificadoValid(null)
      setCertificadoInfo(null)
    }
  }

  const uploadCertificadoInternal = async (targetEmitenteId: string) => {
    if (!certificadoFile) {
      throw new Error("Nenhum certificado selecionado")
    }

    if (!certificadoPassword) {
      throw new Error("Senha do certificado não informada")
    }

    setUploadingCertificado(true)

    try {
      const formData = new FormData()
      formData.append('certificado', certificadoFile)
      formData.append('password', certificadoPassword)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/emitentes/${targetEmitenteId}/certificado`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer upload do certificado')
      }

      const result = await response.json()

      setCertificadoUploaded(true)
      setCertificadoInfo(result.data.certificateInfo)

      // Mensagem de sucesso com informações do certificado
      if (result.data.certificateInfo.nearExpiration) {
        toast.warning(
          `Certificado enviado! Atenção: vence em ${result.data.certificateInfo.daysUntilExpiration} dias`,
          { duration: 5000 }
        )
      } else {
        toast.success("Certificado enviado e validado com sucesso!")
      }
    } finally {
      setUploadingCertificado(false)
    }
  }

  const uploadCertificado = async () => {
    if (!certificadoFile || !emitenteId) {
      toast.error("Selecione um certificado e salve o emitente primeiro")
      return
    }

    if (!certificadoPassword) {
      toast.error("Digite a senha do certificado")
      return
    }

    try {
      await uploadCertificadoInternal(emitenteId)
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error)
      toast.error(error.message || "Erro ao enviar certificado")
    }
  }



  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          className="w-full space-y-4"
        >
          {/* Accordion: Dados Básicos */}
          <AccordionItem value="basicos" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <IconBuilding className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold">Dados da Empresa</h3>
                    <p className="text-sm text-muted-foreground">Informações básicas do emitente</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto mr-2">Obrigatório</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="00000000000000"
                              maxLength={14}
                              onChange={(e) => {
                                const formatted = formatCNPJ(e.target.value)
                                field.onChange(formatted)
                                handleCnpjChange(formatted)
                              }}
                              disabled={loadingCnpj}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => consultarCnpj(field.value)}
                            disabled={loadingCnpj || field.value.length !== 14}
                          >
                            {loadingCnpj ? (
                              <IconLoader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <IconSearch className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormDescription>
                          Digite o CNPJ para buscar dados automaticamente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Razão Social da Empresa" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nomeFantasia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Fantasia</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome Fantasia (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inscricaoEstadual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="000000000000 (opcional)" />
                        </FormControl>
                        <FormDescription>
                          Preenchido automaticamente pela consulta de CNPJ quando disponível
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inscricaoMunicipal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Municipal</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00000000 (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnae"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNAE</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0000000" />
                        </FormControl>
                        <FormDescription>
                          Código da atividade econômica principal (preenchido automaticamente pela consulta de CNPJ)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regimeTributario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime Tributário *</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Simples Nacional</SelectItem>
                            <SelectItem value="2">Simples Nacional - Excesso</SelectItem>
                            <SelectItem value="3">Regime Normal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ativo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Emitente Ativo</FormLabel>
                          <FormDescription>
                            Emitente ativo para emissão de NFe
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Endereço */}
          <AccordionItem value="endereco" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <IconMapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold">Endereço</h3>
                    <p className="text-sm text-muted-foreground">Localização da empresa</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto mr-2">Obrigatório</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="00000000"
                            maxLength={8}
                            onChange={(e) => field.onChange(formatCEP(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Logradouro *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Rua, Avenida, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sala, Andar, etc. (opcional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bairro *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Centro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estadoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingEstados}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map((estado) => (
                              <SelectItem key={estado.id} value={estado.id}>
                                {estado.uf} - {estado.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="municipioId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Município *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingMunicipios || !watchEstadoId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingMunicipios
                                    ? "Carregando municípios..."
                                    : !watchEstadoId
                                    ? "Selecione o estado primeiro"
                                    : "Selecione o município"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingMunicipios ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Carregando municípios...
                              </div>
                            ) : municipios.length === 0 ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Nenhum município encontrado
                              </div>
                            ) : (
                              municipios.map((municipio) => (
                                <SelectItem key={municipio.id} value={municipio.id}>
                                  {municipio.nome}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Contato */}
          <AccordionItem value="contato" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <IconPhone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold">Informações de Contato</h3>
                    <p className="text-sm text-muted-foreground">Dados para contato (opcionais)</p>
                  </div>
                </div>
                <Badge variant="outline" className="ml-auto mr-2">Opcional</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="(00) 00000-0000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contato@empresa.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="site"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Site</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="www.empresa.com.br" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion: Configurações NFe */}
          <AccordionItem value="nfe" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <IconCertificate className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold">Configurações de NFe</h3>
                    <p className="text-sm text-muted-foreground">Parâmetros para emissão de Notas Fiscais</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto mr-2">Obrigatório</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ambienteNfe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ambiente NFe *</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Produção</SelectItem>
                            <SelectItem value="2">Homologação</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Use Homologação para testes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serieNfe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série NFe *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            max={999}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>
                          Série padrão das NFes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proximoNumeroNfe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Próximo Número NFe *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>
                          Próxima numeração
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Upload de Certificado Digital */}
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Arquivo do Certificado</label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept=".pfx,.p12"
                            onChange={handleCertificadoChange}
                            disabled={uploadingCertificado || validatingCertificado}
                            className="cursor-pointer text-sm h-9"
                          />
                          {validatingCertificado && (
                            <div className="flex items-center justify-center px-2 bg-blue-100 text-blue-700 rounded-md">
                              <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                            </div>
                          )}
                          {certificadoValid === true && (
                            <div className="flex items-center justify-center px-2 bg-green-100 text-green-700 rounded-md">
                              <IconCheck className="h-3.5 w-3.5" />
                            </div>
                          )}
                          {certificadoValid === false && (
                            <div className="flex items-center justify-center px-2 bg-red-100 text-red-700 rounded-md">
                              <IconAlertCircle className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                        {certificadoFile && (
                          <p className="text-xs text-muted-foreground">
                            {certificadoFile.name} ({(certificadoFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Senha do Certificado</label>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Digite a senha"
                            value={certificadoPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onBlur={() => {
                              // Validar imediatamente ao sair do campo
                              if (certificadoFile && certificadoPassword.length >= 4) {
                                // Limpar timeout pendente
                                if (validationTimeoutRef.current) {
                                  clearTimeout(validationTimeoutRef.current)
                                }
                                validateCertificado(certificadoFile, certificadoPassword)
                              }
                            }}
                            disabled={uploadingCertificado || validatingCertificado}
                            className="h-9 text-sm"
                          />
                          {validatingCertificado && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <IconLoader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {validatingCertificado
                            ? "Validando..."
                            : certificadoValid === true
                            ? "✓ Validado"
                            : certificadoValid === false
                            ? "✗ Inválido"
                            : "Digite a senha para validar"}
                        </p>
                      </div>
                    </div>

                    {emitenteId && (
                      <Button
                        type="button"
                        onClick={uploadCertificado}
                        disabled={!certificadoFile || !certificadoPassword || uploadingCertificado}
                        className="w-full"
                      >
                        {uploadingCertificado && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {!uploadingCertificado && <IconUpload className="h-4 w-4 mr-2" />}
                        {uploadingCertificado ? "Enviando..." : "Enviar Certificado"}
                      </Button>
                    )}

                    {/* Informações do Certificado Validado */}
                    {certificadoInfo && certificadoValid && (
                      <div className={`rounded-lg border-2 p-3 ${
                        certificadoInfo.expired
                          ? "border-red-500 bg-red-50"
                          : certificadoInfo.nearExpiration
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-green-500 bg-green-50"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {certificadoInfo.expired ? (
                            <IconAlertCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <IconCheck className="h-4 w-4 text-green-600" />
                          )}
                          <span className={`text-sm font-semibold ${
                            certificadoInfo.expired
                              ? "text-red-900"
                              : certificadoInfo.nearExpiration
                              ? "text-yellow-900"
                              : "text-green-900"
                          }`}>
                            {certificadoInfo.expired ? "Certificado Expirado" : "Certificado Validado"}
                          </span>
                          {certificadoInfo.nearExpiration && !certificadoInfo.expired && (
                            <span className="text-[10px] bg-yellow-600 text-white px-1.5 py-0.5 rounded font-medium">
                              Próximo do vencimento
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                          {certificadoInfo.cnpjFormatado && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-medium text-gray-600 uppercase">CNPJ</span>
                              <span className="font-semibold text-gray-900">{certificadoInfo.cnpjFormatado}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-gray-600 uppercase">Validade</span>
                            <span className="font-semibold text-gray-900">
                              {new Date(certificadoInfo.validFrom).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })} - {new Date(certificadoInfo.validTo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </span>
                          </div>
                          {certificadoInfo.titular && (
                            <div className="flex flex-col col-span-2">
                              <span className="text-[10px] font-medium text-gray-600 uppercase">Titular</span>
                              <span className="font-semibold text-gray-900 text-xs">{certificadoInfo.titular}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-gray-600 uppercase">Vencimento</span>
                            <span className={`font-bold text-sm ${
                              certificadoInfo.expired
                                ? "text-red-700"
                                : certificadoInfo.daysUntilExpiration <= 30
                                ? "text-yellow-700"
                                : "text-green-700"
                            }`}>
                              {certificadoInfo.expired ? "Expirado" : `${certificadoInfo.daysUntilExpiration} dias`}
                            </span>
                          </div>
                          {certificadoInfo.issuer && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-medium text-gray-600 uppercase">Autoridade Certificadora</span>
                              <span className="font-semibold text-gray-900 truncate" title={certificadoInfo.issuer}>{certificadoInfo.issuer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!certificadoValid && (
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!loading && <IconDeviceFloppy className="h-4 w-4 mr-2" />}
            {loading ? "Salvando..." : emitenteId ? "Atualizar Configurações" : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

