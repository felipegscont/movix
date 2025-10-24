"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconTrash, IconSearch } from "@tabler/icons-react"
import { toast } from "sonner"

interface Produto {
  id: string
  codigo: string
  descricao: string
  ncm?: string
  unidade: string
}

interface ProdutoExcecao {
  id: string
  produto: Produto
  cfopEspecifico?: {
    id: string
    codigo: string
    descricao: string
  }
  observacao?: string
}

interface NaturezaOperacaoProdutosExcecaoProps {
  naturezaId?: string
}

export function NaturezaOperacaoProdutosExcecao({
  naturezaId,
}: NaturezaOperacaoProdutosExcecaoProps) {
  const [produtosExcecao, setProdutosExcecao] = useState<ProdutoExcecao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  // Dados mockados para demonstração
  useEffect(() => {
    loadProdutosExcecao()
  }, [naturezaId])

  const loadProdutosExcecao = async () => {
    // Mock de dados conforme o exemplo fornecido
    const mockProdutos: ProdutoExcecao[] = [
      {
        id: "1",
        produto: {
          id: "prod1",
          codigo: "19540",
          descricao: "PERFENOL COMP",
          ncm: "30049099",
          unidade: "UN",
        },
        cfopEspecifico: {
          id: "cfop1",
          codigo: "5403",
          descricao: "Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituto",
        },
        observacao: "Produto sujeito à substituição tributária",
      },
    ]

    setProdutosExcecao(mockProdutos)
  }

  const handleAddProduto = () => {
    // Em produção, abriria um modal para selecionar produto e configurar exceção
    toast.info("Funcionalidade em desenvolvimento")
  }

  const handleRemoveProduto = (id: string) => {
    setProdutosExcecao(prev => prev.filter(item => item.id !== id))
    toast.success("Produto removido das exceções!")
  }

  const filteredProdutos = produtosExcecao.filter(item =>
    item.produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto.ncm?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Informações de exemplo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="space-y-2">
          <div>
            <span className="font-medium text-blue-800">CFOP</span>
            <div className="text-sm text-blue-700">
              [5403] Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituto
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Item</span>
            <div className="text-sm text-blue-700">
              [19540] PERFENOL COMP
            </div>
          </div>
        </div>
      </div>

      {/* Seção de busca e adição */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos com Exceção</CardTitle>
          <CardDescription>
            Configure produtos que devem usar CFOPs específicos diferentes do padrão da natureza de operação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, descrição ou NCM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleAddProduto}
              className="bg-green-600 hover:bg-green-700"
            >
              <IconPlus className="mr-2 h-4 w-4" />
              ADICIONAR PRODUTO
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de produtos com exceção */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos com Exceção</CardTitle>
          <CardDescription>
            Produtos configurados com CFOPs específicos para esta natureza de operação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProdutos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <>Nenhum produto encontrado com o termo "{searchTerm}"</>
              ) : (
                <>Nenhum produto com exceção configurado. Use o botão "ADICIONAR PRODUTO" para começar.</>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição do Produto</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>CFOP Específico</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {item.produto.codigo}
                    </TableCell>
                    <TableCell>
                      {item.produto.descricao}
                    </TableCell>
                    <TableCell>
                      {item.produto.ncm ? (
                        <Badge variant="outline">{item.produto.ncm}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.produto.unidade}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.cfopEspecifico ? (
                        <div className="space-y-1">
                          <div className="font-medium">{item.cfopEspecifico.codigo}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.cfopEspecifico.descricao}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Não configurado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.observacao ? (
                        <span className="text-sm">{item.observacao}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProduto(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Como funciona:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Produtos listados aqui usarão o CFOP específico configurado</li>
              <li>Produtos não listados usarão o CFOP padrão da natureza de operação</li>
              <li>Esta configuração tem prioridade sobre os CFOPs padrão</li>
              <li>Útil para produtos com tributação especial ou regimes diferenciados</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
