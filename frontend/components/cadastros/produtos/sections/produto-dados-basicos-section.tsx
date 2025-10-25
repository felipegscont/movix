import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NCMCombobox } from "@/components/shared/combobox/ncm-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { ProdutoSectionProps } from "@/types"
import { UNIDADE_OPTIONS } from "@/lib/constants/produto.constants"

export function ProdutoDadosBasicosSection({ form }: ProdutoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Código */}
      <FormField
        control={form.control}
        name="codigo"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">Código *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: PROD001" {...field} className="h-9 text-sm w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Código de Barras */}
      <FormField
        control={form.control}
        name="codigoBarras"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">Código de Barras</FormLabel>
            <FormControl>
              <Input placeholder="EAN/GTIN" {...field} className="h-9 text-sm w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Unidade */}
      <FormField
        control={form.control}
        name="unidade"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">Unidade *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {UNIDADE_OPTIONS.map((option) => (
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

      {/* Descrição */}
      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem className="md:col-span-3 space-y-1">
            <FormLabel className="text-xs font-medium">Descrição *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do produto" {...field} className="h-9 text-sm w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descrição Complementar */}
      <FormField
        control={form.control}
        name="descricaoComplementar"
        render={({ field }) => (
          <FormItem className="md:col-span-3 space-y-1">
            <FormLabel className="text-xs font-medium">Descrição Complementar</FormLabel>
            <FormControl>
              <Textarea placeholder="Informações adicionais sobre o produto..." className="min-h-[60px] text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* NCM */}
      <FormField
        control={form.control}
        name="ncmId"
        render={({ field }) => (
          <FormItem className="md:col-span-2 space-y-1">
            <FormLabel className="text-xs font-medium">NCM *</FormLabel>
            <NCMCombobox value={field.value} onValueChange={field.onChange} placeholder="Selecione o NCM" />
            <FormDescription className="text-[10px]">Nomenclatura Comum do Mercosul</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CEST */}
      <FormField
        control={form.control}
        name="cestId"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">CEST</FormLabel>
            <FormControl>
              <Input placeholder="Código CEST" {...field} className="h-9 text-sm w-full" />
            </FormControl>
            <FormDescription className="text-[10px]">Código Especificador da Substituição Tributária</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CFOP */}
      <FormField
        control={form.control}
        name="cfopId"
        render={({ field }) => (
          <FormItem className="md:col-span-2 space-y-1">
            <FormLabel className="text-xs font-medium">CFOP Padrão</FormLabel>
            <CFOPCombobox value={field.value || ""} onValueChange={field.onChange} placeholder="Selecione o CFOP" />
            <FormDescription className="text-[10px]">Código Fiscal de Operações e Prestações</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Unidade Tributável */}
      <FormField
        control={form.control}
        name="unidadeTributavel"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium">Unidade Tributável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {UNIDADE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-[10px]">Unidade para cálculo de tributos</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

