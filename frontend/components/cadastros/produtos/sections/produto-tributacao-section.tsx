import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CSTCombobox } from "@/components/shared/combobox/cst-combobox"
import { ProdutoSectionProps } from "@/types"
import { ORIGEM_OPTIONS } from "@/lib/constants/produto.constants"
import { Separator } from "@/components/ui/separator"

export function ProdutoTributacaoSection({ form }: ProdutoSectionProps) {
  const watchRegimeTributario = form.watch("icmsCsosnId")

  return (
    <div className="space-y-3">
      {/* Origem */}
      <FormField
        control={form.control}
        name="origem"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">Origem da Mercadoria *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ORIGEM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="my-2" />

      {/* ICMS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">ICMS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* CST ICMS */}
          <FormField
            control={form.control}
            name="icmsCstId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">CST ICMS</FormLabel>
                <CSTCombobox tipo="ICMS" value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CST" />
                <FormDescription className="text-[10px]">Código de Situação Tributária do ICMS</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CSOSN */}
          <FormField
            control={form.control}
            name="icmsCsosnId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">CSOSN</FormLabel>
                <CSTCombobox tipo="CSOSN" value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CSOSN" />
                <FormDescription className="text-[10px]">Código de Situação da Operação no Simples Nacional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota ICMS */}
          <FormField
            control={form.control}
            name="icmsAliquota"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Alíquota ICMS (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Redução ICMS */}
          <FormField
            control={form.control}
            name="icmsReducao"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Redução Base ICMS (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="my-2" />

      {/* PIS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">PIS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* CST PIS */}
          <FormField
            control={form.control}
            name="pisCstId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">CST PIS *</FormLabel>
                <CSTCombobox tipo="PIS" value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CST" />
                <FormDescription className="text-[10px]">Código de Situação Tributária do PIS (obrigatório para NFe)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota PIS */}
          <FormField
            control={form.control}
            name="pisAliquota"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Alíquota PIS (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="my-2" />

      {/* COFINS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">COFINS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* CST COFINS */}
          <FormField
            control={form.control}
            name="cofinsCstId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">CST COFINS *</FormLabel>
                <CSTCombobox tipo="COFINS" value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CST" />
                <FormDescription className="text-[10px]">Código de Situação Tributária do COFINS (obrigatório para NFe)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota COFINS */}
          <FormField
            control={form.control}
            name="cofinsAliquota"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Alíquota COFINS (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="my-2" />

      {/* IPI */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">IPI</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* CST IPI */}
          <FormField
            control={form.control}
            name="ipiCstId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">CST IPI</FormLabel>
                <CSTCombobox tipo="IPI" value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CST" />
                <FormDescription className="text-[10px]">Código de Situação Tributária do IPI</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota IPI */}
          <FormField
            control={form.control}
            name="ipiAliquota"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Alíquota IPI (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

