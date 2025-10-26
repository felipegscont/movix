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
  IconCreditCard,
  IconHistory,
  IconEdit,
  IconTrash,
  IconShoppingCart,
  IconReceipt,
  IconClock,
  IconCalendar,
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconHome,
  IconUsers,
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/layout"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ClienteService, type Cliente } from "@/lib/services/cliente.service"
import { toast } from "sonner"

export default function ClienteViewPage() {
  const params = useParams()
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCliente()
  }, [params.id])

  const loadCliente = async () => {
    try {
      setLoading(true)
      const data = await ClienteService.getById(params.id as string)
      setCliente(data)
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      toast.error("Erro ao carregar cliente")
      router.push("/cadastros/clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    // TODO: Abrir dialog de edição
    toast.info("Funcionalidade em desenvolvimento")
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    try {
      await ClienteService.delete(params.id as string)
      toast.success("Cliente excluído com sucesso!")
      router.push("/cadastros/clientes")
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente")
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
              <span>Carregando cliente...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!cliente) {
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
                  <Link href="/cadastros/clientes" className="flex items-center gap-1.5">
                    <IconUsers className="h-4 w-4" />
                    Clientes
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {cliente?.nome || "Detalhes"}
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {cliente.nome.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{cliente.nome}</h1>
                    <Badge variant={cliente.ativo ? "default" : "secondary"}>
                      {cliente.ativo ? (
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
                      {cliente.tipo === "JURIDICA" ? (
                        <>
                          <IconBuilding className="mr-1 h-3 w-3" />
                          Pessoa Jurídica
                        </>
                      ) : (
                        <>
                          <IconUser className="mr-1 h-3 w-3" />
                          Pessoa Física
                        </>
                      )}
                    </Badge>
                  </div>

                  {cliente.nomeFantasia && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cliente.nomeFantasia}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconFileText className="h-4 w-4" />
                      {formatDocument(cliente.documento, cliente.tipo)}
                    </div>
                    {cliente.email && (
                      <div className="flex items-center gap-1">
                        <IconMail className="h-4 w-4" />
                        {cliente.email}
                      </div>
                    )}
                    {(cliente.celular || cliente.telefone) && (
                      <div className="flex items-center gap-1">
                        <IconPhone className="h-4 w-4" />
                        {cliente.celular || cliente.telefone}
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
                      <p className="text-xs font-medium text-muted-foreground">Total de Pedidos</p>
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
                      <p className="text-xs font-medium text-muted-foreground">Total Faturado</p>
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
                      <p className="text-xs font-medium text-muted-foreground">Último Pedido</p>
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
                        {cliente.email ? (
                          <a
                            href={`mailto:${cliente.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {cliente.email}
                          </a>
                        ) : (
                          <p className="text-sm">-</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p className="text-sm">{cliente.telefone || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Celular</p>
                        <p className="text-sm">{cliente.celular || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Documento</p>
                        <p className="text-sm">{formatDocument(cliente.documento, cliente.tipo)}</p>
                      </div>
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
                      {cliente.cep && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CEP</p>
                            <p className="text-sm">{cliente.cep}</p>
                          </div>
                        </div>
                      )}
                      {cliente.logradouro && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
                          <p className="text-sm">
                            {cliente.logradouro}
                            {cliente.numero && `, ${cliente.numero}`}
                          </p>
                        </div>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {cliente.bairro && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                            <p className="text-sm">{cliente.bairro}</p>
                          </div>
                        )}
                        {cliente.municipio && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Cidade/UF</p>
                            <p className="text-sm">
                              {cliente.municipio.nome}/{cliente.municipio.estado.uf}
                            </p>
                          </div>
                        )}
                      </div>
                      {cliente.complemento && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                          <p className="text-sm">{cliente.complemento}</p>
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
                          <p className="text-sm font-medium">Cliente cadastrado</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(cliente.createdAt)}
                          </p>
                        </div>
                      </div>

                      {cliente.updatedAt && cliente.updatedAt !== cliente.createdAt && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                              <IconEdit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Última atualização</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(cliente.updatedAt)}
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
                      Novo Pedido
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
                        {cliente.tipo === "JURIDICA" ? "Pessoa Jurídica" : "Pessoa Física"}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={cliente.ativo ? "default" : "secondary"}>
                        {cliente.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                      <p className="text-sm">{formatDate(cliente.createdAt)}</p>
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
