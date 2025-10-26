"use client"

import { UseFormReturn } from "react-hook-form"
import { TotaisSection } from "@/components/vendas/shared/totais-section"

interface OrcamentoStepTotaisProps {
  form: UseFormReturn<any>
  subtotal: number
  valorTotal: number
}

export function OrcamentoStepTotais({ form, subtotal, valorTotal }: OrcamentoStepTotaisProps) {
  return (
    <TotaisSection
      form={form}
      subtotal={subtotal}
      valorTotal={valorTotal}
      showObservacoes={true}
    />
  )
}

