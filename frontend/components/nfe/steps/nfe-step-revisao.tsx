"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { NfeFormData } from "../types"

interface NfeStepRevisaoProps {
  formData: NfeFormData
  updateFormData: (data: Partial<NfeFormData>) => void
  errors: Record<string, string[]>
  totals: {
    subtotal: number
    total: number
    totalItens: number
    totalImpostos: {
      icms: number
      pis: number
      cofins: number
    }
  }
}

export function NfeStepRevisao({ formData, updateFormData, errors, totals }: NfeStepRevisaoProps) {
  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da NFe</CardTitle>
          <CardDescription>
            Confira todos os dados antes de salvar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {totals.total.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totals.totalItens}</div>
              <div className="text-sm text-muted-foreground">
                {totals.totalItens === 1 ? 'Item' : 'Itens'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {(totals.totalImpostos.icms + totals.totalImpostos.pis + totals.totalImpostos.cofins)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="text-sm text-muted-foreground">Total Impostos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente:</span>
            <span>{formData.clienteId || 'Não selecionado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Natureza:</span>
            <span>{formData.naturezaOperacao || 'Não informada'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <span>{formData.tipoOperacao === 1 ? 'Saída' : 'Entrada'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Emissão:</span>
            <span>{formData.dataEmissao || 'Não informada'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens ({totals.totalItens})</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.itens.length > 0 ? (
            <div className="space-y-2">
              {formData.itens.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">{item.codigo} - {item.descricao}</div>
                    <div className="text-sm text-muted-foreground">
                      Qtd: {item.quantidadeComercial} {item.unidadeComercial}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.valorTotal.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unit: {item.valorUnitario.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum item adicionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cobrança */}
      {(formData.duplicatas?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cobrança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.duplicatas?.map((dup, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">Duplicata {dup.numero}</div>
                    <div className="text-sm text-muted-foreground">
                      Vencimento: {new Date(dup.dataVencimento).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="font-medium">
                    {dup.valor.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erros */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Erros Encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <div key={field} className="text-sm">
                  <span className="font-medium text-red-600">{field}:</span>
                  <ul className="list-disc list-inside ml-4">
                    {fieldErrors.map((error, index) => (
                      <li key={index} className="text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
