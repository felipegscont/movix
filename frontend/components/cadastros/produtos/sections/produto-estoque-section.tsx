import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProdutoSectionProps } from "@/types"
import { Separator } from "@/components/ui/separator"

export function ProdutoEstoqueSection({ form }: ProdutoSectionProps) {
  const watchValorCusto = form.watch("valorCusto")
  const watchMargemLucro = form.watch("margemLucro")

  // Calcular valor unitário baseado no custo e margem
  const calcularValorUnitario = () => {
    if (watchValorCusto && watchMargemLucro) {
      const custo = Number(watchValorCusto)
      const margem = Number(watchMargemLucro)
      const valorCalculado = custo * (1 + margem / 100)
      return valorCalculado.toFixed(2)
    }
    return ""
  }

  return (
    <div className="space-y-3">
      {/* Valores */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">Valores</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Valor de Custo */}
          <FormField
            control={form.control}
            name="valorCusto"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Valor de Custo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">Custo de aquisição do produto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Margem de Lucro */}
          <FormField
            control={form.control}
            name="margemLucro"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Margem de Lucro (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">Percentual de lucro sobre o custo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor Unitário */}
          <FormField
            control={form.control}
            name="valorUnitario"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Valor Unitário *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Preço de venda do produto
                  {calcularValorUnitario() && <span className="text-primary ml-1">(Sugestão: R$ {calcularValorUnitario()})</span>}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="my-2" />

      {/* Estoque */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">Controle de Estoque</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Estoque Atual */}
          <FormField
            control={form.control}
            name="estoqueAtual"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Estoque Atual</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">Quantidade em estoque</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estoque Mínimo */}
          <FormField
            control={form.control}
            name="estoqueMinimo"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Estoque Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">Alerta de estoque baixo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estoque Máximo */}
          <FormField
            control={form.control}
            name="estoqueMaximo"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-medium">Estoque Máximo</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" placeholder="0" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} className="h-9 text-sm w-full" />
                </FormControl>
                <FormDescription className="text-[10px]">Capacidade máxima de estoque</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

