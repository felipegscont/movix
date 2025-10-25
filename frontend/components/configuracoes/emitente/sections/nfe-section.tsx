import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { StaticCombobox, AMBIENTE_NFE_OPTIONS } from "@/components/shared/combobox/static-combobox"
import type { EmitenteFormData } from "@/lib/schemas/emitente.schema"

interface NfeSectionProps {
  form: UseFormReturn<EmitenteFormData>
}

export function NfeSection({ form }: NfeSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Ambiente NFe */}
      <FormField
        control={form.control}
        name="ambienteNfe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ambiente NFe *</FormLabel>
            <FormControl>
              <StaticCombobox
                options={AMBIENTE_NFE_OPTIONS}
                value={field.value}
                onValueChange={(value) => field.onChange(value as number)}
                placeholder="Selecione o ambiente"
              />
            </FormControl>
            <FormDescription>
              Use Homologação para testes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Série NFe */}
      <FormField
        control={form.control}
        name="serieNfe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Série NFe *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={1}
                max={999}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormDescription>
              Série padrão das NFes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Próximo Número NFe */}
      <FormField
        control={form.control}
        name="proximoNumeroNfe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Próximo Número NFe *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={1}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormDescription>
              Próxima numeração
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

