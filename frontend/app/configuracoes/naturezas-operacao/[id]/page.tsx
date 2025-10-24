"use client"

import { useParams, useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { NaturezaOperacaoFiscalForm } from "@/components/configuracoes/natureza-operacao/natureza-operacao-fiscal-form"

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
        <SiteHeader />
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
