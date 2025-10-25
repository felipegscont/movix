"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { MatrizFiscalDataTable } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-data-table"
import { Button } from "@/components/ui/button"
import { IconPlus, IconHome, IconTable } from "@tabler/icons-react"

export default function MatrizesFiscaisPage() {
  const router = useRouter()

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
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconTable className="h-4 w-4" />
                    Matrizes Fiscais
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-end mb-4">
                  <Button size="sm" onClick={() => router.push("/matrizes-fiscais/nova")}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Nova Matriz
                  </Button>
                </div>

                <MatrizFiscalDataTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

