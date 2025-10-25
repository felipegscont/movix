"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FornecedorService } from "@/lib/services/fornecedor.service"
import { AuxiliarService, type Estado, type Municipio } from "@/lib/services/auxiliar.service"
import { ExternalApiService, type CnpjData, type CepData } from "@/lib/services/external-api.service"
import { toast } from "sonner"
import { User, MapPin, Phone, FileText, Settings, Search } from "lucide-react"

const fornecedorFormSchema = z.object({
  tipo: z.enum(["FISICA", "JURIDICA"]).default("JURIDICA"),
  documento: z.string().min(11, "Documento deve ter pelo menos 11 caracteres"),
  nome: z.string().min(1, "Nome é obrigatório"),
  nomeFantasia: z.string().optional().or(z.literal("")),
  inscricaoEstadual: z.string().optional().or(z.literal("")),
  inscricaoMunicipal: z.string().optional().or(z.literal("")),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP deve ter 8 caracteres"),
  municipioId: z.string().min(1, "Município é obrigatório"),
  estadoId: z.string().min(1, "Estado é obrigatório"),
  telefone: z.string().optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  site: z.string().optional().or(z.literal("")),
  contato: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
  ativo: z.boolean().default(true),
})

type FornecedorFormValues = z.infer<typeof fornecedorFormSchema>

interface FornecedorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fornecedorId?: string
  onSuccess?: () => void
}

