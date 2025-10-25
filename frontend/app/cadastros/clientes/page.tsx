"use client"

import Link from "next/link"
import { AppSidebar, SiteHeader, SidebarLayout } from "@/components/layout"
import { ClientesSectionCards, ClientesDataTable } from "@/components/cadastros/clientes"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconHome, IconUsers } from "@tabler/icons-react"

/**
 * Página principal de gerenciamento de clientes
 *
 * Funcionalidades:
 * - Exibição de estatísticas de clientes em cards
 * - Listagem de clientes com filtros e paginação
 * - Criação, edição e exclusão de clientes
 * - Busca e filtros avançados
 */
export default function ClientesPage() {
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
                    <IconUsers className="h-4 w-4" />
                    Clientes
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
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
