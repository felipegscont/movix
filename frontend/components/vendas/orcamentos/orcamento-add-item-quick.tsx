"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconPlus, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { ProdutoCombobox } from "@/components/shared/combobox/produto-combobox"
import { ProdutoService } from "@/lib/services/produto.service"
import { type OrcamentoItemFormData } from "@/lib/schemas/orcamento.schema"

interface OrcamentoAddItemQuickProps {
  onAddItem: (item: OrcamentoItemFormData) => void
}

export function OrcamentoAddItemQuick({ onAddItem }: OrcamentoAddItemQuickProps) {
  const [produtoId, setProdutoId] = useState<string>("")
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Campos editáveis
  const [quantidade, setQuantidade] = useState<number>(1)
  const [valorUnitario, setValorUnitario] = useState<number>(0)
  const [valorDesconto, setValorDesconto] = useState<number>(0)
  const [observacoes, setObservacoes] = useState<string>("")

  // Carregar dados do produto quando selecionado
  useEffect(() => {
    if (produtoId) {
      loadProduto(produtoId)
    } else {
      setProduto(null)
      setValorUnitario(0)
    }
  }, [produtoId])

  const loadProduto = async (id: string) => {
    try {
      setLoading(true)
      const produtoData = await ProdutoService.getById(id)
      setProduto(produtoData)

      // Preencher valor unitário do cadastro
      setValorUnitario(Number(produtoData.valorUnitario) || 0)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      toast.error("Erro ao carregar produto")
    } finally {
      setLoading(false)
    }
  }

  const calcularValorTotal = () => {
    return (quantidade * valorUnitario) - valorDesconto
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevenir submit ao pressionar Enter
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const handleAddItem = () => {
    if (!produtoId || !produto) {
      toast.error("Selecione um produto")
      return
    }

    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero")
      return
    }

    if (valorUnitario < 0) {
      toast.error("Valor unitário não pode ser negativo")
      return
    }

    // Montar item
    const item: OrcamentoItemFormData = {
      produtoId: produto.id,
      codigo: produto.codigo,
      descricao: produto.descricao,
      unidade: produto.unidade || 'UN',
      quantidade: quantidade,
      valorUnitario: valorUnitario,
      valorDesconto: valorDesconto,
      valorTotal: calcularValorTotal(),
      observacoes: observacoes || undefined,
    }

    onAddItem(item)

    // Limpar formulário
    setProdutoId("")
    setProduto(null)
    setQuantidade(1)
    setValorUnitario(0)
    setValorDesconto(0)
    setObservacoes("")

    toast.success("Item adicionado com sucesso!")
  }

  return (
    <Card className="py-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Adicionar Item</CardTitle>
        <CardDescription className="text-xs">
          Selecione um produto e preencha os dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {/* Produto */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Produto *</Label>
            <ProdutoCombobox
              value={produtoId}
              onValueChange={(id) => {
                setProdutoId(id || "")
              }}
            />
          </div>

          {produto && (
            <>
              {/* Informações do produto */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded-md text-xs">
                <div>
                  <span className="text-muted-foreground">Código:</span>
                  <span className="ml-1 font-medium">{produto.codigo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unidade:</span>
                  <span className="ml-1 font-medium">{produto.unidade}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Estoque:</span>
                  <span className="ml-1 font-medium">{produto.estoqueAtual || 0}</span>
                </div>
              </div>

              {/* Campos de valores */}
              <div className="grid grid-cols-4 gap-2">
                {/* Quantidade */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Quantidade *</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Valor Unitário */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Valor Unitário *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={valorUnitario}
                    onChange={(e) => setValorUnitario(Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Desconto */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Desconto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={valorDesconto}
                    onChange={(e) => setValorDesconto(Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Total (readonly) */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Total</Label>
                  <div className="h-9 px-3 py-2 bg-muted rounded-md border border-input flex items-center">
                    <span className="text-sm font-semibold">
                      {calcularValorTotal().toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Observações</Label>
                <Textarea
                  placeholder="Observações sobre este item..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="min-h-[60px] text-sm resize-none"
                />
              </div>

              {/* Botão Adicionar */}
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

