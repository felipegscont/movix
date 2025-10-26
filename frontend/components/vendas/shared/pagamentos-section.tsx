"use client"

import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormaPagamentoCombobox } from "@/components/shared/combobox/forma-pagamento-combobox"
import { IconPlus, IconTrash, IconCreditCard } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils/format"

interface PagamentosSectionProps {
  form: UseFormReturn<any>
  valorTotal: number
}

export function PagamentosSection({ form, valorTotal }: PagamentosSectionProps) {
  const [totalPagamentos, setTotalPagamentos] = useState(0)
  
  const pagamentos = form.watch('pagamentos') || []

  // Calcular total dos pagamentos
  useEffect(() => {
    const total = pagamentos.reduce((sum: number, pag: any) => {
      const valor = typeof pag.valor === 'string' ? parseFloat(pag.valor) || 0 : pag.valor || 0
      return sum + valor
    }, 0)
    setTotalPagamentos(total)
  }, [pagamentos])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const adicionarPagamento = () => {
    const novaParcela = pagamentos.length + 1
    const dataVencimento = new Date().toISOString().split('T')[0]
    
    const novosPagamentos = [
      ...pagamentos,
      {
        parcela: novaParcela,
        formaPagamentoId: '',
        dataVencimento,
        valor: 0,
        observacoes: '',
      },
    ]
    
    form.setValue('pagamentos', novosPagamentos)
  }

  const removerPagamento = (index: number) => {
    const novosPagamentos = pagamentos.filter((_: any, i: number) => i !== index)
    // Reordenar parcelas
    const pagamentosReordenados = novosPagamentos.map((pag: any, i: number) => ({
      ...pag,
      parcela: i + 1,
    }))
    form.setValue('pagamentos', pagamentosReordenados)
  }

  const gerarParcelas = () => {
    if (valorTotal <= 0) {
      return
    }

    // Gerar uma parcela única com o valor total
    const dataVencimento = new Date().toISOString().split('T')[0]
    
    form.setValue('pagamentos', [
      {
        parcela: 1,
        formaPagamentoId: '',
        dataVencimento,
        valor: valorTotal,
        observacoes: '',
      },
    ])
  }

  const diferenca = valorTotal - totalPagamentos

  return (
    <div className="space-y-3">
      {/* Cabeçalho com Totais */}
      <Card>
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <IconCreditCard className="h-4 w-4" />
              Pagamento
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={gerarParcelas}
                disabled={valorTotal <= 0}
              >
                Gerar contas
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={adicionarPagamento}
              >
                <IconPlus className="h-3.5 w-3.5 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-3">
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground">Total a Pagar</label>
              <div className="font-semibold text-sm">
                {formatCurrency(valorTotal)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground">Total Parcelas</label>
              <div className="font-semibold text-sm">
                {formatCurrency(totalPagamentos)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground">Diferença</label>
              <div className={`font-semibold text-sm ${diferenca !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(diferenca))}
                {diferenca > 0 && ' (falta)'}
                {diferenca < 0 && ' (excesso)'}
              </div>
            </div>
          </div>

          {diferenca !== 0 && pagamentos.length > 0 && (
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
              ⚠️ O total das parcelas deve ser igual ao valor total do pedido
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Pagamentos */}
      {pagamentos.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">Forma</th>
                    <th className="text-left p-2 font-medium">Parcela</th>
                    <th className="text-left p-2 font-medium">Vencimento</th>
                    <th className="text-left p-2 font-medium">Observações</th>
                    <th className="text-right p-2 font-medium">Valor (R$)</th>
                    <th className="w-10 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((pagamento: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`pagamentos.${index}.formaPagamentoId`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <FormaPagamentoCombobox
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder="Selecione..."
                                  className="h-8 text-xs"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center">
                          <Badge variant="outline" className="text-xs">
                            [{pagamento.parcela}/{pagamentos.length}]
                          </Badge>
                        </div>
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`pagamentos.${index}.dataVencimento`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  type="date"
                                  className="h-8 text-xs"
                                  onKeyDown={handleKeyDown}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`pagamentos.${index}.observacoes`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  placeholder="Observações..."
                                  className="h-8 text-xs"
                                  onKeyDown={handleKeyDown}
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`pagamentos.${index}.valor`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0,00"
                                  className="h-8 text-xs text-right"
                                  onKeyDown={handleKeyDown}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerPagamento(index)}
                          className="h-8 w-8 p-0"
                        >
                          <IconTrash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há pagamentos */}
      {pagamentos.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>Nenhuma forma de pagamento adicionada</p>
              <p className="text-xs mt-1">
                Clique em "Gerar contas" ou "Adicionar" para incluir formas de pagamento
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

