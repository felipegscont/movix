"use client"

import { useParams } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { MatrizFiscalForm } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-form"

export default function EditarMatrizFiscalPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-semibold">Editar Matriz Fiscal</h1>
          <MatrizFiscalForm matrizId={id} />
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

