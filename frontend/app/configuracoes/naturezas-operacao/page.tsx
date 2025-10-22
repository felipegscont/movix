"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { NaturezaOperacaoSectionCards } from "@/components/configuracoes/natureza-operacao/natureza-operacao-section-cards"
import { NaturezaOperacaoDataTable } from "@/components/configuracoes/natureza-operacao/natureza-operacao-data-table"
import { SidebarInset } from "@/components/ui/sidebar"

/**
 * Página principal de gerenciamento de naturezas de operação
 *
 * Funcionalidades:
 * - Exibição de estatísticas de naturezas em cards
 * - Listagem de naturezas com filtros e paginação
 * - Criação, edição e exclusão de naturezas
 * - Busca e filtros avançados
 */
export default function NaturezasOperacaoPage() {
  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <NaturezaOperacaoSectionCards />
              <NaturezaOperacaoDataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

