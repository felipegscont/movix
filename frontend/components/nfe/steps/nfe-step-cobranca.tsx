"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconPlus, IconTrash, IconCash, IconCalendar, IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { type NfeDuplicataFormData, type NfePagamentoFormData } from "@/lib/schemas/nfe.schema"
import { FormaPagamentoCombobox } from "@/components/shared/combobox/forma-pagamento-combobox"

interface NfeStepCobrancaProps {
  form: UseFormReturn<any>
}

export function NfeStepCobranca({ form }: NfeStepCobrancaProps) {
  const duplicatas = form.watch('duplicatas') || []
  const pagamentos = form.watch('pagamentos') || []
  const itens = form.watch('itens') || []
  
  const valorTotalNfe = itens.reduce((sum: number, item: any) => sum + (item.valorTotal || 0), 0)
  const totalDuplicatas = duplicatas.reduce((sum: number, dup: any) => sum + (Number(dup.valor) || 0), 0)
  const totalPagamentos = pagamentos.reduce((sum: number, pag: any) => sum + (Number(pag.valor) || 0), 0)

  // Estado para adicionar duplicata
  const [novaDuplicata, setNovaDuplicata] = useState({
    numero: "",
    dataVencimento: "",
    valor: 0,
  })

  // Estado para adicionar pagamento
  const [novoPagamento, setNovoPagamento] = useState({
    indicadorPagamento: 0,
    formaPagamentoId: "",
    valor: 0,
  })

  const handleAddDuplicata = () => {
    if (!novaDuplicata.numero) {
      toast.error("Número da duplicata é obrigatório")
      return
    }
    if (!novaDuplicata.dataVencimento) {
      toast.error("Data de vencimento é obrigatória")
      return
    }
    if (novaDuplicata.valor <= 0) {
      toast.error("Valor deve ser maior que zero")
      return
    }

    const currentDuplicatas = form.getValues('duplicatas') || []
    form.setValue('duplicatas', [...currentDuplicatas, novaDuplicata])
    
    setNovaDuplicata({
      numero: "",
      dataVencimento: "",
      valor: 0,
    })
    
    toast.success("Duplicata adicionada!")
  }

  const handleRemoveDuplicata = (index: number) => {
    if (confirm('Deseja remover esta duplicata?')) {
      const currentDuplicatas = form.getValues('duplicatas') || []
      form.setValue('duplicatas', currentDuplicatas.filter((_: any, i: number) => i !== index))
      toast.success("Duplicata removida!")
    }
  }

  const handleAddPagamento = () => {
    if (!novoPagamento.formaPagamentoId) {
      toast.error("Forma de pagamento é obrigatória")
      return
    }
    if (novoPagamento.valor <= 0) {
      toast.error("Valor deve ser maior que zero")
      return
    }

    const currentPagamentos = form.getValues('pagamentos') || []
    form.setValue('pagamentos', [...currentPagamentos, novoPagamento])
    
    setNovoPagamento({
      indicadorPagamento: 0,
      formaPagamentoId: "",
      valor: 0,
    })
    
    toast.success("Pagamento adicionado!")
  }

  const handleRemovePagamento = (index: number) => {
    if (confirm('Deseja remover este pagamento?')) {
      const currentPagamentos = form.getValues('pagamentos') || []
      form.setValue('pagamentos', currentPagamentos.filter((_: any, i: number) => i !== index))
      toast.success("Pagamento removido!")
    }
  }

  const gerarDuplicatasAutomaticas = () => {
    const quantidade = prompt("Quantas duplicatas deseja gerar?", "3")
    if (!quantidade) return

    const qtd = parseInt(quantidade)
    if (isNaN(qtd) || qtd <= 0) {
      toast.error("Quantidade inválida")
      return
    }

    const valorParcela = valorTotalNfe / qtd
    const hoje = new Date()
    const novasDuplicatas = []

    for (let i = 0; i < qtd; i++) {
      const dataVencimento = new Date(hoje)
      dataVencimento.setDate(dataVencimento.getDate() + (30 * (i + 1)))
      
      novasDuplicatas.push({
        numero: `${i + 1}/${qtd}`,
        dataVencimento: dataVencimento.toISOString().split('T')[0],
        valor: valorParcela,
      })
    }

    form.setValue('duplicatas', novasDuplicatas)
    toast.success(`${qtd} duplicatas geradas!`)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCash className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Valor Total NFe</p>
              <p className="text-2xl font-bold">{formatCurrency(valorTotalNfe)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Duplicatas</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDuplicatas)}</p>
              {totalDuplicatas !== valorTotalNfe && totalDuplicatas > 0 && (
                <Badge variant="destructive" className="mt-1">Divergente</Badge>
              )}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pagamentos</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPagamentos)}</p>
              {totalPagamentos !== valorTotalNfe && totalPagamentos > 0 && (
                <Badge variant="destructive" className="mt-1">Divergente</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicatas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Duplicatas ({duplicatas.length})
              </CardTitle>
              <CardDescription>
                Parcelas de cobrança da nota fiscal
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={gerarDuplicatasAutomaticas}
            >
              Gerar Automático
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário de adicionar */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 space-y-2">
              <Label className="text-xs">Número</Label>
              <Input
                placeholder="1/3"
                value={novaDuplicata.numero}
                onChange={(e) => setNovaDuplicata({ ...novaDuplicata, numero: e.target.value })}
              />
            </div>
            <div className="col-span-3 space-y-2">
              <Label className="text-xs">Vencimento</Label>
              <Input
                type="date"
                value={novaDuplicata.dataVencimento}
                onChange={(e) => setNovaDuplicata({ ...novaDuplicata, dataVencimento: e.target.value })}
              />
            </div>
            <div className="col-span-4 space-y-2">
              <Label className="text-xs">Valor</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={novaDuplicata.valor}
                onChange={(e) => setNovaDuplicata({ ...novaDuplicata, valor: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                onClick={handleAddDuplicata}
                className="w-full"
                size="sm"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de duplicatas */}
          {duplicatas.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duplicatas.map((dup: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dup.numero}</TableCell>
                      <TableCell>{formatDate(dup.dataVencimento)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(dup.valor)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDuplicata(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <IconCalendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma duplicata adicionada</p>
              <p className="text-sm mt-1">Adicione duplicatas ou gere automaticamente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCash className="h-5 w-5" />
            Formas de Pagamento ({pagamentos.length})
          </CardTitle>
          <CardDescription>
            Formas de pagamento aceitas nesta nota
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário de adicionar */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-xs">Indicador</Label>
              <Select
                value={novoPagamento.indicadorPagamento.toString()}
                onValueChange={(value) => setNovoPagamento({ ...novoPagamento, indicadorPagamento: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">À vista</SelectItem>
                  <SelectItem value="1">A prazo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6 space-y-2">
              <Label className="text-xs">Forma de Pagamento</Label>
              <FormaPagamentoCombobox
                value={novoPagamento.formaPagamentoId}
                onValueChange={(value) => setNovoPagamento({ ...novoPagamento, formaPagamentoId: value || "" })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-xs">Valor</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={novoPagamento.valor}
                onChange={(e) => setNovoPagamento({ ...novoPagamento, valor: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                onClick={handleAddPagamento}
                className="w-full"
                size="sm"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de pagamentos */}
          {pagamentos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Forma de Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.map((pag: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant={pag.indicadorPagamento === 0 ? "default" : "secondary"}>
                          {pag.indicadorPagamento === 0 ? "À vista" : "A prazo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{pag.formaPagamentoId}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(pag.valor)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePagamento(index)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <IconCash className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma forma de pagamento adicionada</p>
              <p className="text-sm mt-1">Adicione as formas de pagamento aceitas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

