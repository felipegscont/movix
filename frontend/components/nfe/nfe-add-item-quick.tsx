"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPlus, IconLoader2, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { toast } from "sonner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ProdutoCombobox } from "@/components/shared/combobox/produto-combobox"
import { ProdutoService } from "@/lib/services/produto.service"
import { type NfeItemFormData } from "@/lib/schemas/nfe.schema"

interface NfeAddItemQuickProps {
  onAddItem: (item: NfeItemFormData) => void
  emitenteRegime?: number // 1=Simples, 3=Normal
}

export function NfeAddItemQuick({ onAddItem, emitenteRegime = 1 }: NfeAddItemQuickProps) {
  const [produtoId, setProdutoId] = useState<string>("")
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Campos editáveis básicos
  const [quantidade, setQuantidade] = useState<number>(1)
  const [valorUnitario, setValorUnitario] = useState<number>(0)
  const [valorDesconto, setValorDesconto] = useState<number>(0)

  // Campos editáveis avançados
  const [valorFrete, setValorFrete] = useState<number>(0)
  const [valorSeguro, setValorSeguro] = useState<number>(0)
  const [valorOutros, setValorOutros] = useState<number>(0)

  // Impostos editáveis
  const [icmsAliquota, setIcmsAliquota] = useState<number>(0)
  const [ipiAliquota, setIpiAliquota] = useState<number>(0)
  const [pisAliquota, setPisAliquota] = useState<number>(0)
  const [cofinsAliquota, setCofinsAliquota] = useState<number>(0)

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

      // Preencher valores do cadastro (mas permitir edição)
      setValorUnitario(Number(produtoData.valorUnitario) || 0)
      setIcmsAliquota(Number(produtoData.icmsAliquota) || 0)
      setIpiAliquota(Number(produtoData.ipiAliquota) || 0)
      setPisAliquota(Number(produtoData.pisAliquota) || 0)
      setCofinsAliquota(Number(produtoData.cofinsAliquota) || 0)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      toast.error("Erro ao carregar produto")
    } finally {
      setLoading(false)
    }
  }

  const calcularValorTotal = () => {
    return (quantidade * valorUnitario) - valorDesconto + valorFrete + valorSeguro + valorOutros
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

    if (valorUnitario <= 0) {
      toast.error("Valor unitário deve ser maior que zero")
      return
    }

    // Montar item com dados editados (NÃO altera cadastro do produto)
    const item: NfeItemFormData = {
      produtoId: produto.id,
      codigo: produto.codigo,
      codigoBarras: produto.codigoBarras || undefined,
      descricao: produto.descricao,
      ncmId: produto.ncmId,
      cfopId: produto.cfopId, // Opcional - será preenchido se disponível
      unidadeComercial: produto.unidade,
      quantidadeComercial: quantidade,
      valorUnitario: valorUnitario, // Valor editado pelo usuário
      valorTotal: calcularValorTotal(),
      valorDesconto: valorDesconto,
      valorFrete: valorFrete,
      valorSeguro: valorSeguro,
      valorOutros: valorOutros,
      origem: produto.origem || "0",
      incluiTotal: true,

      // Impostos editados pelo usuário (específicos desta NFe)
      icms: {
        origem: produto.origem || "0",
        cstId: emitenteRegime === 1 ? undefined : produto.icmsCstId,
        csosnId: emitenteRegime === 1 ? produto.icmsCsosnId : undefined,
        baseCalculo: 0,
        aliquota: icmsAliquota, // Alíquota editada
        valor: 0,
      },

      pis: {
        cstId: produto.pisCstId || "",
        baseCalculo: 0,
        aliquota: pisAliquota, // Alíquota editada
        valor: 0,
      },

      cofins: {
        cstId: produto.cofinsCstId || "",
        baseCalculo: 0,
        aliquota: cofinsAliquota, // Alíquota editada
        valor: 0,
      },
    }

    // Adicionar IPI se houver
    if (produto.ipiCstId || ipiAliquota > 0) {
      item.ipi = {
        cstId: produto.ipiCstId || "",
        baseCalculo: 0,
        aliquota: ipiAliquota, // Alíquota editada
        valor: 0,
      }
    }

    // Calcular impostos
    calcularImpostos(item)

    // Adicionar item
    onAddItem(item)

    // Limpar formulário
    setProdutoId("")
    setProduto(null)
    setQuantidade(1)
    setValorUnitario(0)
    setValorDesconto(0)
    setValorFrete(0)
    setValorSeguro(0)
    setValorOutros(0)
    setIcmsAliquota(0)
    setIpiAliquota(0)
    setPisAliquota(0)
    setCofinsAliquota(0)
    setShowAdvanced(false)

    toast.success("Item adicionado!")
  }

  const calcularImpostos = (item: NfeItemFormData) => {
    const valorBase = item.quantidadeComercial * item.valorUnitario - (item.valorDesconto || 0)

    // ICMS
    if (item.icms) {
      item.icms.baseCalculo = valorBase
      item.icms.valor = (valorBase * item.icms.aliquota) / 100
    }

    // IPI
    if (item.ipi) {
      item.ipi.baseCalculo = valorBase
      item.ipi.valor = (valorBase * item.ipi.aliquota) / 100
    }

    // PIS
    if (item.pis) {
      item.pis.baseCalculo = valorBase
      item.pis.valor = (valorBase * item.pis.aliquota) / 100
    }

    // COFINS
    if (item.cofins) {
      item.cofins.baseCalculo = valorBase
      item.cofins.valor = (valorBase * item.cofins.aliquota) / 100
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Adicionar Item</CardTitle>
        <CardDescription>
          Selecione o produto e ajuste os valores antes de adicionar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Linha principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Produto - 4 colunas */}
          <div className="md:col-span-4 space-y-2">
            <Label>Produto *</Label>
            <ProdutoCombobox
              value={produtoId}
              onValueChange={(value) => setProdutoId(value || "")}
              disabled={loading}
            />
          </div>

          {/* Quantidade - 2 colunas */}
          <div className="md:col-span-2 space-y-2">
            <Label>Quantidade *</Label>
            <Input
              type="number"
              step="0.0001"
              min="0.0001"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              disabled={!produto || loading}
            />
          </div>

          {/* Valor Unitário - 2 colunas */}
          <div className="md:col-span-2 space-y-2">
            <Label>Valor Unitário *</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(Number(e.target.value))}
              disabled={!produto || loading}
            />
          </div>

          {/* Desconto - 2 colunas */}
          <div className="md:col-span-2 space-y-2">
            <Label>Desconto</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={valorDesconto}
              onChange={(e) => setValorDesconto(Number(e.target.value))}
              disabled={!produto || loading}
            />
          </div>

          {/* Botão Adicionar - 2 colunas */}
          <div className="md:col-span-2 flex items-end">
            <Button
              type="button"
              onClick={handleAddItem}
              disabled={!produto || loading}
              className="w-full"
            >
              {loading ? (
                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <IconPlus className="h-4 w-4 mr-2" />
              )}
              Adicionar
            </Button>
          </div>
        </div>

        {/* Informações do produto selecionado */}
        {produto && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Código:</span>
                  <p className="font-medium">{produto.codigo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unidade:</span>
                  <p className="font-medium">{produto.unidade}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">NCM:</span>
                  <p className="font-medium">{produto.ncm?.codigo || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Preço Cadastro:</span>
                  <p className="font-medium">{formatCurrency(Number(produto.valorUnitario) || 0)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor Total:</span>
                  <p className="font-bold text-lg text-primary">{formatCurrency(calcularValorTotal())}</p>
                </div>
              </div>

              {/* Impostos */}
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>ICMS: {icmsAliquota}%</span>
                {ipiAliquota > 0 && <span>IPI: {ipiAliquota}%</span>}
                <span>PIS: {pisAliquota}%</span>
                <span>COFINS: {cofinsAliquota}%</span>
              </div>

              {/* Alerta se valor foi alterado */}
              {valorUnitario !== Number(produto.valorUnitario) && (
                <div className="flex items-center gap-2 text-xs text-amber-600 pt-2 border-t">
                  <span>⚠️</span>
                  <span>
                    Valor unitário alterado de {formatCurrency(Number(produto.valorUnitario))} para {formatCurrency(valorUnitario)}
                  </span>
                </div>
              )}
            </div>

            {/* Campos avançados (collapsible) */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {showAdvanced ? (
                    <>
                      <IconChevronUp className="h-4 w-4 mr-2" />
                      Ocultar ajustes avançados
                    </>
                  ) : (
                    <>
                      <IconChevronDown className="h-4 w-4 mr-2" />
                      Ajustar valores e impostos
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 pt-4">
                <Separator />

                {/* Ajustar valor unitário */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Ajustar Preço</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">
                        Valor Unitário (R$)
                        <span className="text-muted-foreground ml-2">
                          (Cadastro: {formatCurrency(Number(produto.valorUnitario) || 0)})
                        </span>
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={valorUnitario}
                        onChange={(e) => setValorUnitario(Number(e.target.value))}
                        className="font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Desconto (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={valorDesconto}
                        onChange={(e) => setValorDesconto(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Valores adicionais */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Valores Adicionais por Item</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Frete (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={valorFrete}
                        onChange={(e) => setValorFrete(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Seguro (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={valorSeguro}
                        onChange={(e) => setValorSeguro(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Outras Despesas (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={valorOutros}
                        onChange={(e) => setValorOutros(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Alíquotas de impostos */}
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Alíquotas de Impostos (específicas desta NFe)
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">ICMS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={icmsAliquota}
                        onChange={(e) => setIcmsAliquota(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">IPI (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={ipiAliquota}
                        onChange={(e) => setIpiAliquota(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">PIS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={pisAliquota}
                        onChange={(e) => setPisAliquota(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">COFINS (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={cofinsAliquota}
                        onChange={(e) => setCofinsAliquota(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Estes valores são específicos desta NFe e não alteram o cadastro do produto
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

