"use client"

import { UseFormReturn } from "react-hook-form"
import { TotaisSection } from "@/components/vendas/shared/totais-section"
import { PagamentosSection } from "@/components/vendas/shared/pagamentos-section"

interface PedidoStepTotaisProps {
  form: UseFormReturn<any>
  subtotal: number
  valorTotal: number
}

export function PedidoStepTotais({ form, subtotal, valorTotal }: PedidoStepTotaisProps) {
  return (
    <div className="space-y-3">
      {/* Totais e Observações */}
      <TotaisSection
        form={form}
        subtotal={subtotal}
        valorTotal={valorTotal}
        showObservacoes={true}
      />

      {/* Pagamentos */}
      <PagamentosSection
        form={form}
        valorTotal={valorTotal}
      />
    </div>
  )
}

