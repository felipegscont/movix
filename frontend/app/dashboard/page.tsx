import Link from "next/link"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SectionCards } from "@/components/dashboard/section-cards"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "@/components/dashboard/data-table"
import { IconHome, IconChartBar } from "@tabler/icons-react"
import data from "./data.json"

export default function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <IconHome className="h-4 w-4" />
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Cards de Resumo */}
            <SectionCards />

            {/* Gráfico Interativo */}
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            {/* Tabela de Dados */}
            <div className="px-4 lg:px-6">
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
