"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NaturezaOperacaoFiscalForm } from "@/components/configuracoes/natureza-operacao/natureza-operacao-fiscal-form"
import { IconHome, IconFileInvoice, IconEdit } from "@tabler/icons-react"

export default function EditarNaturezaOperacaoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const handleSuccess = () => {
    router.push('/configuracoes/naturezas-operacao')
  }

  const handleCancel = () => {
    router.push('/configuracoes/naturezas-operacao')
  }

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          breadcrumb={
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/configuracoes/naturezas-operacao" className="flex items-center gap-1.5">
                      <IconFileInvoice className="h-4 w-4" />
                      Naturezas de Operação
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconEdit className="h-4 w-4" />
                    Editar
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <NaturezaOperacaoFiscalForm
              naturezaId={id}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}
