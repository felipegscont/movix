"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react"
import { toast } from "sonner"
import { MatrizFiscalService, type MatrizFiscal } from "@/lib/services/matriz-fiscal.service"
import { NCMCombobox } from "@/components/shared/combobox/ncm-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"
import { CSOSNCombobox } from "@/components/shared/combobox/csosn-combobox"
import { ProdutoCombobox } from "@/components/shared/combobox/produto-combobox"
import { EstadoCombobox } from "@/components/shared/combobox/estado-combobox"
import {
  StaticCombobox,
  IMPOSTO_TAXA_OPTIONS,
  SE_APLICA_A_OPTIONS,
  MODELO_NF_OPTIONS,
  REGIME_FISCAL_OPTIONS,
  TIPO_ITEM_OPTIONS,
} from "@/components/shared/combobox/static-combobox"

const matrizFiscalSchema = z.object({
  // Dados Gerais
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().min(1, "Nome é obrigatório"),
  seAplicaA: z.enum(["produtos", "servicos"]).optional(),
  modeloNF: z.string().optional(),
  regimeTributario: z.number().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),

  // Filtros
  ufDestino: z.string().optional(),
  produtoId: z.string().optional(),
  cfopId: z.string().optional(),
  tipoItem: z.enum(["produto", "servico"]).optional(),
  ncmId: z.string().optional(),

  // Definições Fiscais - CST/CSOSN (dinâmico baseado no imposto)
  cstId: z.string().optional(), // CST genérico (ICMS, PIS, COFINS, IPI)
  csosnId: z.string().optional(), // CSOSN (apenas ICMS Simples Nacional)

  // Alíquotas
  aliquota: z.number().min(0).max(100).optional(),
  reducaoBC: z.number().min(0).max(100).optional(),
  fcp: z.number().min(0).max(100).optional(),

  // Controle
  prioridade: z.number().min(0).optional(),
  ativo: z.boolean().optional(),
})

type MatrizFiscalFormData = z.infer<typeof matrizFiscalSchema>

interface MatrizFiscalFormProps {
  matrizId?: string
}

