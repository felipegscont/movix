"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ProdutoService } from "@/lib/services/produto.service"
import { toast } from "sonner"
import { Package, Receipt, ChartBar, Settings } from "lucide-react"

// Importar seções
import { ProdutoDadosBasicosSection } from "./sections/produto-dados-basicos-section"
import { ProdutoEstoqueSection } from "./sections/produto-estoque-section"
import { ProdutoOutrosSection } from "./sections/produto-outros-section"

// Importar types
import { produtoFormSchema, type ProdutoFormValues } from "@/lib/schemas/produto.schema"

interface ProdutoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produtoId?: string
  onSuccess?: () => void
}

export function ProdutoFormDialog({
  open,
  onOpenChange,
  produtoId,
  onSuccess,
}: ProdutoFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string[]>([])

  const form = useForm({
    resolver: zodResolver(produtoFormSchema),
    defaultValues: {
      codigo: "",
      codigoBarras: "",
      descricao: "",
      descricaoComplementar: "",
      ncmId: "",
      cestId: "",
      origem: "0",
      tipoItem: "00", // Mercadoria para Revenda (padrão)
      unidade: "UN",
      unidadeTributavel: "",
      valorUnitario: 0,
      valorCusto: 0,
      margemLucro: 0,
      estoqueAtual: 0,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      fornecedorId: "",
      ativo: true,
    },
  })

  // Carregar dados do produto para edição
  useEffect(() => {
    if (open && produtoId) {
      loadProduto()
      // Ao editar, abre todas as seções
      setAccordionValue(["basicos", "tributacao", "estoque", "outros"])
    } else if (open && !produtoId) {
      form.reset()
      // Ao criar novo, abre apenas "basicos"
      setAccordionValue(["basicos"])
    }
  }, [open, produtoId])

  const loadProduto = async () => {
    try {
      setLoadingData(true)
      const produto = await ProdutoService.getById(produtoId!)
      
      if (produto) {
        form.reset({
          codigo: produto.codigo || "",
          codigoBarras: produto.codigoBarras || "",
          descricao: produto.descricao || "",
          descricaoComplementar: produto.descricaoComplementar || "",
          ncmId: produto.ncmId || "",
          cestId: produto.cestId || "",
          origem: produto.origem || "0",
          tipoItem: produto.tipoItem || "00",
          unidade: produto.unidade || "UN",
          unidadeTributavel: produto.unidadeTributavel || "",
          valorUnitario: produto.valorUnitario || 0,
          valorCusto: produto.valorCusto || 0,
          margemLucro: produto.margemLucro || 0,
          estoqueAtual: produto.estoqueAtual || 0,
          estoqueMinimo: produto.estoqueMinimo || 0,
          estoqueMaximo: produto.estoqueMaximo || 0,
          fornecedorId: produto.fornecedorId || "",
          ativo: produto.ativo ?? true,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      toast.error("Erro ao carregar dados do produto")
    } finally {
      setLoadingData(false)
    }
  }

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      setLoading(true)

      // Limpa campos opcionais vazios (converte string vazia para undefined)
      const cleanedData = {
        ...data,
        codigoBarras: data.codigoBarras?.trim() || undefined,
        descricaoComplementar: data.descricaoComplementar?.trim() || undefined,
        cestId: data.cestId?.trim() || undefined,
        unidadeTributavel: data.unidadeTributavel?.trim() || undefined,
        valorCusto: data.valorCusto || undefined,
        margemLucro: data.margemLucro || undefined,
        estoqueAtual: data.estoqueAtual || undefined,
        estoqueMinimo: data.estoqueMinimo || undefined,
        estoqueMaximo: data.estoqueMaximo || undefined,
        fornecedorId: data.fornecedorId?.trim() || undefined,
      }

      if (produtoId) {
        await ProdutoService.update(produtoId, cleanedData)
        toast.success("Produto atualizado com sucesso!")
      } else {
        await ProdutoService.create(cleanedData)
        toast.success("Produto criado com sucesso!")
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error)
      toast.error(error.message || "Erro ao salvar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] sm:max-w-[90vw] flex flex-col p-0"
        onInteractOutside={(e) => {
          // Previne o fechamento do dialog ao clicar fora
          e.preventDefault()
        }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {produtoId ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {produtoId
              ? "Edite as informações do produto abaixo"
              : "Preencha os dados para cadastrar um novo produto"}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando dados do produto...</p>
              </div>
            </div>
          </div>
        ) : (
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
                      <div className="pt-4">
                        <ProdutoDadosBasicosSection form={form as any} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion: Estoque e Valores */}
                  <AccordionItem value="estoque" className="border rounded-lg !border-b">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <ChartBar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-semibold">Estoque e Valores</h3>
                          <p className="text-sm text-muted-foreground">Preços e controle de estoque</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pt-4">
                        <ProdutoEstoqueSection form={form as any} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion: Outras Informações */}
                  <AccordionItem value="outros" className="border rounded-lg !border-b">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-semibold">Outras Informações</h3>
                          <p className="text-sm text-muted-foreground">Fornecedor e configurações adicionais</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pt-4">
                        <ProdutoOutrosSection form={form as any} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          </div>
        )}

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || loadingData}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                produtoId ? "Atualizar" : "Criar Produto"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

