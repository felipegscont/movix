"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { NfeService, Nfe } from "@/lib/services/nfe.service"
import { Skeleton } from "@/components/ui/skeleton"

interface NfeDetailsProps {
  nfeId: string
}

export function NfeDetails({ nfeId }: NfeDetailsProps) {
  const [nfe, setNfe] = useState<Nfe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNfe()
  }, [nfeId])

  const loadNfe = async () => {
    try {
      setLoading(true)
      const data = await NfeService.getById(nfeId)
      setNfe(data)
    } catch (error) {
      console.error("Erro ao carregar NFe:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!nfe) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">NFe não encontrada</p>
        </CardContent>
      </Card>
    )
  }

  const statusColors = {
    DIGITACAO: "bg-yellow-500",
    AUTORIZADA: "bg-green-500",
    CANCELADA: "bg-red-500",
    REJEITADA: "bg-destructive",
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            NFe #{nfe.numero.toString().padStart(6, '0')}
          </h1>
          <p className="text-muted-foreground">
            Série {nfe.serie} • {new Date(nfe.dataEmissao).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <Badge className={statusColors[nfe.status]}>
          {nfe.status}
        </Badge>
      </div>

      {/* Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Emitente</p>
              <p className="text-base">{nfe.emitente?.razaoSocial}</p>
              <p className="text-sm text-muted-foreground">{nfe.emitente?.cnpj}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="text-base">{nfe.cliente?.nome}</p>
              <p className="text-sm text-muted-foreground">{nfe.cliente?.documento}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Natureza da Operação</p>
              <p className="text-base">{nfe.naturezaOperacao}</p>
            </div>
            {nfe.chave && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chave de Acesso</p>
                <p className="text-xs font-mono">{nfe.chave}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Totalizadores */}
      <Card>
        <CardHeader>
          <CardTitle>Totalizadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor dos Produtos:</span>
              <span className="font-medium">
                {nfe.valorTotalProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            
            {nfe.valorFrete && nfe.valorFrete > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete:</span>
                <span className="font-medium">
                  {nfe.valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}
            
            {nfe.valorSeguro && nfe.valorSeguro > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seguro:</span>
                <span className="font-medium">
                  {nfe.valorSeguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}
            
            {nfe.valorDesconto && nfe.valorDesconto > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desconto:</span>
                <span className="font-medium text-green-600">
                  - {nfe.valorDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}
            
            {nfe.valorOutros && nfe.valorOutros > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outras Despesas:</span>
                <span className="font-medium">
                  {nfe.valorOutros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}

            {/* Totalizadores Raros */}
            {(nfe.valorICMSDesonerado || nfe.valorFCP || nfe.valorII || nfe.valorOutrasDespesas) && (
              <>
                <Separator className="my-2" />
                <p className="text-sm font-medium text-muted-foreground">Totalizadores Opcionais</p>
                
                {nfe.valorICMSDesonerado && nfe.valorICMSDesonerado > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ICMS Desonerado:</span>
                    <span className="text-sm">
                      {nfe.valorICMSDesonerado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                )}
                
                {nfe.valorFCP && nfe.valorFCP > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">FCP:</span>
                    <span className="text-sm">
                      {nfe.valorFCP.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                )}
                
                {nfe.valorII && nfe.valorII > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Imposto de Importação:</span>
                    <span className="text-sm">
                      {nfe.valorII.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                )}
                
                {nfe.valorOutrasDespesas && nfe.valorOutrasDespesas > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Outras Despesas Acessórias:</span>
                    <span className="text-sm">
                      {nfe.valorOutrasDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                )}
              </>
            )}
            
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Valor Total:</span>
              <span>
                {nfe.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicatas */}
      {nfe.duplicatas && nfe.duplicatas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Duplicatas / Parcelamento</CardTitle>
            <CardDescription>
              {nfe.duplicatas.length} parcela{nfe.duplicatas.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nfe.duplicatas.map((duplicata, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{duplicata.numero}</TableCell>
                    <TableCell>
                      {new Date(duplicata.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {duplicata.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Informações Adicionais */}
      {nfe.informacoesAdicionais && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{nfe.informacoesAdicionais}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

