"use client"

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
import { MatrizFiscalDataTable } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-data-table"
import { IconHome, IconTable } from "@tabler/icons-react"

export default function MatrizesFiscaisPage() {

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
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconTable className="h-4 w-4" />
                    Matrizes Fiscais
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <MatrizFiscalDataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

