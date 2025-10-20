"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { ClientesSectionCards } from "@/components/cadastros/clientes/clientes-section-cards"
import { ClientesDataTable } from "@/components/cadastros/clientes/clientes-data-table"
import { SidebarInset } from "@/components/ui/sidebar"

export default function ClientesPage() {
  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ClientesSectionCards />
              <ClientesDataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}
