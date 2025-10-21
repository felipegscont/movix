"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch } from "@tabler/icons-react"
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
      setNfes(response.data)
    } catch (error) {
      console.error("Erro ao carregar NFes:", error)
      toast.error("Erro ao carregar NFes")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Notas Fiscais Eletrônicas</h1>
                  <p className="text-muted-foreground">
                    Gerencie suas NFes de entrada e saída
                  </p>
                </div>
                <Button onClick={() => router.push("/nfes/nova")}>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Nova NFe
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, cliente..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <NfeDataTable data={nfes} onRefresh={loadNfes} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

