"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconPlus, IconSearch, IconHome, IconFileInvoice } from "@tabler/icons-react"
import { NfeDataTable } from "@/components/nfe/nfe-data-table"
import { NfeService, Nfe } from "@/lib/services/nfe.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function NfesPage() {
  const router = useRouter()
  const [nfes, setNfes] = useState<Nfe[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadNfes()
  }, [page, search])

  const loadNfes = async () => {
    try {
      setLoading(true)
      const response = await NfeService.getAll({ page, limit: 20, search })
      setNfes(response?.data || [])
    } catch (error) {
      console.error("Erro ao carregar NFes:", error)
      toast.error("Erro ao carregar NFes")
      setNfes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
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
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconFileInvoice className="h-4 w-4" />
                    NFes
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {/* Header com botão */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número, cliente..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => router.push("/fiscal/nfe/nova")}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Nova NFe
                  </Button>
                </div>

                {/* Table */}
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <NfeDataTable nfes={nfes} onRefresh={loadNfes} />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

