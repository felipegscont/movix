"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react"
import { CreateNfePagamentoData, FormaPagamento, NfeService } from "@/lib/services/nfe.service"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PagamentosFormProps {
  pagamentos: CreateNfePagamentoData[]
  onChange: (pagamentos: CreateNfePagamentoData[]) => void
  valorTotal: number
  disabled?: boolean
}

const BANDEIRAS = [
  { codigo: "01", nome: "Visa" },
  { codigo: "02", nome: "Mastercard" },
  { codigo: "03", nome: "American Express" },
  { codigo: "04", nome: "Sorocred" },
  { codigo: "05", nome: "Diners Club" },
  { codigo: "06", nome: "Elo" },
  { codigo: "07", nome: "Hipercard" },
  { codigo: "08", nome: "Aura" },
  { codigo: "09", nome: "Cabal" },
  { codigo: "99", nome: "Outros" },
]

export function PagamentosForm({ pagamentos, onChange, valorTotal, disabled = false }: PagamentosFormProps) {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFormasPagamento()
  }, [])

  const loadFormasPagamento = async () => {
    try {
      const formas = await NfeService.getFormasPagamento()
      setFormasPagamento(formas)
    } catch (error) {
      console.error("Erro ao carregar formas de pagamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const adicionarPagamento = () => {
    const novoPagamento: CreateNfePagamentoData = {
      indicadorPagamento: 0,
      formaPagamento: "01",
      valor: 0,
    }
    onChange([...pagamentos, novoPagamento])
  }

  const removerPagamento = (index: number) => {
    const novosPagamentos = pagamentos.filter((_, i) => i !== index)
    onChange(novosPagamentos)
  }

  const atualizarPagamento = (index: number, campo: keyof CreateNfePagamentoData, valor: any) => {
    const novosPagamentos = [...pagamentos]
    novosPagamentos[index] = {
      ...novosPagamentos[index],
      [campo]: valor,
    }
    onChange(novosPagamentos)
  }

  const getFormaPagamento = (codigo: string): FormaPagamento | undefined => {
    return formasPagamento.find(f => f.codigo === codigo)
  }

  const somaPagamentos = pagamentos.reduce((sum, pag) => sum + (pag.valor || 0), 0)
  const diferenca = valorTotal - somaPagamentos
  const isValido = Math.abs(diferenca) < 0.01

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
        <CardDescription>
          Informe as formas de pagamento utilizadas na operação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isValido && pagamentos.length > 0 && (
          <Alert variant="destructive">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              A soma dos pagamentos (R$ {somaPagamentos.toFixed(2)}) deve ser igual ao valor total da NFe (R$ {valorTotal.toFixed(2)}).
              Diferença: R$ {Math.abs(diferenca).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {pagamentos.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Indicador</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead className="w-[150px]">Valor</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.map((pagamento, index) => {
                  const forma = getFormaPagamento(pagamento.formaPagamento)
                  const requerCard = forma?.requerCard || false

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={pagamento.indicadorPagamento.toString()}
                          onValueChange={(value) => atualizarPagamento(index, "indicadorPagamento", parseInt(value))}
                          disabled={disabled}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">À vista</SelectItem>
                            <SelectItem value="1">A prazo</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Select
                            value={pagamento.formaPagamento}
                            onValueChange={(value) => atualizarPagamento(index, "formaPagamento", value)}
                            disabled={disabled || loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              {formasPagamento.map((forma) => (
                                <SelectItem key={forma.id} value={forma.codigo}>
                                  {forma.codigo} - {forma.descricao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Campos adicionais para cartão */}
                          {requerCard && (
                            <div className="grid grid-cols-2 gap-2 p-2 bg-muted rounded-md">
                              <div className="col-span-2">
                                <Label className="text-xs">Tipo Integração</Label>
                                <Select
                                  value={pagamento.tipoIntegracao?.toString() || "1"}
                                  onValueChange={(value) => atualizarPagamento(index, "tipoIntegracao", parseInt(value))}
                                  disabled={disabled}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Integrado</SelectItem>
                                    <SelectItem value="2">Não integrado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">CNPJ Credenciadora</Label>
                                <Input
                                  type="text"
                                  value={pagamento.cnpjCredenciadora || ""}
                                  onChange={(e) => atualizarPagamento(index, "cnpjCredenciadora", e.target.value)}
                                  placeholder="00000000000000"
                                  maxLength={14}
                                  disabled={disabled}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Bandeira</Label>
                                <Select
                                  value={pagamento.bandeira || ""}
                                  onValueChange={(value) => atualizarPagamento(index, "bandeira", value)}
                                  disabled={disabled}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BANDEIRAS.map((bandeira) => (
                                      <SelectItem key={bandeira.codigo} value={bandeira.codigo}>
                                        {bandeira.nome}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Nº Autorização</Label>
                                <Input
                                  type="text"
                                  value={pagamento.numeroAutorizacao || ""}
                                  onChange={(e) => atualizarPagamento(index, "numeroAutorizacao", e.target.value)}
                                  placeholder="123456"
                                  maxLength={20}
                                  disabled={disabled}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          )}

                          {/* Campo descrição para "Outros" */}
                          {pagamento.formaPagamento === "99" && (
                            <div className="p-2 bg-muted rounded-md">
                              <Label className="text-xs">Descrição do Pagamento *</Label>
                              <Input
                                type="text"
                                value={pagamento.descricaoPagamento || ""}
                                onChange={(e) => atualizarPagamento(index, "descricaoPagamento", e.target.value)}
                                placeholder="Descreva a forma de pagamento"
                                maxLength={200}
                                disabled={disabled}
                                className="h-8"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={pagamento.valor || ""}
                          onChange={(e) => atualizarPagamento(index, "valor", parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerPagamento(index)}
                          disabled={disabled}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={adicionarPagamento}
            disabled={disabled || loading}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Adicionar Pagamento
          </Button>

          {pagamentos.length > 0 && (
            <div className="text-sm space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Total dos Pagamentos:</span>
                <span className="font-medium">R$ {somaPagamentos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Valor Total NFe:</span>
                <span className="font-medium">R$ {valorTotal.toFixed(2)}</span>
              </div>
              {!isValido && (
                <div className="flex justify-between gap-4 text-destructive">
                  <span>Diferença:</span>
                  <span className="font-medium">R$ {Math.abs(diferenca).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

