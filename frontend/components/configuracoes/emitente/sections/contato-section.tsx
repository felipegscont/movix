import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { EmitenteFormData } from "@/lib/schemas/emitente.schema"

interface ContatoSectionProps {
  form: UseFormReturn<EmitenteFormData>
}

export function ContatoSection({ form }: ContatoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Telefone */}
      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...field} placeholder="(00) 00000-0000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="contato@empresa.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Site */}
      <FormField
        control={form.control}
        name="site"
        render={({ field }) => (
          <FormItem className="md:col-span-3">
            <FormLabel>Site</FormLabel>
            <FormControl>
              <Input {...field} placeholder="www.empresa.com.br" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

