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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ProdutoService } from "@/lib/services/produto.service"
import { AuxiliarService, type NCM, type CEST } from "@/lib/services/auxiliar.service"
import { FornecedorService, type Fornecedor } from "@/lib/services/fornecedor.service"
import { NCMCombobox } from "@/components/shared/combobox/ncm-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"
import { CSOSNCombobox } from "@/components/shared/combobox/csosn-combobox"

type FornecedorSelect = {
  id: string
  nome: string
  documento: string
}
import { toast } from "sonner"
import { Package, Receipt, Warehouse, Settings } from "lucide-react"

const produtoFormSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  codigoBarras: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  descricaoComplementar: z.string().optional(),
  ncmId: z.string().min(1, "NCM é obrigatório"),
  cestId: z.string().optional(),
  cfopId: z.string().optional(),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  unidadeTributavel: z.string().optional(),
  valorUnitario: z.number().min(0, "Valor deve ser positivo"),
  valorCusto: z.number().min(0, "Valor deve ser positivo").optional(),
  margemLucro: z.number().min(0, "Margem deve ser positiva").optional(),
  estoqueAtual: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMinimo: z.number().min(0, "Estoque deve ser positivo").optional(),
  estoqueMaximo: z.number().min(0, "Estoque deve ser positivo").optional(),
  origem: z.string().min(1, "Origem é obrigatória"),
  // ICMS
  icmsCstId: z.string().optional(),
  icmsCsosnId: z.string().optional(),
  icmsAliquota: z.number().min(0).max(100).optional(),
  icmsReducao: z.number().min(0).max(100).optional(),
  // PIS
  pisCstId: z.string().optional(),
  pisAliquota: z.number().min(0).max(100).optional(),
  // COFINS
  cofinsCstId: z.string().optional(),
  cofinsAliquota: z.number().min(0).max(100).optional(),
  // IPI
  ipiCstId: z.string().optional(),
  ipiAliquota: z.number().min(0).max(100).optional(),
  fornecedorId: z.string().optional(),
  ativo: z.boolean().default(true),
}).refine((data) => {
  // Validar que pelo menos um entre icmsCstId ou icmsCsosnId deve estar preenchido
  return data.icmsCstId || data.icmsCsosnId
}, {
  message: "Selecione CST ou CSOSN para ICMS",
  path: ["icmsCstId"],
})

type ProdutoFormValues = z.infer<typeof produtoFormSchema>

interface ProdutoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produtoId?: string
  onSuccess?: (produto?: any) => void
}

