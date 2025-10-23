"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NfeFormData } from "../types"

interface NfeStepCobrancaProps {
  formData: NfeFormData
  updateFormData: (data: Partial<NfeFormData>) => void
  errors: Record<string, string[]>
}

export function NfeStepCobranca({ formData, updateFormData, errors }: NfeStepCobrancaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobrança</CardTitle>
        <CardDescription>
          Configure duplicatas e formas de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Componente de cobrança em desenvolvimento...</p>
          <p className="text-sm mt-2">
            Duplicatas: {formData.duplicatas?.length || 0} | 
            Pagamentos: {formData.pagamentos?.length || 0}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
