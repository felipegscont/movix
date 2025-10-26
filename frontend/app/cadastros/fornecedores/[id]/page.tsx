"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconUser,
  IconFileText,
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
  IconWorld,
  IconHome,
  IconTruck,
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FornecedorService, type Fornecedor } from "@/lib/services/fornecedor.service"
import { toast } from "sonner"

export default function FornecedorViewPage() {
  const params = useParams()
  const router = useRouter()
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFornecedor()
  }, [params.id])

  const loadFornecedor = async () => {
    try {
      setLoading(true)
      const data = await FornecedorService.getById(params.id as string)
      setFornecedor(data)
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error)
      toast.error("Erro ao carregar fornecedor")
      router.push("/cadastros/fornecedores")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    toast.info("Funcionalidade em desenvolvimento")
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return

    try {
      await FornecedorService.delete(params.id as string)
      toast.success("Fornecedor excluído com sucesso!")
      router.push("/cadastros/fornecedores")
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error)
      toast.error("Erro ao excluir fornecedor")
    }
  }

  const formatDocument = (doc: string, tipo: string) => {
    if (tipo === "JURIDICA") {
      return doc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    }
    return doc.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
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
      <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Carregando fornecedor...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!fornecedor) {
    return null
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">
                    <IconHome className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/cadastros/fornecedores" className="flex items-center gap-1.5">
                    <IconTruck className="h-4 w-4" />
                    Fornecedores
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {fornecedor?.nome || "Detalhes"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header com Avatar */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                {/* Avatar com Iniciais */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-2xl font-bold text-white">
                  {fornecedor.nome.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
                    <Badge variant={fornecedor.ativo ? "default" : "secondary"}>
                      {fornecedor.ativo ? (
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
                    <Badge variant="outline">
                      <IconBuilding className="mr-1 h-3 w-3" />
                      {fornecedor.tipo === "JURIDICA" ? "Pessoa Jurídica" : "Pessoa Física"}
                    </Badge>
                  </div>
                  
                  {fornecedor.nomeFantasia && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {fornecedor.nomeFantasia}
                    </p>
                  )}
                  
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconFileText className="h-4 w-4" />
                      {formatDocument(fornecedor.documento, fornecedor.tipo)}
                    </div>
                    {fornecedor.email && (
                      <div className="flex items-center gap-1">
                        <IconMail className="h-4 w-4" />
                        {fornecedor.email}
                      </div>
                    )}
                    {(fornecedor.celular || fornecedor.telefone) && (
                      <div className="flex items-center gap-1">
                        <IconPhone className="h-4 w-4" />
                        {fornecedor.celular || fornecedor.telefone}
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
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total de Compras</p>
                      <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <IconShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Gasto</p>
                      <p className="text-xl font-bold">R$ 0,00</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <IconTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Última Compra</p>
                      <p className="text-xl font-bold">-</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <IconClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Pendências</p>
                      <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <IconAlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Coluna Principal - 2/3 */}
              <div className="space-y-6 lg:col-span-2">
                {/* Informações de Contato */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconMail className="h-5 w-5" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        {fornecedor.email ? (
                          <a
                            href={`mailto:${fornecedor.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {fornecedor.email}
                          </a>
                        ) : (
                          <p className="text-sm">-</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p className="text-sm">{fornecedor.telefone || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Celular</p>
                        <p className="text-sm">{fornecedor.celular || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Documento</p>
                        <p className="text-sm">{formatDocument(fornecedor.documento, fornecedor.tipo)}</p>
                      </div>
                      {fornecedor.site && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Site</p>
                          <a
                            href={fornecedor.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <IconWorld className="h-3 w-3" />
                            {fornecedor.site}
                          </a>
                        </div>
                      )}
                      {fornecedor.contato && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Contato</p>
                          <p className="text-sm">{fornecedor.contato}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Endereço */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconMapPin className="h-5 w-5" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {fornecedor.cep && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CEP</p>
                            <p className="text-sm">{fornecedor.cep}</p>
                          </div>
                        </div>
                      )}
                      {fornecedor.logradouro && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
                          <p className="text-sm">
                            {fornecedor.logradouro}
                            {fornecedor.numero && `, ${fornecedor.numero}`}
                          </p>
                        </div>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {fornecedor.bairro && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                            <p className="text-sm">{fornecedor.bairro}</p>
                          </div>
                        )}
                        {fornecedor.municipio && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Cidade/UF</p>
                            <p className="text-sm">
                              {fornecedor.municipio.nome}/{fornecedor.municipio.estado.uf}
                            </p>
                          </div>
                        )}
                      </div>
                      {fornecedor.complemento && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                          <p className="text-sm">{fornecedor.complemento}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Atividades Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconHistory className="h-5 w-5" />
                      Atividades Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Timeline Item */}
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <IconCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="w-px flex-1 bg-border" />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">Fornecedor cadastrado</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(fornecedor.createdAt)}
                          </p>
                        </div>
                      </div>

                      {fornecedor.updatedAt && fornecedor.updatedAt !== fornecedor.createdAt && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                              <IconEdit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Última atualização</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(fornecedor.updatedAt)}
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
                      Nova Compra
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <IconReceipt className="mr-2 h-4 w-4" />
                      Nova Nota Fiscal
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <IconFileText className="mr-2 h-4 w-4" />
                      Gerar Relatório
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
                      <p className="text-sm font-medium text-muted-foreground">Tipo de Pessoa</p>
                      <p className="text-sm">
                        {fornecedor.tipo === "JURIDICA" ? "Pessoa Jurídica" : "Pessoa Física"}
                      </p>
                    </div>
                    {fornecedor.inscricaoEstadual && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Inscrição Estadual</p>
                          <p className="text-sm">{fornecedor.inscricaoEstadual}</p>
                        </div>
                      </>
                    )}
                    {fornecedor.inscricaoMunicipal && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Inscrição Municipal</p>
                          <p className="text-sm">{fornecedor.inscricaoMunicipal}</p>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={fornecedor.ativo ? "default" : "secondary"}>
                        {fornecedor.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                      <p className="text-sm">{formatDate(fornecedor.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

