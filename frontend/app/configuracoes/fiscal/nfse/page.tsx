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
import { IconHome, IconSettings, IconFileInvoice } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"

export default function Page() {
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
                  <Link href="/configuracoes" className="flex items-center gap-1.5">
                    <IconSettings className="h-4 w-4" />
                    Configurações
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Configurações NFS-e</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Configurações NFS-e</h1>
                <p className="text-muted-foreground">Configure a nota fiscal de serviço eletrônica</p>
              </div>
              
              <Alert>
                <IconAlertCircle className="h-4 w-4" />
                <AlertTitle>Em Desenvolvimento</AlertTitle>
                <AlertDescription>
                  Esta página está em desenvolvimento e será implementada em breve.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
