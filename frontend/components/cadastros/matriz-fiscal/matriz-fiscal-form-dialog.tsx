"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { MatrizFiscalService, type MatrizFiscal } from "@/lib/services/matriz-fiscal.service"
import { NaturezaOperacaoCombobox } from "@/components/shared/combobox/natureza-operacao-combobox"
import { NCMCombobox } from "@/components/shared/combobox/ncm-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"
import { CSOSNCombobox } from "@/components/shared/combobox/csosn-combobox"

const matrizFiscalSchema = z.object({
  // Identificação
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),

  // Condições
  naturezaOperacaoId: z.string().optional(),
  ufOrigem: z.string().optional(),
  ufDestino: z.string().optional(),
  tipoCliente: z.enum(["contribuinte", "nao_contribuinte", "exterior"]).optional(),
  ncmId: z.string().optional(),
  regimeTributario: z.number().optional(),

  // Resultado
  cfopId: z.string().min(1, "CFOP é obrigatório"),

  // ICMS
  icmsCstId: z.string().optional(),
  icmsCsosnId: z.string().optional(),
  icmsAliquota: z.number().min(0).max(100).optional(),
  icmsReducao: z.number().min(0).max(100).optional(),
  icmsModalidadeBC: z.number().optional(),

  // ICMS ST
  icmsStAliquota: z.number().min(0).max(100).optional(),
  icmsStReducao: z.number().min(0).max(100).optional(),
  icmsStModalidadeBC: z.number().optional(),
  icmsStMva: z.number().min(0).max(100).optional(),

  // IPI
  ipiCstId: z.string().optional(),
  ipiAliquota: z.number().min(0).max(100).optional(),

  // PIS
  pisCstId: z.string().optional(),
  pisAliquota: z.number().min(0).max(100).optional(),

  // COFINS
  cofinsCstId: z.string().optional(),
  cofinsAliquota: z.number().min(0).max(100).optional(),

  // Controle
  prioridade: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
})

type MatrizFiscalFormData = z.infer<typeof matrizFiscalSchema>

interface MatrizFiscalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  matriz?: MatrizFiscal | null
  onSuccess: () => void
}

