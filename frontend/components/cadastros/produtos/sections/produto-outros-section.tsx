import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { FornecedorCombobox } from "@/components/shared/combobox/fornecedor-combobox"
import { ProdutoSectionProps } from "@/types"

export function ProdutoOutrosSection({ form }: ProdutoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Fornecedor */}
      <FormField
        control={form.control}
        name="fornecedorId"
        render={({ field }) => (
          <FormItem className="md:col-span-2 space-y-1">
            <FormLabel className="text-xs font-medium">Fornecedor Principal</FormLabel>
            <FornecedorCombobox value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o fornecedor" />
            <FormDescription className="text-[10px]">Fornecedor padrão para compra deste produto</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status Ativo */}
      <FormField
        control={form.control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:col-span-2">
            <div className="space-y-0.5">
              <FormLabel className="text-sm">Produto Ativo</FormLabel>
              <FormDescription className="text-[10px]">Produto disponível para venda e emissão de notas fiscais</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

