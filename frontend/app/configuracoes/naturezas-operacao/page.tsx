"use client"

import { useRouter } from "next/navigation"
import { SidebarLayout } from "@/components/layout/sidebar-layout"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { NaturezaOperacaoSectionCards } from "@/components/configuracoes/natureza-operacao/natureza-operacao-section-cards"
import { NaturezaOperacaoDataTable } from "@/components/configuracoes/natureza-operacao/natureza-operacao-data-table"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

/**
 * Página principal de gerenciamento de naturezas de operação
 *
 * Funcionalidades:
 * - Exibição de estatísticas de naturezas em cards
 * - Listagem de naturezas com filtros e paginação
 * - Navegação para criação e edição de naturezas
 * - Busca e filtros avançados
 */
export default function NaturezasOperacaoPage() {
  const router = useRouter()

  const handleEdit = (id: string) => {
    router.push(`/configuracoes/naturezas-operacao/${id}`)
  }

  return (
    <SidebarLayout>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Naturezas de Operação</h1>
              <p className="text-muted-foreground">
                Configure naturezas de operação para facilitar a emissão de notas fiscais
              </p>
            </div>
            <Button size="sm" onClick={() => router.push("/configuracoes/naturezas-operacao/nova")}>
              <IconPlus className="mr-2 h-4 w-4" />
              Nova
            </Button>
          </div>

          <NaturezaOperacaoSectionCards />
          <NaturezaOperacaoDataTable onEdit={handleEdit} />
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}