export function FornecedorFormDialog({
  open,
  onOpenChange,
  fornecedorId,
  onSuccess,
}: FornecedorFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)

  const form = useForm({
    resolver: zodResolver(fornecedorFormSchema),
    mode: "onBlur", // Valida apenas quando o campo perde o foco
    defaultValues: {
      tipo: "JURIDICA",
      documento: "",
      nome: "",
      nomeFantasia: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      municipioId: "",
      estadoId: "",
      telefone: "",
      celular: "",
      email: "",
      site: "",
      contato: "",
      observacoes: "",
      ativo: true,
    },
  })

  const watchEstadoId = form.watch("estadoId")

  useEffect(() => {
    loadEstados()
  }, [])

  useEffect(() => {
    if (open && fornecedorId) {
      loadFornecedor()
    } else if (open) {
      form.reset()
    }
  }, [open, fornecedorId])

  useEffect(() => {
    if (watchEstadoId) {
      loadMunicipios(watchEstadoId)
      form.setValue("municipioId", "")
    }
  }, [watchEstadoId])

  const loadEstados = async () => {
    try {
      const data = await AuxiliarService.getEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
    }
  }

  const loadMunicipios = async (estadoId: string): Promise<void> => {
    try {
      const data = await AuxiliarService.getMunicipiosByEstado(estadoId)
      setMunicipios(data)
    } catch (error) {
      console.error("Erro ao carregar municípios:", error)
    }
  }

  // Consulta automática de CNPJ quando o documento tem 14 dígitos
  const handleDocumentoChange = async (value: string) => {
    const numbers = value.replace(/\D/g, '')

    // Detecta automaticamente o tipo baseado no documento
    if (numbers.length <= 11) {
      form.setValue('tipo', 'FISICA')
    } else if (numbers.length <= 14) {
      form.setValue('tipo', 'JURIDICA')

      // Se tem exatamente 14 dígitos, consulta o CNPJ automaticamente
      if (numbers.length === 14 && !loadingCnpj) {
        setLoadingCnpj(true)
        try {
          const cnpjData = await ExternalApiService.consultarCnpj(numbers)
          if (cnpjData) {
            handleCnpjDataLoaded(cnpjData)
            toast.success("Dados do CNPJ carregados automaticamente!")
          }
        } catch (error) {
          console.warn("Erro ao consultar CNPJ:", error)
          // Não mostra erro para o usuário, apenas não preenche automaticamente
        } finally {
          setLoadingCnpj(false)
        }
      }
    }
  }

  // Busca manual de CEP
  const handleCepSearch = async () => {
    const cep = form.getValues("cep")?.replace(/\D/g, '')

    if (!cep || cep.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos")
      return
    }

    setLoadingCep(true)
    try {
      const cepData = await ExternalApiService.consultarCep(cep)
      if (cepData) {
        handleCepDataLoaded(cepData)
        toast.success("Endereço encontrado!")
      }
    } catch (error) {
      console.error("Erro ao consultar CEP:", error)
      toast.error("Erro ao consultar CEP. Verifique se o CEP está correto.")
    } finally {
      setLoadingCep(false)
    }
  }

  // Auto-preenchimento por CNPJ
  const handleCnpjDataLoaded = (cnpjData: CnpjData) => {
    if (!cnpjData) return

    form.setValue("nome", cnpjData.razaoSocial || "")
    form.setValue("nomeFantasia", cnpjData.nomeFantasia || "")
    form.setValue("telefone", cnpjData.telefone || "")
    form.setValue("email", cnpjData.email || "")
    form.setValue("inscricaoEstadual", cnpjData.inscricoesEstaduais?.find(ie => ie.ativo)?.numero || "")
    form.setValue("logradouro", cnpjData.logradouro || "")
    form.setValue("numero", cnpjData.numero || "")
    form.setValue("complemento", cnpjData.complemento || "")
    form.setValue("bairro", cnpjData.bairro || "")
    form.setValue("cep", typeof cnpjData.cep === 'string' ? cnpjData.cep.replace(/\D/g, '') : "")

    // Auto-seleciona estado e município
    if (cnpjData.uf) {
      const estado = estados.find(e => e.uf === cnpjData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)
        // Carrega municípios e seleciona o correto
        if (cnpjData.municipio) {
          loadMunicipios(estado.id).then(() => {
            AuxiliarService.getMunicipiosByEstado(estado.id).then(municipiosData => {
              const municipio = municipiosData.find(m =>
                m.nome.toLowerCase() === cnpjData.municipio?.toLowerCase()
              )
              if (municipio) {
                form.setValue("municipioId", municipio.id)
              }
            })
          })
        }
      }
    }
  }

  // Auto-preenchimento por CEP
  const handleCepDataLoaded = (cepData: CepData) => {
    if (!cepData) return

    form.setValue("logradouro", cepData.logradouro || "")
    form.setValue("bairro", cepData.bairro || "")

    // Auto-seleciona estado e município
    if (cepData.uf) {
      const estado = estados.find(e => e.uf === cepData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)
        if (cepData.localidade) {
          loadMunicipios(estado.id).then(() => {
            AuxiliarService.getMunicipiosByEstado(estado.id).then(municipiosData => {
              const municipio = municipiosData.find(m =>
                m.nome.toLowerCase() === cepData.localidade?.toLowerCase()
              )
              if (municipio) {
                form.setValue("municipioId", municipio.id)
              }
            })
          })
        }
      }
    }
  }

  const loadFornecedor = async () => {
    if (!fornecedorId) return

    try {
      setLoading(true)
      const fornecedor = await FornecedorService.getById(fornecedorId)
      form.reset({
        tipo: fornecedor.tipo,
        documento: fornecedor.documento,
        nome: fornecedor.nome,
        nomeFantasia: fornecedor.nomeFantasia || "",
        inscricaoEstadual: fornecedor.inscricaoEstadual || "",
        inscricaoMunicipal: fornecedor.inscricaoMunicipal || "",
        logradouro: fornecedor.logradouro,
        numero: fornecedor.numero,
        complemento: fornecedor.complemento || "",
        bairro: fornecedor.bairro,
        cep: fornecedor.cep,
        municipioId: fornecedor.municipioId,
        estadoId: fornecedor.estadoId,
        telefone: fornecedor.telefone || "",
        celular: fornecedor.celular || "",
        email: fornecedor.email || "",
        site: fornecedor.site || "",
        contato: fornecedor.contato || "",
        observacoes: fornecedor.observacoes || "",
        ativo: fornecedor.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error)
      toast.error("Erro ao carregar dados do fornecedor")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: FornecedorFormValues) => {
    try {
      setLoading(true)

      // Limpa campos opcionais vazios (converte string vazia para undefined)
      const cleanedValues = {
        ...values,
        nomeFantasia: values.nomeFantasia?.trim() || undefined,
        inscricaoEstadual: values.inscricaoEstadual?.trim() || undefined,
        inscricaoMunicipal: values.inscricaoMunicipal?.trim() || undefined,
        complemento: values.complemento?.trim() || undefined,
        telefone: values.telefone?.trim() || undefined,
        celular: values.celular?.trim() || undefined,
        email: values.email?.trim() || undefined,
        site: values.site?.trim() || undefined,
        contato: values.contato?.trim() || undefined,
        observacoes: values.observacoes?.trim() || undefined,
      }

      if (fornecedorId) {
        await FornecedorService.update(fornecedorId, cleanedValues)
        toast.success("Fornecedor atualizado com sucesso!")
      } else {
        await FornecedorService.create(cleanedValues)
        toast.success("Fornecedor criado com sucesso!")
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro ao salvar fornecedor:", error)
      toast.error(error.message || "Erro ao salvar fornecedor")
    } finally {
      setLoading(false)
    }
  }

  const formErrors = Object.keys(form.formState.errors).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] sm:max-w-[90vw] flex flex-col p-0"
        onInteractOutside={(e) => {
          // Previne o fechamento do dialog ao clicar fora (overlay ou toasts)
          e.preventDefault()
        }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {fornecedorId ? "Editar Fornecedor" : "Novo Fornecedor"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {fornecedorId
                  ? "Edite as informações do fornecedor abaixo"
                  : "Preencha os dados para cadastrar um novo fornecedor"}
              </DialogDescription>
            </div>
            {formErrors > 0 && (
              <Badge variant="destructive" className="ml-4">
                {formErrors} {formErrors === 1 ? "erro" : "erros"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="dados-basicos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dados-basicos" className="gap-2">
                    <User className="h-4 w-4" />
                    Dados Básicos
                  </TabsTrigger>
                  <TabsTrigger value="endereco" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </TabsTrigger>
                  <TabsTrigger value="contato" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contato
                  </TabsTrigger>
                  <TabsTrigger value="outros" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Outros
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Dados Básicos */}
                <TabsContent value="dados-basicos" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Informações Básicas
                      </CardTitle>
                      <CardDescription className="text-xs">Dados principais do fornecedor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {/* Documento CPF/CNPJ */}
                      <FormField
                        control={form.control}
                        name="documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF/CNPJ *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                  onChange={(e) => {
                                    field.onChange(e.target.value)
                                    handleDocumentoChange(e.target.value)
                                  }}
                                />
                                {loadingCnpj && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              {form.watch("documento")?.replace(/\D/g, '').length > 11
                                ? "CNPJ será consultado automaticamente ao completar 14 dígitos"
                                : "Digite o CPF ou CNPJ do fornecedor"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Nome */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {form.watch("documento")?.replace(/\D/g, '').length > 11
                                  ? "Razão Social *"
                                  : "Nome *"}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("documento")?.replace(/\D/g, '').length > 11 && (
                          <FormField
                            control={form.control}
                            name="nomeFantasia"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Status Ativo */}
                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Fornecedor Ativo
                              </FormLabel>
                              <FormDescription>
                                Desative para impedir novas transações com este fornecedor
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
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Endereço */}
                <TabsContent value="endereco" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Endereço
                      </CardTitle>
                      <CardDescription>
                        Localização do fornecedor
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  {...field}
                                  placeholder="00000-000"
                                  maxLength={9}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleCepSearch}
                                  disabled={loadingCep}
                                >
                                  {loadingCep ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Search className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Digite o CEP e clique na lupa para buscar o endereço
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="estadoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  form.setValue("municipioId", "")
                                  loadMunicipios(value)
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {estados.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                      Carregando estados...
                                    </div>
                                  ) : (
                                    estados.map((estado) => (
                                      <SelectItem key={estado.id} value={estado.id}>
                                        {estado.uf} - {estado.nome}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Selecione o estado (UF)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="municipioId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Município *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!watchEstadoId}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={
                                      !watchEstadoId
                                        ? "Selecione primeiro o estado"
                                        : "Selecione o município"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {municipios.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                      {!watchEstadoId
                                        ? "Selecione um estado primeiro"
                                        : "Carregando municípios..."}
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
                              <FormDescription>
                                Selecione o município
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="logradouro"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Logradouro *</FormLabel>
                              <FormControl>
                                <Input placeholder="Rua, Avenida, etc." {...field} />
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
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="complemento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input placeholder="Apto, Sala, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                              <Input placeholder="Centro, Jardim, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Contato */}
                <TabsContent value="contato" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Informações de Contato
                      </CardTitle>
                      <CardDescription>
                        Telefones e email do fornecedor
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 0000-0000" {...field} />
                              </FormControl>
                              <FormDescription>
                                Telefone fixo
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="celular"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Celular</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormDescription>
                                Telefone celular
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="contato@fornecedor.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Email principal para contato
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contato"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pessoa de Contato</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormDescription>
                              Nome da pessoa responsável pelo contato
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Outros */}
                <TabsContent value="outros" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Informações Adicionais
                      </CardTitle>
                      <CardDescription>
                        Dados fiscais e observações
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="inscricaoEstadual"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inscrição Estadual</FormLabel>
                              <FormControl>
                                <Input placeholder="000.000.000.000" {...field} />
                              </FormControl>
                              <FormDescription>
                                IE do fornecedor (se aplicável)
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
                                <Input placeholder="000000" {...field} />
                              </FormControl>
                              <FormDescription>
                                IM do fornecedor (se aplicável)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="site"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.fornecedor.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Website do fornecedor
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Informações adicionais sobre o fornecedor..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Anotações gerais sobre o fornecedor
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {loading
              ? "Salvando..."
              : fornecedorId
              ? "Atualizar Fornecedor"
              : "Criar Fornecedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