export function MatrizFiscalForm({ matrizId }: MatrizFiscalFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!!matrizId)

  const form = useForm<MatrizFiscalFormData>({
    resolver: zodResolver(matrizFiscalSchema),
    defaultValues: {
      codigo: "ICMS",
      descricao: "",
      seAplicaA: "produtos",
      modeloNF: "nfe",
      regimeTributario: 1,
      dataInicio: "",
      dataFim: "",
      prioridade: 0,
      ativo: true,
    },
  })

  // Observar mudanças no campo de imposto
  const impostoSelecionado = form.watch("codigo")
  const regimeTributario = form.watch("regimeTributario")

  // Determinar se deve mostrar CST ou CSOSN
  const mostrarCSOSN = impostoSelecionado === "ICMS" && regimeTributario === 1

  // Determinar quais campos mostrar baseado no imposto
  const mostrarEstadoDestino = ["ICMS", "IPI"].includes(impostoSelecionado)
  const mostrarNCM = ["ICMS", "IPI", "PIS", "COFINS"].includes(impostoSelecionado)
  const mostrarFCP = impostoSelecionado === "ICMS"
  const mostrarReducaoBC = impostoSelecionado === "ICMS"

  // ISSQN tem campos específicos
  const isISSQN = impostoSelecionado === "ISSQN"

  useEffect(() => {
    if (matrizId) {
      loadMatriz()
    }
  }, [matrizId])

  const loadMatriz = async () => {
    try {
      setLoadingData(true)
      const matriz = await MatrizFiscalService.getById(matrizId!)
      
      form.reset({
        codigo: matriz.codigo,
        descricao: matriz.descricao,
        seAplicaA: matriz.seAplicaA as "produtos" | "servicos" | undefined,
        modeloNF: matriz.modeloNF || undefined,
        regimeTributario: matriz.regimeTributario || undefined,
        dataInicio: matriz.dataInicio || undefined,
        dataFim: matriz.dataFim || undefined,
        ufDestino: matriz.ufDestino || undefined,
        produtoId: matriz.produtoId || undefined,
        cfopId: matriz.cfopId || undefined,
        tipoItem: matriz.tipoItem as "produto" | "servico" | undefined,
        ncmId: matriz.ncmId || undefined,
        cstId: matriz.cstId || undefined,
        csosnId: matriz.csosnId || undefined,
        aliquota: matriz.aliquota || undefined,
        reducaoBC: matriz.reducaoBC || undefined,
        fcp: matriz.fcp || undefined,
        prioridade: matriz.prioridade,
        ativo: matriz.ativo,
      })
    } catch (error: any) {
      console.error("Erro ao carregar matriz fiscal:", error)
      toast.error("Erro ao carregar matriz fiscal")
      router.push("/matrizes-fiscais")
    } finally {
      setLoadingData(false)
    }
  }

  const onSubmit = async (data: MatrizFiscalFormData) => {
    try {
      setLoading(true)

      console.log('Dados do formulário (antes da limpeza):', data)

      // Limpar campos vazios e valores inválidos
      const cleanData = Object.fromEntries(
        Object.entries(data)
          .map(([key, value]) => {
            // Converter "" para undefined
            if (value === "") return [key, undefined]
            // Remover "todos" do tipoItem
            if (key === "tipoItem" && value === "todos") return [key, undefined]
            return [key, value]
          })
          .filter(([_, value]) => value !== undefined) // Remover campos undefined
      ) as MatrizFiscalFormData

      console.log('Dados limpos (depois da limpeza):', cleanData)

      if (matrizId) {
        await MatrizFiscalService.update(matrizId, cleanData as any)
        toast.success("Matriz fiscal atualizada com sucesso!")
      } else {
        await MatrizFiscalService.create(cleanData as any)
        toast.success("Matriz fiscal criada com sucesso!")
      }

      router.push("/matrizes-fiscais")
    } catch (error: any) {
      console.error("Erro ao salvar matriz fiscal:", error)
      toast.error(error.message || "Erro ao salvar matriz fiscal")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full">
        {/* Dados Gerais */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Linha 1 - Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel className="text-xs">Imposto/Taxa</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={IMPOSTO_TAXA_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecione"
                        className="h-9 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-8">
                    <FormLabel className="text-xs">Nome</FormLabel>
                    <FormControl>
                      <Input className="h-9 w-full" placeholder="ICMS Padrão (NF-e)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modeloNF"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel className="text-xs">Modelo da NF</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={MODELO_NF_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecione"
                        className="h-9 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Linha 2 - Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              <FormField
                control={form.control}
                name="seAplicaA"
                render={({ field }) => (
                  <FormItem className="lg:col-span-3">
                    <FormLabel className="text-xs">Se aplica a</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={SE_APLICA_A_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecione"
                        className="h-9 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2 lg:col-span-6">
                <FormLabel className="text-xs">Vigência</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  <FormField
                    control={form.control}
                    name="dataInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="h-9 w-full" type="date" placeholder="De" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataFim"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="h-9 w-full" type="date" placeholder="Até" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="regimeTributario"
                render={({ field }) => (
                  <FormItem className="lg:col-span-3">
                    <FormLabel className="text-xs">Regime Fiscal</FormLabel>
                    <FormControl>
                      <StaticCombobox
                        options={REGIME_FISCAL_OPTIONS}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as number)}
                        placeholder="Selecione"
                        className="h-9 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Switch Homologação */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                  <FormLabel className="text-xs font-normal">
                    Utilizar matriz fiscal para emissão em homologação
                  </FormLabel>
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

        {/* Filtros */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isISSQN ? (
              /* ISSQN - Apenas Atividade Principal */
              <FormField
                control={form.control}
                name="produtoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Atividade Principal</FormLabel>
                    <ProdutoCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                {/* Linha 1 - Responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mostrarEstadoDestino && (
                    <FormField
                      control={form.control}
                      name="ufDestino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Estado do Destinatário</FormLabel>
                          <FormControl>
                            <EstadoCombobox
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Selecione o estado"
                              className="h-9 w-full"
                              returnUf={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="cfopId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">CFOP</FormLabel>
                        <CFOPCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoItem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tipo de Item</FormLabel>
                        <FormControl>
                          <StaticCombobox
                            options={TIPO_ITEM_OPTIONS}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione"
                            className="h-9 w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Linha 2 - Responsivo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <FormField
                    control={form.control}
                    name="produtoId"
                    render={({ field }) => (
                      <FormItem className={mostrarNCM ? "lg:col-span-8" : "lg:col-span-12"}>
                        <FormLabel className="text-xs">Código do Produto/Serviço</FormLabel>
                        <ProdutoCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mostrarNCM && (
                    <FormField
                      control={form.control}
                      name="ncmId"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-4">
                          <FormLabel className="text-xs">Código NCM</FormLabel>
                          <NCMCombobox
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Definições Fiscais */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Definições Fiscais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* CST ou CSOSN */}
            {mostrarCSOSN ? (
              <FormField
                control={form.control}
                name="csosnId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">CSOSN (Simples Nacional)</FormLabel>
                    <CSOSNCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="cstId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      CST {impostoSelecionado ? `(${impostoSelecionado})` : ""}
                    </FormLabel>
                    <CSTCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      tipo={impostoSelecionado as "ICMS" | "PIS" | "COFINS" | "IPI"}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Alíquotas - Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="aliquota"
                render={({ field }) => (
                  <FormItem className={!mostrarReducaoBC && !mostrarFCP ? "sm:col-span-2 lg:col-span-3" : ""}>
                    <FormLabel className="text-xs">Alíquota</FormLabel>
                    <FormControl>
                      <Input
                        className="h-9 w-full"
                        type="number"
                        step="0.0001"
                        placeholder="0,0000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mostrarReducaoBC && (
                <FormField
                  control={form.control}
                  name="reducaoBC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Redução BC (%)</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9 w-full"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mostrarFCP && (
                <FormField
                  control={form.control}
                  name="fcp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Percentual para FCP (NT2016.002)</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9 w-full"
                          type="number"
                          step="0.0001"
                          placeholder="0,0000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-7 w-full sm:w-auto"
            onClick={() => router.push("/matrizes-fiscais")}
            disabled={loading}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" className="h-7 w-full sm:w-auto" disabled={loading}>
            {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            {matrizId ? "Salvar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

