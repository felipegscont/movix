"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NaturezaOperacaoFiscalForm } from "@/components/configuracoes/natureza-operacao/natureza-operacao-fiscal-form"
import { IconHome, IconFileInvoice, IconPlus } from "@tabler/icons-react"

export default function NovaNaturezaOperacaoPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/configuracoes/naturezas-operacao')
  }

  const handleCancel = () => {
    router.push('/configuracoes/naturezas-operacao')
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
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
                    <IconPlus className="h-4 w-4" />
                    Nova
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <NaturezaOperacaoFiscalForm
              naturezaId={undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
