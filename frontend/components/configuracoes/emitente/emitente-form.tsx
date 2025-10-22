"use client"

import { useEffect, useState } from "react"
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
import { IconLoader2, IconDeviceFloppy, IconAlertCircle, IconSearch } from "@tabler/icons-react"
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
      try {
        const emitente = await EmitenteService.getEmitenteAtivo()
        setEmitenteId(emitente.id)
        
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
      } catch (error) {
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
      setLoading(true)

      if (emitenteId) {
        await EmitenteService.update(emitenteId, data)
        toast.success("Emitente atualizado com sucesso!")
      } else {
        const emitente = await EmitenteService.create(data)
        setEmitenteId(emitente.id)
        toast.success("Emitente cadastrado com sucesso!")
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

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
            <TabsTrigger value="nfe">Configurações NFe</TabsTrigger>
          </TabsList>

          {/* Aba Dados Básicos */}
          <TabsContent value="dados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Informações básicas do emitente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Endereço */}
          <TabsContent value="endereco" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Localização da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                              <SelectValue placeholder="Selecione o estado primeiro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {municipios.map((municipio) => (
                              <SelectItem key={municipio.id} value={municipio.id}>
                                {municipio.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Contato */}
          <TabsContent value="contato" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Dados para contato (opcionais)</CardDescription>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Configurações NFe */}
          <TabsContent value="nfe" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de NFe</CardTitle>
                <CardDescription>Parâmetros para emissão de Notas Fiscais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Alert>
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertTitle>Certificado Digital</AlertTitle>
                  <AlertDescription>
                    O upload e configuração do certificado digital será implementado em breve.
                    Por enquanto, configure apenas os dados básicos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

