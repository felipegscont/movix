"use client"

import { UseFormReturn } from "react-hook-form"
import { TotaisSection } from "@/components/vendas/shared/totais-section"

interface PedidoStepTotaisProps {
  form: UseFormReturn<any>
  subtotal: number
  valorTotal: number
}

export function PedidoStepTotais({ form, subtotal, valorTotal }: PedidoStepTotaisProps) {
  return (
    <TotaisSection
      form={form}
      subtotal={subtotal}
      valorTotal={valorTotal}
      showObservacoes={true}
    />
  )
}

