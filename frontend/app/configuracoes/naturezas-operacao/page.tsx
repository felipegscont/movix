"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { NaturezaOperacaoSectionCards } from "@/components/configuracoes/natureza-operacao/natureza-operacao-section-cards"
import { NaturezaOperacaoDataTable } from "@/components/configuracoes/natureza-operacao/natureza-operacao-data-table"
import { NaturezaOperacaoFiscalForm } from "@/components/configuracoes/natureza-operacao/natureza-operacao-fiscal-form"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { IconList, IconSettings, IconArrowLeft } from "@tabler/icons-react"

/**
 * Página principal de gerenciamento de naturezas de operação
 *
 * Funcionalidades:
 * - Exibição de estatísticas de naturezas em cards
 * - Listagem de naturezas com filtros e paginação
 * - Criação, edição e exclusão de naturezas
 * - Busca e filtros avançados
 * - Interface fiscal para configuração detalhada de CFOPs
 */
export default function NaturezasOperacaoPage() {
  const [viewMode, setViewMode] = useState<"list" | "fiscal">("list")
  const [selectedNaturezaId, setSelectedNaturezaId] = useState<string>()

  const handleOpenFiscalView = (naturezaId?: string) => {
    setSelectedNaturezaId(naturezaId)
    setViewMode("fiscal")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedNaturezaId(undefined)
  }

  if (viewMode === "fiscal") {
    return (
      <SidebarLayout>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col">
              <NaturezaOperacaoFiscalForm
                naturezaId={selectedNaturezaId}
                onSuccess={handleBackToList}
                onCancel={handleBackToList}
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header com botões de visualização */}
              <div className="flex items-center justify-between px-4 lg:px-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Naturezas de Operação</h1>
                  <p className="text-muted-foreground">
                    Configure naturezas de operação para facilitar a emissão de notas fiscais
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => setViewMode("list")}
                  >
                    <IconList className="mr-2 h-4 w-4" />
                    Visualização Lista
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenFiscalView()}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  >
                    <IconSettings className="mr-2 h-4 w-4" />
                    Interface Fiscal
                  </Button>
                </div>
              </div>

              <NaturezaOperacaoSectionCards />
              <NaturezaOperacaoDataTable onOpenFiscalView={handleOpenFiscalView} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

