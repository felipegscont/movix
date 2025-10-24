"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDeviceFloppy, IconList, IconLayoutGrid, IconPlus, IconArrowLeft } from "@tabler/icons-react"
import { toast } from "sonner"
import { NaturezaOperacaoService, NaturezaOperacao } from "@/lib/services/natureza-operacao.service"
import { NaturezaOperacaoCFOPManager } from "./natureza-operacao-cfop-manager"
import { NaturezaOperacaoProdutosExcecao } from "./natureza-operacao-produtos-excecao"

const naturezaFiscalFormSchema = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, "Código é obrigatório").max(10, "Código deve ter no máximo 10 caracteres"),
  nome: z.string().min(1, "Nome é obrigatório").max(200, "Nome deve ter no máximo 200 caracteres"),
  tipo: z.number().optional(), // 0=Entrada, 1=Saída
  ativa: z.boolean(),
  dentroEstado: z.boolean(),
  propria: z.boolean(),
})

type NaturezaFiscalFormValues = z.infer<typeof naturezaFiscalFormSchema>

interface NaturezaOperacaoFiscalFormProps {
  naturezaId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function NaturezaOperacaoFiscalForm({
  naturezaId,
  onSuccess,
  onCancel,
}: NaturezaOperacaoFiscalFormProps) {
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [activeTab, setActiveTab] = useState("cfops")

  const form = useForm<NaturezaFiscalFormValues>({
    resolver: zodResolver(naturezaFiscalFormSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      tipo: undefined, // Começar sem seleção
      ativa: false, // Começar desmarcado conforme exemplo
      dentroEstado: false,
      propria: false,
    },
  })

  useEffect(() => {
    if (naturezaId) {
      loadNatureza()
    }
  }, [naturezaId])

  const loadNatureza = async () => {
    if (!naturezaId) return

    try {
      setLoading(true)
      const natureza = await NaturezaOperacaoService.getById(naturezaId)
      
      form.reset({
        id: natureza.id,
        codigo: natureza.codigo,
        nome: natureza.nome,
        tipo: natureza.tipo,
        ativa: natureza.ativa,
        dentroEstado: natureza.dentroEstado,
        propria: natureza.propria,
      })
    } catch (error) {
      console.error("Erro ao carregar natureza de operação:", error)
      toast.error("Erro ao carregar natureza de operação")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: NaturezaFiscalFormValues) => {
    try {
      setLoading(true)

      const payload = {
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo,
        ativa: data.ativa,
        dentroEstado: data.dentroEstado,
        propria: data.propria,
      }

      if (naturezaId) {
        await NaturezaOperacaoService.update(naturezaId, payload)
        toast.success("Natureza de operação atualizada com sucesso!")
      } else {
        await NaturezaOperacaoService.create(payload)
        toast.success("Natureza de operação criada com sucesso!")
      }

      onSuccess?.()
    } catch (error) {
      console.error("Erro ao salvar natureza de operação:", error)
      toast.error("Erro ao salvar natureza de operação")
    } finally {
      setLoading(false)
    }
  }

  const tipoValue = form.watch("tipo")
  const tipoLabel = tipoValue === 1 ? "Saída" : tipoValue === 0 ? "Entrada" : "Selecione"

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {naturezaId ? "Editar" : "Nova"} Natureza de Operação
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure natureza de operação e CFOPs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <IconList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <IconLayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
          {/* Conteúdo principal */}
          <div className="flex-1 p-6">
            {/* DADOS GERAIS - Layout compacto */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados Gerais</h3>

              {/* Primeira linha: Código, Nome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Código:</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nome:</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


              </div>

              {/* Segunda linha: Tipo, Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tipo:</FormLabel>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Entrada</SelectItem>
                            <SelectItem value="1">Saída</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ativa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0">
                        <FormLabel className="text-sm font-medium">Ativa</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dentroEstado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0">
                        <FormLabel className="text-sm font-medium">Dentro do Estado</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propria"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0">
                        <FormLabel className="text-sm font-medium">Própria</FormLabel>
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

            {/* Abas */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                    <TabsTrigger
                      value="cfops"
                      className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
                    >
                      CFOPS
                    </TabsTrigger>
                    <TabsTrigger
                      value="produtos-excecao"
                      className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
                    >
                      PRODUTOS COM EXCEÇÃO
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cfops" className="p-6 mt-0">
                    <NaturezaOperacaoCFOPManager
                      naturezaId={naturezaId}
                      tipoOperacao={form.watch("tipo") || 1}
                    />
                  </TabsContent>

                  <TabsContent value="produtos-excecao" className="p-6 mt-0">
                    <NaturezaOperacaoProdutosExcecao
                      naturezaId={naturezaId}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-end p-6 border-t gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && <IconDeviceFloppy className="mr-2 h-4 w-4 animate-spin" />}
              {!loading && <IconDeviceFloppy className="mr-2 h-4 w-4" />}
              {naturezaId ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
