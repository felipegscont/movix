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
import { ProdutoSectionProps, UNIDADE_OPTIONS } from "../types"

export function ProdutoDadosBasicosSection({ form }: ProdutoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Código */}
      <FormField
        control={form.control}
        name="codigo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: PROD001" {...field} />
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
          <FormItem>
            <FormLabel>Código de Barras</FormLabel>
            <FormControl>
              <Input placeholder="EAN/GTIN" {...field} />
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
          <FormItem>
            <FormLabel>Unidade *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
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
          <FormItem className="md:col-span-3">
            <FormLabel>Descrição *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do produto" {...field} />
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
          <FormItem className="md:col-span-3">
            <FormLabel>Descrição Complementar</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações adicionais sobre o produto..."
                className="min-h-[80px]"
                {...field}
              />
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
          <FormItem className="md:col-span-2">
            <FormLabel>NCM *</FormLabel>
            <NCMCombobox
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Selecione o NCM"
            />
            <FormDescription>
              Nomenclatura Comum do Mercosul
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CEST */}
      <FormField
        control={form.control}
        name="cestId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEST</FormLabel>
            <FormControl>
              <Input placeholder="Código CEST" {...field} />
            </FormControl>
            <FormDescription>
              Código Especificador da Substituição Tributária
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CFOP */}
      <FormField
        control={form.control}
        name="cfopId"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>CFOP Padrão</FormLabel>
            <CFOPCombobox
              value={field.value || ""}
              onValueChange={field.onChange}
              placeholder="Selecione o CFOP"
            />
            <FormDescription>
              Código Fiscal de Operações e Prestações
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Unidade Tributável */}
      <FormField
        control={form.control}
        name="unidadeTributavel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade Tributável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
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
            <FormDescription>
              Unidade para cálculo de tributos (se diferente da unidade comercial)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

