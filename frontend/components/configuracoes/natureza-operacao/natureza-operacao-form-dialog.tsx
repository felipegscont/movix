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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconDeviceFloppy, IconLoader2, IconX } from "@tabler/icons-react"
import { toast } from "sonner"
import { NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"

const naturezaOperacaoFormSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório").max(10, "Código deve ter no máximo 10 caracteres"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  cfopDentroEstadoId: z.string().optional().or(z.literal("").transform(() => undefined)),
  cfopForaEstadoId: z.string().optional().or(z.literal("").transform(() => undefined)),
  cfopExteriorId: z.string().optional().or(z.literal("").transform(() => undefined)),
  tipoOperacao: z.number().min(0).max(1),
  finalidade: z.number().min(1).max(4),
  consumidorFinal: z.number().min(0).max(1),
  presencaComprador: z.number().min(0).max(9),
  informacoesAdicionaisPadrao: z.string().optional(),
  ativo: z.boolean().default(true),
})

type NaturezaOperacaoFormValues = z.infer<typeof naturezaOperacaoFormSchema>

interface NaturezaOperacaoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  naturezaId?: string
  onSuccess?: () => void
}

export function NaturezaOperacaoFormDialog({
  open,
  onOpenChange,
  naturezaId,
  onSuccess,
}: NaturezaOperacaoFormDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<NaturezaOperacaoFormValues>({
    resolver: zodResolver(naturezaOperacaoFormSchema),
    mode: "onBlur",
    defaultValues: {
      codigo: "",
      descricao: "",
      cfopDentroEstadoId: "",
      cfopForaEstadoId: "",
      cfopExteriorId: "",
      tipoOperacao: 1, // Saída
      finalidade: 1, // Normal
      consumidorFinal: 1, // Sim
      presencaComprador: 1, // Presencial
      informacoesAdicionaisPadrao: "",
      ativo: true,
    },
  })

  useEffect(() => {
    if (open && naturezaId) {
      loadNatureza()
    } else if (open) {
      form.reset()
    }
  }, [open, naturezaId])

  const loadNatureza = async () => {
    if (!naturezaId) return

    try {
      setLoading(true)
      const natureza = await NaturezaOperacaoService.getById(naturezaId)
      
      form.reset({
        codigo: natureza.codigo,
        descricao: natureza.descricao,
        cfopDentroEstadoId: natureza.cfopDentroEstadoId || "",
        cfopForaEstadoId: natureza.cfopForaEstadoId || "",
        cfopExteriorId: natureza.cfopExteriorId || "",
        tipoOperacao: natureza.tipoOperacao,
        finalidade: natureza.finalidade,
        consumidorFinal: natureza.consumidorFinal,
        presencaComprador: natureza.presencaComprador,
        informacoesAdicionaisPadrao: natureza.informacoesAdicionaisPadrao || "",
        ativo: natureza.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar natureza de operação:", error)
      toast.error("Erro ao carregar natureza de operação")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: NaturezaOperacaoFormValues) => {
    try {
      setLoading(true)

      const data = {
        ...values,
        cfopDentroEstadoId: values.cfopDentroEstadoId || undefined,
        cfopForaEstadoId: values.cfopForaEstadoId || undefined,
        cfopExteriorId: values.cfopExteriorId || undefined,
        informacoesAdicionaisPadrao: values.informacoesAdicionaisPadrao || undefined,
      }

      if (naturezaId) {
        await NaturezaOperacaoService.update(naturezaId, data)
        toast.success("Natureza de operação atualizada com sucesso!")
      } else {
        await NaturezaOperacaoService.create(data)
        toast.success("Natureza de operação cadastrada com sucesso!")
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro ao salvar natureza de operação:", error)
      toast.error(error.response?.data?.message || "Erro ao salvar natureza de operação")
    } finally {
      setLoading(false)
    }
  }

  const tipoOperacao = form.watch("tipoOperacao")
  const cfopTipo = tipoOperacao === 1 ? 'SAIDA' : 'ENTRADA'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] sm:max-w-[90vw] flex flex-col p-0"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {naturezaId ? "Editar Natureza de Operação" : "Nova Natureza de Operação"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {naturezaId
              ? "Edite as informações da natureza de operação abaixo"
              : "Configure uma natureza de operação para facilitar a emissão de notas fiscais"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados Básicos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados Básicos</CardTitle>
                  <CardDescription>
                    Código e descrição da natureza de operação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: VENDA" maxLength={10} />
                      </FormControl>
                      <FormDescription>
                        Código único para identificar a natureza
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>
                          Natureza disponível para uso
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

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Venda de mercadoria" maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </CardContent>
              </Card>

              {/* CFOPs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CFOPs Padrão</CardTitle>
                  <CardDescription>
                    Selecione os CFOPs que serão usados automaticamente baseado no destino da operação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cfopDentroEstadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFOP Dentro do Estado</FormLabel>
                      <div className="flex gap-2">
                        <CFOPCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          tipo={cfopTipo}
                          placeholder="Selecione o CFOP"
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => field.onChange(undefined)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfopForaEstadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFOP Fora do Estado</FormLabel>
                      <div className="flex gap-2">
                        <CFOPCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          tipo={cfopTipo}
                          placeholder="Selecione o CFOP"
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => field.onChange(undefined)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cfopExteriorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFOP Exterior</FormLabel>
                      <div className="flex gap-2">
                        <CFOPCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          tipo={cfopTipo}
                          placeholder="Selecione o CFOP"
                          className="flex-1"
                        />
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => field.onChange(undefined)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações da NFe */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações da NFe</CardTitle>
                  <CardDescription>
                    Parâmetros padrão para emissão de notas fiscais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoOperacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Operação *</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0 - Entrada</SelectItem>
                          <SelectItem value="1">1 - Saída</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade *</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Normal</SelectItem>
                          <SelectItem value="2">2 - Complementar</SelectItem>
                          <SelectItem value="3">3 - Ajuste</SelectItem>
                          <SelectItem value="4">4 - Devolução</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consumidorFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumidor Final *</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0 - Não</SelectItem>
                          <SelectItem value="1">1 - Sim</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presencaComprador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presença do Comprador *</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0 - Não se aplica</SelectItem>
                          <SelectItem value="1">1 - Presencial</SelectItem>
                          <SelectItem value="2">2 - Internet</SelectItem>
                          <SelectItem value="3">3 - Teleatendimento</SelectItem>
                          <SelectItem value="4">4 - Entrega em domicílio</SelectItem>
                          <SelectItem value="9">9 - Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  </div>
                </CardContent>
              </Card>

              {/* Informações Adicionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Adicionais</CardTitle>
                  <CardDescription>
                    Texto padrão para o campo de informações adicionais da NFe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="informacoesAdicionaisPadrao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informações Adicionais Padrão</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Texto que será incluído automaticamente nas notas com esta natureza"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Este texto será adicionado automaticamente ao campo de informações adicionais da NFe
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