export function MatrizFiscalFormDialog({
  open,
  onOpenChange,
  matriz,
  onSuccess,
}: MatrizFiscalFormDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<MatrizFiscalFormData>({
    resolver: zodResolver(matrizFiscalSchema),
    defaultValues: {
      codigo: "",
      descricao: "",
      cfopId: "",
      prioridade: 0,
      ativo: true,
    },
  })

  // Carregar dados da matriz ao editar
  useEffect(() => {
    if (matriz && open) {
      form.reset({
        codigo: matriz.codigo,
        descricao: matriz.descricao,
        naturezaOperacaoId: matriz.naturezaOperacaoId || undefined,
        ufOrigem: matriz.ufOrigem || undefined,
        ufDestino: matriz.ufDestino || undefined,
        tipoCliente: matriz.tipoCliente || undefined,
        ncmId: matriz.ncmId || undefined,
        regimeTributario: matriz.regimeTributario || undefined,
        cfopId: matriz.cfopId,
        icmsCstId: matriz.icmsCstId || undefined,
        icmsCsosnId: matriz.icmsCsosnId || undefined,
        icmsAliquota: matriz.icmsAliquota || undefined,
        icmsReducao: matriz.icmsReducao || undefined,
        icmsModalidadeBC: matriz.icmsModalidadeBC || undefined,
        icmsStAliquota: matriz.icmsStAliquota || undefined,
        icmsStReducao: matriz.icmsStReducao || undefined,
        icmsStModalidadeBC: matriz.icmsStModalidadeBC || undefined,
        icmsStMva: matriz.icmsStMva || undefined,
        ipiCstId: matriz.ipiCstId || undefined,
        ipiAliquota: matriz.ipiAliquota || undefined,
        pisCstId: matriz.pisCstId || undefined,
        pisAliquota: matriz.pisAliquota || undefined,
        cofinsCstId: matriz.cofinsCstId || undefined,
        cofinsAliquota: matriz.cofinsAliquota || undefined,
        prioridade: matriz.prioridade,
        ativo: matriz.ativo,
      })
    } else if (!open) {
      form.reset()
    }
  }, [matriz, open, form])

  const onSubmit = async (data: MatrizFiscalFormData) => {
    try {
      setLoading(true)

      if (matriz) {
        await MatrizFiscalService.update(matriz.id, data)
        toast.success("Matriz fiscal atualizada com sucesso!")
      } else {
        await MatrizFiscalService.create(data)
        toast.success("Matriz fiscal criada com sucesso!")
      }

      onSuccess()
    } catch (error: any) {
      console.error("Erro ao salvar matriz fiscal:", error)
      toast.error(error.message || "Erro ao salvar matriz fiscal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {matriz ? "Editar Matriz Fiscal" : "Nova Matriz Fiscal"}
          </DialogTitle>
          <DialogDescription>
            Configure as regras de tributação automática
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="identificacao" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="identificacao">Identificação</TabsTrigger>
                <TabsTrigger value="condicoes">Condições</TabsTrigger>
                <TabsTrigger value="impostos">Impostos</TabsTrigger>
                <TabsTrigger value="controle">Controle</TabsTrigger>
              </TabsList>

              {/* Tab: Identificação */}
              <TabsContent value="identificacao" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: VENDA-SP-SP" {...field} />
                        </FormControl>
                        <FormDescription>
                          Código único para identificar a matriz
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cfopId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CFOP *</FormLabel>
                        <CFOPCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                        <FormDescription>
                          CFOP que será aplicado
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
                        <Input
                          placeholder="Ex: Venda dentro do estado para contribuinte"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Tab: Condições */}
              <TabsContent value="condicoes" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Defina quando esta matriz será aplicada. Campos vazios = qualquer valor
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="naturezaOperacaoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Natureza da Operação</FormLabel>
                          <NaturezaOperacaoCombobox
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormDescription>
                            Deixe vazio para aplicar em qualquer natureza
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ncmId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NCM</FormLabel>
                          <NCMCombobox
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormDescription>
                            Deixe vazio para aplicar em qualquer NCM
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="ufOrigem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF Origem</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Qualquer</SelectItem>
                              <SelectItem value="SP">SP</SelectItem>
                              <SelectItem value="RJ">RJ</SelectItem>
                              <SelectItem value="MG">MG</SelectItem>
                              <SelectItem value="ES">ES</SelectItem>
                              <SelectItem value="PR">PR</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="RS">RS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ufDestino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF Destino</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Qualquer</SelectItem>
                              <SelectItem value="SP">SP</SelectItem>
                              <SelectItem value="RJ">RJ</SelectItem>
                              <SelectItem value="MG">MG</SelectItem>
                              <SelectItem value="ES">ES</SelectItem>
                              <SelectItem value="PR">PR</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="RS">RS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipoCliente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Cliente</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Qualquer</SelectItem>
                              <SelectItem value="contribuinte">Contribuinte ICMS</SelectItem>
                              <SelectItem value="nao_contribuinte">Não Contribuinte</SelectItem>
                              <SelectItem value="exterior">Exterior</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="regimeTributario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime Tributário</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Qualquer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Qualquer</SelectItem>
                            <SelectItem value="1">Simples Nacional</SelectItem>
                            <SelectItem value="2">Lucro Presumido</SelectItem>
                            <SelectItem value="3">Lucro Real</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Regime tributário do emitente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Tab: Impostos - será implementado na próxima parte */}
              <TabsContent value="impostos" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Impostos serão implementados...
                </p>
              </TabsContent>

              {/* Tab: Controle - será implementado na próxima parte */}
              <TabsContent value="controle" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Controle será implementado...
                </p>
              </TabsContent>
            </Tabs>

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {matriz ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

