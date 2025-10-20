"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconBox,
  IconEdit,
  IconTrash,
  IconShoppingCart,
  IconReceipt,
  IconTrendingUp,
  IconAlertCircle,
  IconClock,
  IconCalendar,
  IconCheck,
  IconX,
  IconHistory,
  IconBarcode,
  IconCurrencyReal,
  IconPackage,
  IconFileText,
  IconScale,
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProdutoService, type Produto } from "@/lib/services/produto.service"
import { toast } from "sonner"

export default function ProdutoViewPage() {
  const params = useParams()
  const router = useRouter()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduto()
  }, [params.id])

  const loadProduto = async () => {
    try {
      setLoading(true)
      const data = await ProdutoService.getById(params.id as string)
      setProduto(data)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      toast.error("Erro ao carregar produto")
      router.push("/produtos")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    toast.info("Funcionalidade em desenvolvimento")
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      await ProdutoService.delete(params.id as string)
      toast.success("Produto excluído com sucesso!")
      router.push("/produtos")
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao excluir produto")
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date?: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <SidebarLayout>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Carregando produto...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarLayout>
    )
  }

  if (!produto) {
    return null
  }

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-1"
                  onClick={() => router.push("/produtos")}
                >
                  <IconArrowLeft className="h-5 w-5" />
                </Button>
                
                {/* Avatar com Ícone */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white">
                  <IconBox className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{produto.descricao}</h1>
                    <Badge variant={produto.ativo ? "default" : "secondary"}>
                      {produto.ativo ? (
                        <>
                          <IconCheck className="mr-1 h-3 w-3" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <IconX className="mr-1 h-3 w-3" />
                          Inativo
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {produto.codigo && (
                      <div className="flex items-center gap-1">
                        <IconBarcode className="h-4 w-4" />
                        Código: {produto.codigo}
                      </div>
                    )}
                    {produto.unidade && (
                      <div className="flex items-center gap-1">
                        <IconScale className="h-4 w-4" />
                        Unidade: {produto.unidade}
                      </div>
                    )}
                    {produto.valorVenda && (
                      <div className="flex items-center gap-1 font-semibold text-green-600">
                        <IconCurrencyReal className="h-4 w-4" />
                        {formatCurrency(produto.valorVenda)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <IconEdit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estoque Atual</p>
                      <p className="text-2xl font-bold">{produto.estoque || 0}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <IconPackage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Venda</p>
                      <p className="text-2xl font-bold">{formatCurrency(produto.valorVenda || 0)}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <IconCurrencyReal className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vendas (mês)</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <IconShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Estoque</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency((produto.estoque || 0) * (produto.valorVenda || 0))}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <IconTrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Coluna Principal - 2/3 */}
              <div className="space-y-6 lg:col-span-2">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconBox className="h-5 w-5" />
                      Informações do Produto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Código</p>
                        <p className="text-sm">{produto.codigo || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                        <p className="text-sm">{produto.descricao}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Unidade</p>
                        <p className="text-sm">{produto.unidade || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Estoque</p>
                        <p className="text-sm font-semibold">{produto.estoque || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Valor Custo</p>
                        <p className="text-sm">{formatCurrency(produto.valorCusto || 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Valor Venda</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(produto.valorVenda || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações Fiscais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconFileText className="h-5 w-5" />
                      Informações Fiscais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">NCM</p>
                        <p className="text-sm font-mono">{produto.ncm || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">CEST</p>
                        <p className="text-sm font-mono">{produto.cest || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">CFOP</p>
                        <p className="text-sm font-mono">{produto.cfop || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Origem</p>
                        <p className="text-sm">{produto.origem !== undefined ? produto.origem : "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Atividades Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconHistory className="h-5 w-5" />
                      Histórico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <IconCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="w-px flex-1 bg-border" />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">Produto cadastrado</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(produto.createdAt)}
                          </p>
                        </div>
                      </div>

                      {produto.updatedAt && produto.updatedAt !== produto.createdAt && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                              <IconEdit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Última atualização</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(produto.updatedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coluna Lateral - 1/3 */}
              <div className="space-y-6">
                {/* Ações Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <IconShoppingCart className="mr-2 h-4 w-4" />
                      Nova Venda
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <IconPackage className="mr-2 h-4 w-4" />
                      Ajustar Estoque
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <IconReceipt className="mr-2 h-4 w-4" />
                      Histórico de Vendas
                    </Button>
                  </CardContent>
                </Card>

                {/* Informações Adicionais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={produto.ativo ? "default" : "secondary"}>
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
                      <p className="text-sm font-semibold text-green-600">
                        {produto.valorCusto && produto.valorVenda
                          ? `${(((produto.valorVenda - produto.valorCusto) / produto.valorCusto) * 100).toFixed(1)}%`
                          : "-"}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                      <p className="text-sm">{formatDate(produto.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

