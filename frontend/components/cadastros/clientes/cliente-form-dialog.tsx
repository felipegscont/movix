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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ClienteService } from "@/lib/services/cliente.service"
import { AuxiliarService, type Estado, type Municipio } from "@/lib/services/auxiliar.service"
import { DocumentoInput } from "@/components/shared/documento-input"
import { CepInput } from "@/components/shared/cep-input"
import { type CnpjData, type CepData } from "@/lib/services/external-api.service"
import { toast } from "sonner"
import { User, MapPin, Phone, FileText, Settings } from "lucide-react"

const clienteFormSchema = z.object({
  tipo: z.enum(["FISICA", "JURIDICA"]).optional().default("FISICA"),
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
  indicadorIE: z.number().optional(),
  ativo: z.boolean().default(true),
})

type ClienteFormValues = z.infer<typeof clienteFormSchema>

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId?: string
  onSuccess?: () => void
}

export function ClienteFormDialog({
  open,
  onOpenChange,
  clienteId,
  onSuccess,
}: ClienteFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteFormSchema),
    mode: "onBlur", // Valida apenas quando o campo perde o foco
    defaultValues: {
      tipo: "FISICA",
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
      indicadorIE: 9,
      ativo: true,
    },
  })

  const watchEstadoId = form.watch("estadoId")

  useEffect(() => {
    loadEstados()
  }, [])

  useEffect(() => {
    if (open && clienteId) {
      loadCliente()
    } else if (open) {
      form.reset()
    }
  }, [open, clienteId])

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

  // Auto-preenchimento por CNPJ
  const handleCnpjDataLoaded = (cnpjData: CnpjData) => {
    if (!cnpjData) {
      console.warn('Dados do CNPJ não recebidos')
      return
    }

    // Preenche dados da empresa
    form.setValue("nome", cnpjData.razaoSocial || "")
    form.setValue("nomeFantasia", cnpjData.nomeFantasia || "")
    form.setValue("telefone", cnpjData.telefone || "")
    form.setValue("email", cnpjData.email || "")
    form.setValue("inscricaoEstadual", cnpjData.inscricoesEstaduais?.find(ie => ie.ativo)?.numero || "")

    // Preenche dados do endereço
    form.setValue("logradouro", cnpjData.logradouro || "")
    form.setValue("numero", cnpjData.numero || "")
    form.setValue("complemento", cnpjData.complemento || "")
    form.setValue("bairro", cnpjData.bairro || "")
    form.setValue("cep", typeof cnpjData.cep === 'string' ? cnpjData.cep.replace(/\D/g, '') : "")

    // Se tem UF, busca e seleciona o estado
    if (cnpjData.uf) {
      const estado = estados.find(e => e.uf === cnpjData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)

        // Se tem município, carrega municípios e seleciona
        if (cnpjData.municipio) {
          loadMunicipios(estado.id).then(() => {
            // Busca o município após carregar a lista
            AuxiliarService.getMunicipiosByEstado(estado.id).then(municipiosData => {
              const municipio = municipiosData.find(m =>
                m.nome.toLowerCase() === cnpjData.municipio?.toLowerCase()
              )
              if (municipio) {
                form.setValue("municipioId", municipio.id)
              }
            }).catch(error => {
              console.warn('Erro ao buscar municípios:', error)
            })
          }).catch(error => {
            console.warn('Erro ao carregar municípios:', error)
          })
        }
      }
    }
  }

  // Auto-preenchimento por CEP
  const handleCepDataLoaded = (cepData: CepData) => {
    if (!cepData) {
      console.warn('Dados do CEP não recebidos')
      return
    }

    // Preenche dados do endereço
    form.setValue("logradouro", cepData.logradouro || "")
    form.setValue("bairro", cepData.bairro || "")

    // Se tem UF, busca estado e município
    if (cepData.uf) {
      const estado = estados.find(e => e.uf === cepData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)

        // Se tem localidade, carrega municípios e seleciona
        if (cepData.localidade) {
          loadMunicipios(estado.id).then(() => {
            // Busca o município após carregar a lista
            AuxiliarService.getMunicipiosByEstado(estado.id).then(municipiosData => {
              const municipio = municipiosData.find(m =>
                m.nome.toLowerCase() === cepData.localidade?.toLowerCase()
              )
              if (municipio) {
                form.setValue("municipioId", municipio.id)
              }
            }).catch(error => {
              console.warn('Erro ao buscar municípios:', error)
            })
          }).catch(error => {
            console.warn('Erro ao carregar municípios:', error)
          })
        }
      }
    }
  }

  const loadCliente = async () => {
    if (!clienteId) return

    try {
      setLoading(true)
      const cliente = await ClienteService.getById(clienteId)
      form.reset({
        tipo: cliente.tipo,
        documento: cliente.documento,
        nome: cliente.nome,
        nomeFantasia: cliente.nomeFantasia || "",
        inscricaoEstadual: cliente.inscricaoEstadual || "",
        inscricaoMunicipal: cliente.inscricaoMunicipal || "",
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento || "",
        bairro: cliente.bairro,
        cep: cliente.cep,
        municipioId: cliente.municipioId,
        estadoId: cliente.estadoId,
        telefone: cliente.telefone || "",
        celular: cliente.celular || "",
        email: cliente.email || "",
        indicadorIE: cliente.indicadorIE || 9,
        ativo: cliente.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      toast.error("Erro ao carregar dados do cliente")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: ClienteFormValues) => {
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
      }

      console.log("Valores limpos:", cleanedValues)

      if (clienteId) {
        await ClienteService.update(clienteId, cleanedValues)
        toast.success("Cliente atualizado com sucesso!")
      } else {
        await ClienteService.create(cleanedValues)
        toast.success("Cliente criado com sucesso!")
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error)
      console.error("Valores que causaram erro:", values)
      toast.error(error.message || "Erro ao salvar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] sm:max-w-[90vw] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {clienteId ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {clienteId
              ? "Edite as informações do cliente abaixo"
              : "Preencha os dados para cadastrar um novo cliente"}
          </DialogDescription>
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
                  <TabsTrigger value="fiscal" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Dados Fiscais
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Dados Básicos */}
                <TabsContent value="dados-basicos" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Básicas
                      </CardTitle>
                      <CardDescription>
                        Dados principais do cliente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                {/* Documento CPF/CNPJ */}
                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <DocumentoInput
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                            // Detecta automaticamente o tipo baseado no documento
                            const numbers = value.replace(/\D/g, '')
                            if (numbers.length <= 11) {
                              form.setValue('tipo', 'FISICA')
                            } else if (numbers.length <= 14) {
                              form.setValue('tipo', 'JURIDICA')
                            }
                          }}
                          onDataLoaded={handleCnpjDataLoaded}
                          tipo="AUTO" // Detecção automática
                          autoFill={true} // Auto-preenchimento para CNPJ
                        />
                      </FormControl>
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
                        ? "Razão Social"
                        : "Nome"}
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
                      {/* Status Ativo */}
                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Cliente Ativo
                              </FormLabel>
                              <FormDescription>
                                Desative para impedir novas transações com este cliente
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
                      Localização do cliente
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
                      <CepInput
                        value={field.value}
                        onChange={field.onChange}
                        onDataLoaded={handleCepDataLoaded}
                      />
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
                          // Limpa o município quando o estado muda
                          form.setValue("municipioId", "")
                          // Carrega municípios do novo estado
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
                          {municipios.length === 0 && watchEstadoId ? (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              Carregando municípios...
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
                        {!watchEstadoId
                          ? "Selecione o estado primeiro"
                          : "Selecione o município"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem className="md:col-span-6">
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
                    <FormItem className="md:col-span-2">
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
                    <FormItem className="md:col-span-4">
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
                      <Input placeholder="Nome do bairro" {...field} />
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
                      Telefones e email do cliente
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
                              Telefone fixo do cliente
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
                              Telefone celular do cliente
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
                              placeholder="email@exemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Email principal para comunicação e envio de documentos fiscais
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Dados Fiscais */}
              <TabsContent value="fiscal" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Dados Fiscais
                    </CardTitle>
                    <CardDescription>
                      Informações fiscais e tributárias
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {form.watch("documento")?.replace(/\D/g, '').length > 11 && (
                      <>
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
                                  Inscrição estadual da empresa (se aplicável)
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
                                  <Input placeholder="000000000" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Inscrição municipal da empresa (se aplicável)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="indicadorIE"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Indicador de Inscrição Estadual</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o indicador" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Contribuinte ICMS</SelectItem>
                                  <SelectItem value="2">2 - Contribuinte isento</SelectItem>
                                  <SelectItem value="9">9 - Não Contribuinte</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Indica a situação do cliente em relação ao ICMS
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {form.watch("documento")?.replace(/\D/g, '').length <= 11 && (
                      <div className="flex items-center justify-center p-8 text-center">
                        <div className="space-y-2">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Dados fiscais são aplicáveis apenas para pessoas jurídicas (CNPJ)
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant={clienteId ? "secondary" : "default"} className="mr-2">
                  {clienteId ? "Edição" : "Novo"}
                </Badge>
                {clienteId ? "Editando cliente existente" : "Criando novo cliente"}
              </div>
              {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
                <div className="flex items-center text-sm text-destructive">
                  <Badge variant="destructive" className="mr-2">
                    {Object.keys(form.formState.errors).length}
                  </Badge>
                  {Object.keys(form.formState.errors).length === 1
                    ? "erro encontrado"
                    : "erros encontrados"}
                </div>
              )}
              {form.formState.isDirty && !loading && (
                <div className="flex items-center text-sm text-amber-600">
                  <Badge variant="outline" className="mr-2 border-amber-600 text-amber-600">
                    !
                  </Badge>
                  Há alterações não salvas
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 sm:flex-none min-w-[100px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                onClick={form.handleSubmit(onSubmit)}
                className="flex-1 sm:flex-none min-w-[140px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  <>
                    {clienteId ? "💾 Atualizar" : "✨ Criar Cliente"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
