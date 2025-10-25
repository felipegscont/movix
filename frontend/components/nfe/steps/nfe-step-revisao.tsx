"use client"

import { UseFormReturn } from "react-hook-form"
import { IconBuilding, IconUser, IconPackage, IconCash, IconFileText, IconCheck } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface NfeStepRevisaoProps {
  form: UseFormReturn<any>
  emitente: any
  totals: {
    valorProdutos: number
    valorTotal: number
    valorTotalImpostos: number
    valorICMS: number
    valorIPI: number
    valorPIS: number
    valorCOFINS: number
  }
}

export function NfeStepRevisao({ form, emitente, totals }: NfeStepRevisaoProps) {
  const formData = form.getValues()
  const itens = formData.itens || []
  const duplicatas = formData.duplicatas || []
  const pagamentos = formData.pagamentos || []

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  const getTipoOperacaoLabel = (tipo: number) => {
    return tipo === 0 ? 'Entrada' : 'Saída'
  }

  const getFinalidadeLabel = (finalidade: number) => {
    const labels = ['Normal', 'Complementar', 'Ajuste', 'Devolução', 'Devolução de Mercadoria']
    return labels[finalidade] || 'Normal'
  }

  const getConsumidorFinalLabel = (consumidor: number) => {
    return consumidor === 1 ? 'Sim' : 'Não'
  }

  const getModalidadeFreteLabel = (modalidade: number) => {
    const labels = {
      0: 'Por conta do emitente',
      1: 'Por conta do destinatário',
      2: 'Por conta de terceiros',
      9: 'Sem frete'
    }
    return labels[modalidade as keyof typeof labels] || 'Sem frete'
  }

  return (
    <div className="space-y-4">
      {/* Resumo Financeiro - Compacto */}
      <Card className="py-3">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <IconCheck className="h-4 w-4 text-green-600" />
            Resumo da NFe
          </CardTitle>
          <CardDescription className="text-xs">
            Confira todos os dados antes de salvar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="text-xl font-bold text-primary">
                {formatCurrency(totals.valorTotal)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Valor Total</div>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold">{itens.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {itens.length === 1 ? 'Item' : 'Itens'}
              </div>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold">{duplicatas.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Duplicatas</div>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold">{pagamentos.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Pagamentos</div>
            </div>
          </div>

          {/* Impostos */}
          <Separator className="my-3" />
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">ICMS:</span>
              <span className="font-medium ml-2">{formatCurrency(totals.valorICMS)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">IPI:</span>
              <span className="font-medium ml-2">{formatCurrency(totals.valorIPI)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">PIS:</span>
              <span className="font-medium ml-2">{formatCurrency(totals.valorPIS)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">COFINS:</span>
              <span className="font-medium ml-2">{formatCurrency(totals.valorCOFINS)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFileText className="h-5 w-5" />
            Dados Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Emitente:</span>
              <p className="font-medium">{emitente?.razaoSocial}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Série:</span>
              <p className="font-medium">{formData.serie}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Natureza da Operação:</span>
              <p className="font-medium">{formData.naturezaOperacao}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tipo de Operação:</span>
              <p className="font-medium">{getTipoOperacaoLabel(formData.tipoOperacao)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Finalidade:</span>
              <p className="font-medium">{getFinalidadeLabel(formData.finalidade)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Consumidor Final:</span>
              <p className="font-medium">{getConsumidorFinalLabel(formData.consumidorFinal)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data de Emissão:</span>
              <p className="font-medium">{formatDate(formData.dataEmissao)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data de Saída:</span>
              <p className="font-medium">{formatDate(formData.dataSaida)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Modalidade de Frete:</span>
              <p className="font-medium">{getModalidadeFreteLabel(formData.modalidadeFrete)}</p>
            </div>
          </div>

          {formData.informacoesAdicionais && (
            <>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Informações Adicionais:</span>
                <p className="font-medium mt-1">{formData.informacoesAdicionais}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackage className="h-5 w-5" />
            Itens ({itens.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.descricao}</div>
                      <div className="text-xs text-muted-foreground">
                        Código: {item.codigo}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantidadeComercial} {item.unidadeComercial}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.valorUnitario)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(totals.valorProdutos)}</span>
              </div>
              {formData.valorFrete > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete:</span>
                  <span className="font-medium">{formatCurrency(formData.valorFrete)}</span>
                </div>
              )}
              {formData.valorSeguro > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seguro:</span>
                  <span className="font-medium">{formatCurrency(formData.valorSeguro)}</span>
                </div>
              )}
              {formData.valorDesconto > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(formData.valorDesconto)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(totals.valorTotal)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cobrança */}
      {(duplicatas.length > 0 || pagamentos.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCash className="h-5 w-5" />
              Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Duplicatas */}
            {duplicatas.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Duplicatas ({duplicatas.length})</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {duplicatas.map((dup: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dup.numero}</TableCell>
                          <TableCell>{formatDate(dup.dataVencimento)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(dup.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Pagamentos */}
            {pagamentos.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Formas de Pagamento ({pagamentos.length})</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicador</TableHead>
                        <TableHead>Forma</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
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
                          <TableCell className="text-right">{formatCurrency(pag.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

