"use client"

import { useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { MatrizFiscalDataTable } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-data-table"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

export default function MatrizesFiscaisPage() {
  const router = useRouter()

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Matrizes Fiscais</h1>
            <Button size="sm" onClick={() => router.push("/matrizes-fiscais/nova")}>
              <IconPlus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </div>

          <MatrizFiscalDataTable />
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

