"use client"

import { useState } from "react"
import { MatrizFiscalDataTable } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-data-table"
import { MatrizFiscalFormDialog } from "@/components/cadastros/matriz-fiscal/matriz-fiscal-form-dialog"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

export default function MatrizesFiscaisPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setDialogOpen(false)
    setRefreshKey(prev => prev + 1) // Força refresh da tabela
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrizes Fiscais</h1>
          <p className="text-muted-foreground">
            Gerencie as regras de tributação automática
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nova Matriz
        </Button>
      </div>

      {/* DataTable */}
      <MatrizFiscalDataTable key={refreshKey} />

      {/* Dialog de Cadastro */}
      <MatrizFiscalFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