export function ProdutoFormDialog({
  open,
  onOpenChange,
  produtoId,
  onSuccess,
}: ProdutoFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [cests, setCests] = useState<CEST[]>([])
  const [fornecedores, setFornecedores] = useState<FornecedorSelect[]>([])
  const [emitente, setEmitente] = useState<any>(null)
  const [accordionValue, setAccordionValue] = useState<string[]>([])

  const form = useForm({
    resolver: zodResolver(produtoFormSchema),
    mode: "onBlur",
    defaultValues: {
      codigo: "",
      codigoBarras: "",
      descricao: "",
      descricaoComplementar: "",
      ncmId: "",
      cestId: "",
      cfopId: "",
      unidade: "UN",
      unidadeTributavel: "",
      valorUnitario: 0,
      valorCusto: 0,
      margemLucro: 0,
      estoqueAtual: 0,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      origem: "0",
      icmsCstId: "",
      icmsCsosnId: "",
      icmsAliquota: 0,
      icmsReducao: 0,
      pisCstId: "",
      pisAliquota: 0,
      cofinsCstId: "",
      cofinsAliquota: 0,
      ipiCstId: "",
      ipiAliquota: 0,
      fornecedorId: "",
      ativo: true,
    },
  })

  useEffect(() => {
    loadAuxiliares()
  }, [])

  useEffect(() => {
    if (open && produtoId) {
      loadProduto()
    } else if (open) {
      form.reset()
    }
  }, [open, produtoId])

  const loadAuxiliares = async () => {
    try {
      const { EmitenteService } = await import("@/lib/services/emitente.service")

      const [cestsData, fornecedoresData, emitenteData] = await Promise.all([
        AuxiliarService.getCESTs(),
        FornecedorService.getForSelect(),
        EmitenteService.getEmitenteAtivo(),
      ])

      setCests(cestsData)
      setFornecedores(fornecedoresData)
      setEmitente(emitenteData)

      // Pré-selecionar valores padrão baseado no regime tributário
      if (!produtoId && emitenteData) {
        // PIS e COFINS padrão (código 01)
        const [cstsPIS, cstsCOFINS, csosns, cstsICMS] = await Promise.all([
          AuxiliarService.getCSTs('PIS'),
          AuxiliarService.getCSTs('COFINS'),
          emitenteData.regimeTributario === 1 ? AuxiliarService.getCSOSNs() : Promise.resolve([]),
          emitenteData.regimeTributario !== 1 ? AuxiliarService.getCSTs('ICMS') : Promise.resolve([]),
        ])

        const cstPISPadrao = cstsPIS.find((c: any) => c.codigo === '01')
        const cstCOFINSPadrao = cstsCOFINS.find((c: any) => c.codigo === '01')

        if (cstPISPadrao) form.setValue('pisCstId', cstPISPadrao.id)
        if (cstCOFINSPadrao) form.setValue('cofinsCstId', cstCOFINSPadrao.id)

        // Se Simples Nacional, pré-selecionar CSOSN 102
        if (emitenteData.regimeTributario === 1) {
          const csosnPadrao = csosns.find((c: any) => c.codigo === '102')
          if (csosnPadrao) form.setValue('icmsCsosnId', csosnPadrao.id)
        } else {
          // Senão, pré-selecionar CST 00
          const cstICMSPadrao = cstsICMS.find((c: any) => c.codigo === '00')
          if (cstICMSPadrao) form.setValue('icmsCstId', cstICMSPadrao.id)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados auxiliares:", error)
      toast.error("Erro ao carregar dados auxiliares")
    }
  }

  const loadProduto = async () => {
    if (!produtoId) return

    try {
      setLoading(true)
      const produto = await ProdutoService.getById(produtoId)
      form.reset({
        codigo: produto.codigo,
        codigoBarras: produto.codigoBarras || "",
        descricao: produto.descricao,
        descricaoComplementar: produto.descricaoComplementar || "",
        ncmId: produto.ncmId,
        cestId: produto.cestId || "",
        cfopId: produto.cfopId || "",
        unidade: produto.unidade,
        unidadeTributavel: produto.unidadeTributavel || "",
        valorUnitario: produto.valorUnitario,
        valorCusto: produto.valorCusto || 0,
        margemLucro: produto.margemLucro || 0,
        estoqueAtual: produto.estoqueAtual,
        estoqueMinimo: produto.estoqueMinimo || 0,
        estoqueMaximo: produto.estoqueMaximo || 0,
        origem: produto.origem,
        icmsCstId: produto.icmsCstId || "",
        icmsCsosnId: produto.icmsCsosnId || "",
        icmsAliquota: produto.icmsAliquota || 0,
        icmsReducao: produto.icmsReducao || 0,
        pisCstId: produto.pisCstId || "",
        pisAliquota: produto.pisAliquota || 0,
        cofinsCstId: produto.cofinsCstId || "",
        cofinsAliquota: produto.cofinsAliquota || 0,
        ipiCstId: produto.ipiCstId || "",
        ipiAliquota: produto.ipiAliquota || 0,
        fornecedorId: produto.fornecedorId || "",
        ativo: produto.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      toast.error("Erro ao carregar dados do produto")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: ProdutoFormValues) => {
    try {
      setLoading(true)

      // Limpar campos vazios (converter "" para undefined para campos opcionais)
      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
        // Campos obrigatórios que sempre devem ser enviados
        const requiredFields = ['codigo', 'descricao', 'valorUnitario', 'unidade', 'ncmId', 'origem', 'ativo']

        // Se for campo obrigatório, sempre incluir
        if (requiredFields.includes(key)) {
          acc[key] = value
          return acc
        }

        // Para campos opcionais:
        // - String vazia: não incluir (será undefined no backend)
        // - Número zero: não incluir (será undefined no backend)
        // - Outros valores: incluir
        if (value === "" || value === 0) {
          return acc
        }

        acc[key] = value
        return acc
      }, {} as any)

      let produto
      if (produtoId) {
        produto = await ProdutoService.update(produtoId, cleanedValues)
        toast.success("Produto atualizado com sucesso!")
      } else {
        produto = await ProdutoService.create(cleanedValues)
        toast.success("Produto criado com sucesso!")
      }

      onSuccess?.(produto)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error)
      toast.error(error.message || "Erro ao salvar produto")
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
                {produtoId ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {produtoId
                  ? "Edite as informações do produto abaixo"
                  : "Preencha os dados para cadastrar um novo produto"}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold">Dados Básicos</h3>
                        <p className="text-sm text-muted-foreground">Informações principais do produto</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="codigo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: PROD001" {...field} />
                              </FormControl>
                              <FormDescription>
                                Código interno do produto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="codigoBarras"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código de Barras</FormLabel>
                              <FormControl>
                                <Input placeholder="EAN-13" {...field} />
                              </FormControl>
                              <FormDescription>
                                Código de barras (EAN)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do produto" {...field} />
                            </FormControl>
                            <FormDescription>
                              Descrição principal do produto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descricaoComplementar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição Complementar</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Informações adicionais sobre o produto..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Detalhes adicionais do produto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ncmId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NCM *</FormLabel>
                              <NCMCombobox
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Selecione o NCM"
                              />
                              <FormDescription>
                                Nomenclatura Comum do Mercosul
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cestId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CEST</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o CEST (opcional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {cests.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                      Carregando CESTs...
                                    </div>
                                  ) : (
                                    cests.map((cest) => (
                                      <SelectItem key={cest.id} value={cest.id}>
                                        {cest.codigo} - {cest.descricao}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Código Especificador da ST
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cfopId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CFOP Padrão</FormLabel>
                              <CFOPCombobox
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Selecione o CFOP (opcional)"
                              />
                              <FormDescription>
                                CFOP padrão para este produto (pode ser sobrescrito pela natureza da operação)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="unidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidade *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unidade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="UN">UN - Unidade</SelectItem>
                                  <SelectItem value="PC">PC - Peça</SelectItem>
                                  <SelectItem value="KG">KG - Quilograma</SelectItem>
                                  <SelectItem value="MT">MT - Metro</SelectItem>
                                  <SelectItem value="LT">LT - Litro</SelectItem>
                                  <SelectItem value="CX">CX - Caixa</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Unidade de medida
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="valorCusto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor de Custo</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0,00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Custo do produto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="valorUnitario"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor de Venda *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0,00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Preço de venda
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="fornecedorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fornecedor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o fornecedor (opcional)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {fornecedores.length === 0 ? (
                                  <div className="p-2 text-sm text-muted-foreground text-center">
                                    Carregando fornecedores...
                                  </div>
                                ) : (
                                  fornecedores.map((fornecedor) => (
                                    <SelectItem key={fornecedor.id} value={fornecedor.id}>
                                      {fornecedor.nome}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Fornecedor principal do produto
                            </FormDescription>
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
                              <FormLabel className="text-base">
                                Produto Ativo
                              </FormLabel>
                              <FormDescription>
                                Desative para impedir vendas deste produto
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

                {/* Tab: Tributação */}
                <TabsContent value="tributacao" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Informações Tributárias
                      </CardTitle>
                      <CardDescription>
                        Configurações fiscais do produto
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Origem */}
                      <FormField
                        control={form.control}
                        name="origem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origem da Mercadoria *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a origem" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">0 - Nacional</SelectItem>
                                <SelectItem value="1">1 - Estrangeira - Importação direta</SelectItem>
                                <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno</SelectItem>
                                <SelectItem value="3">3 - Nacional com mais de 40% de conteúdo estrangeiro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      {/* ICMS */}
                      <div className="space-y-4">
                        <h4 className="font-medium">ICMS</h4>

                        {emitente?.regimeTributario === 1 ? (
                          // Simples Nacional - Mostrar CSOSN
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="icmsCsosnId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CSOSN *</FormLabel>
                                  <CSOSNCombobox
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Selecione o CSOSN"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="icmsAliquota"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Alíquota ICMS (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          // Regime Normal - Mostrar CST
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="icmsCstId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CST ICMS *</FormLabel>
                                  <CSTCombobox
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    tipo="ICMS"
                                    placeholder="Selecione o CST ICMS"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="icmsAliquota"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Alíquota ICMS (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="icmsReducao"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Redução Base (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* PIS */}
                      <div className="space-y-4">
                        <h4 className="font-medium">PIS</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pisCstId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CST PIS</FormLabel>
                                <CSTCombobox
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  tipo="PIS"
                                  placeholder="Selecione o CST PIS"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pisAliquota"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Alíquota PIS (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* COFINS */}
                      <div className="space-y-4">
                        <h4 className="font-medium">COFINS</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cofinsCstId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CST COFINS</FormLabel>
                                <CSTCombobox
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  tipo="COFINS"
                                  placeholder="Selecione o CST COFINS"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cofinsAliquota"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Alíquota COFINS (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* IPI */}
                      <div className="space-y-4">
                        <h4 className="font-medium">IPI</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="ipiCstId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CST IPI</FormLabel>
                                <CSTCombobox
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  tipo="IPI"
                                  placeholder="Selecione o CST IPI"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="ipiAliquota"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Alíquota IPI (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Estoque */}
                <TabsContent value="estoque" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        Valores e Estoque
                      </CardTitle>
                      <CardDescription>
                        Informações de preço e controle de estoque
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Valores e Estoque</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="unidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valorUnitario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Unitário</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valorCusto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Custo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="estoqueAtual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Atual</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estoqueMinimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estoqueMaximo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Máximo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Outros */}
                <TabsContent value="outros" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Fornecedor e Status
                      </CardTitle>
                      <CardDescription>
                        Informações adicionais do produto
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fornecedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fornecedores.map((fornecedor) => (
                          <SelectItem key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome} - {fornecedor.documento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

                      <Separator />

                      {/* Status */}
                      <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Produto Ativo</FormLabel>
                    <FormDescription>
                      Produto pode ser usado em novas transações
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
              </Tabs>

              <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : produtoId
                  ? "Atualizar"
                  : "Criar"}
              </Button>
            </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
