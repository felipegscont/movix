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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EmitenteFormData } from "../types"

interface NfeSectionProps {
  form: UseFormReturn<EmitenteFormData>
}

export function NfeSection({ form }: NfeSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ambiente NFe */}
        <FormField
          control={form.control}
          name="ambienteNfe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ambiente NFe *</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Produção</SelectItem>
                  <SelectItem value="2">Homologação</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  )
}

