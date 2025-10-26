"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconAlertCircle, IconLoader2, IconSend, IconX } from "@tabler/icons-react"
import { NaturezaOperacaoCombobox } from "@/components/shared/combobox/natureza-operacao-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { NfeService } from "@/lib/services/nfe.service"
import { NaturezaOperacaoService, type NaturezaOperacaoCFOP } from "@/lib/services/natureza-operacao.service"

// Schema de validação
const emitirNfeSchema = z.object({
  naturezaOperacaoId: z.string().min(1, "Natureza de operação é obrigatória"),
  naturezaOperacao: z.string().min(1, "Natureza de operação é obrigatória"),
  cfopId: z.string().min(1, "CFOP é obrigatório"),
})

type EmitirNfeFormData = z.infer<typeof emitirNfeSchema>

interface NfeEmitirDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nfe: any
  onSuccess?: () => void
}

export function NfeEmitirDialog({ open, onOpenChange, nfe, onSuccess }: NfeEmitirDialogProps) {
  const [loading, setLoading] = useState(false)
  const [aplicandoMatriz, setAplicandoMatriz] = useState(false)
  const [matrizAplicada, setMatrizAplicada] = useState(false)
  const [errosValidacao, setErrosValidacao] = useState<string[]>([])
  const [cfopsDisponiveis, setCfopsDisponiveis] = useState<NaturezaOperacaoCFOP[]>([])
  const [loadingCfops, setLoadingCfops] = useState(false)

  const form = useForm<EmitirNfeFormData>({
    resolver: zodResolver(emitirNfeSchema),
    defaultValues: {
      naturezaOperacaoId: "",
      naturezaOperacao: nfe?.naturezaOperacao || "",
      cfopId: "",
    },
  })

  // Resetar form quando abrir dialog
  useEffect(() => {
    if (open) {
      form.reset({
        naturezaOperacaoId: "",
        naturezaOperacao: nfe?.naturezaOperacao || "",
        cfopId: "",
      })
      setMatrizAplicada(false)
      setErrosValidacao([])
      setCfopsDisponiveis([])
    }
  }, [open, nfe, form])

  // Buscar CFOPs quando natureza for selecionada
  useEffect(() => {
    const naturezaId = form.watch("naturezaOperacaoId")

    if (naturezaId) {
      loadCfopsNatureza(naturezaId)
    } else {
      setCfopsDisponiveis([])
      form.setValue("cfopId", "")
    }
  }, [form.watch("naturezaOperacaoId")])

  const loadCfopsNatureza = async (naturezaId: string) => {
    try {
      setLoadingCfops(true)
      const cfops = await NaturezaOperacaoService.getCFOPs(naturezaId)
      setCfopsDisponiveis(cfops)

      // Se houver CFOP padrão, selecionar automaticamente
      const cfopPadrao = cfops.find(c => c.padrao)
      if (cfopPadrao) {
        form.setValue("cfopId", cfopPadrao.cfopId)
      }
    } catch (error: any) {
      console.error("Erro ao buscar CFOPs:", error)
      toast.error("Erro ao buscar CFOPs da natureza de operação")
      setCfopsDisponiveis([])
    } finally {
      setLoadingCfops(false)
    }
  }

  // Aplicar matriz fiscal quando natureza e CFOP forem selecionados
  const handleAplicarMatriz = async () => {
    const naturezaOperacaoId = form.watch("naturezaOperacaoId")
    const naturezaOperacao = form.watch("naturezaOperacao")
    const cfopId = form.watch("cfopId")

    if (!naturezaOperacaoId || !naturezaOperacao || !cfopId) {
      toast.error("Selecione a natureza de operação e o CFOP")
      return
    }

    setAplicandoMatriz(true)
    setErrosValidacao([])

    try {
      // Aplicar matriz fiscal para todos os itens
      const response = await NfeService.aplicarMatrizFiscal(nfe.id, {
        naturezaOperacaoId,
        naturezaOperacao,
        cfopId,
      })

      setMatrizAplicada(true)
      toast.success("Matriz fiscal aplicada com sucesso!")

      // Verificar se há erros de validação
      if (response.erros && response.erros.length > 0) {
        setErrosValidacao(response.erros)
      }
    } catch (error: any) {
      console.error("Erro ao aplicar matriz fiscal:", error)
      toast.error(error.message || "Erro ao aplicar matriz fiscal")
      setErrosValidacao([error.message])
    } finally {
      setAplicandoMatriz(false)
    }
  }

  // Emitir NFe
  const handleEmitir = async (data: EmitirNfeFormData) => {
    if (!matrizAplicada) {
      toast.error("Aplique a matriz fiscal antes de emitir")
      return
    }

    if (errosValidacao.length > 0) {
      toast.error("Corrija os erros de validação antes de emitir")
      return
    }

    setLoading(true)

    try {
      await NfeService.emitir(nfe.id)
      toast.success("NFe emitida com sucesso!")
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao emitir NFe:", error)
      toast.error(error.message || "Erro ao emitir NFe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Emitir NFe</DialogTitle>
          <DialogDescription>
            Selecione a natureza de operação e CFOP para aplicar a matriz fiscal e emitir a NFe
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmitir)} className="space-y-4">
            {/* Informações da NFe */}
            <div className="p-3 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="ml-2 font-semibold">{nfe?.cliente?.nome}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Itens:</span>
                  <span className="ml-2 font-semibold">{nfe?.itens?.length || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-semibold">
                    {(nfe?.valorTotal || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="ml-2">
                    {nfe?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Natureza de Operação */}
            <FormField
              control={form.control}
              name="naturezaOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Natureza de Operação *</FormLabel>
                  <FormControl>
                    <NaturezaOperacaoCombobox
                      value={field.value}
                      onValueChange={(value, naturezaId) => {
                        field.onChange(value)
                        form.setValue("naturezaOperacaoId", naturezaId || "")
                      }}
                      allowCustom={false}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* CFOP - Filtrado pela Natureza */}
            <FormField
              control={form.control}
              name="cfopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    CFOP *
                    {loadingCfops && <span className="ml-2 text-muted-foreground">(Carregando...)</span>}
                  </FormLabel>
                  <FormControl>
                    {cfopsDisponiveis.length > 0 ? (
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loadingCfops}
                      >
                        <option value="">Selecione o CFOP</option>
                        {cfopsDisponiveis.map((item) => (
                          <option key={item.id} value={item.cfopId}>
                            {item.cfop.codigo} - {item.cfop.descricao}
                            {item.padrao && " (Padrão)"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {form.watch("naturezaOperacaoId")
                          ? "Nenhum CFOP configurado para esta natureza"
                          : "Selecione uma natureza de operação primeiro"}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Botão Aplicar Matriz */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAplicarMatriz}
              disabled={!form.watch("naturezaOperacaoId") || !form.watch("cfopId") || aplicandoMatriz || loadingCfops}
              className="w-full"
            >
              {aplicandoMatriz ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aplicando Matriz Fiscal...
                </>
              ) : matrizAplicada ? (
                <>
                  <IconAlertCircle className="mr-2 h-4 w-4 text-green-600" />
                  Matriz Fiscal Aplicada
                </>
              ) : (
                "Aplicar Matriz Fiscal"
              )}
            </Button>

            {/* Erros de Validação */}
            {errosValidacao.length > 0 && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="text-xs font-semibold mb-1">Erros encontrados:</div>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {errosValidacao.map((erro, index) => (
                      <li key={index}>{erro}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Sucesso */}
            {matrizAplicada && errosValidacao.length === 0 && (
              <Alert className="border-green-600 bg-green-50">
                <IconAlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-800">
                  Matriz fiscal aplicada com sucesso! A NFe está pronta para ser emitida.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                <IconX className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!matrizAplicada || errosValidacao.length > 0 || loading}
              >
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Emitindo...
                  </>
                ) : (
                  <>
                    <IconSend className="mr-2 h-4 w-4" />
                    Emitir NFe
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

