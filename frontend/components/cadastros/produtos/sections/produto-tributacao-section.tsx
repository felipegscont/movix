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
import { ProdutoSectionProps, ORIGEM_OPTIONS } from "../types"
import { Separator } from "@/components/ui/separator"

export function ProdutoTributacaoSection({ form }: ProdutoSectionProps) {
  const watchRegimeTributario = form.watch("icmsCsosnId")

  return (
    <div className="space-y-6">
      {/* Origem */}
      <FormField
        control={form.control}
        name="origem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origem da Mercadoria *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
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

      <Separator />

      {/* ICMS */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">ICMS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CST ICMS */}
          <FormField
            control={form.control}
            name="icmsCstId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CST ICMS</FormLabel>
                <CSTCombobox
                  tipo="ICMS"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione o CST"
                />
                <FormDescription>
                  Código de Situação Tributária do ICMS
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CSOSN */}
          <FormField
            control={form.control}
            name="icmsCsosnId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSOSN</FormLabel>
                <CSTCombobox
                  tipo="CSOSN"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione o CSOSN"
                />
                <FormDescription>
                  Código de Situação da Operação no Simples Nacional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota ICMS */}
          <FormField
            control={form.control}
            name="icmsAliquota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota ICMS (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
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
              <FormItem>
                <FormLabel>Redução Base ICMS (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* PIS */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">PIS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CST PIS */}
          <FormField
            control={form.control}
            name="pisCstId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CST PIS</FormLabel>
                <CSTCombobox
                  tipo="PIS"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione o CST"
                />
                <FormDescription>
                  Código de Situação Tributária do PIS
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota PIS */}
          <FormField
            control={form.control}
            name="pisAliquota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota PIS (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* COFINS */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">COFINS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CST COFINS */}
          <FormField
            control={form.control}
            name="cofinsCstId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CST COFINS</FormLabel>
                <CSTCombobox
                  tipo="COFINS"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione o CST"
                />
                <FormDescription>
                  Código de Situação Tributária do COFINS
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota COFINS */}
          <FormField
            control={form.control}
            name="cofinsAliquota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota COFINS (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* IPI */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">IPI</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CST IPI */}
          <FormField
            control={form.control}
            name="ipiCstId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CST IPI</FormLabel>
                <CSTCombobox
                  tipo="IPI"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione o CST"
                />
                <FormDescription>
                  Código de Situação Tributária do IPI
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alíquota IPI */}
          <FormField
            control={form.control}
            name="ipiAliquota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota IPI (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
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

