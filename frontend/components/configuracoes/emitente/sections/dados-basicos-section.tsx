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
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { IconLoader2, IconSearch } from "@tabler/icons-react"
import type { EmitenteFormData } from "../types"

interface DadosBasicosSectionProps {
  form: UseFormReturn<EmitenteFormData>
  loadingCnpj: boolean
  onConsultarCnpj: (cnpj: string) => void
  formatCNPJ: (value: string) => string
}

export function DadosBasicosSection({
  form,
  loadingCnpj,
  onConsultarCnpj,
  formatCNPJ,
}: DadosBasicosSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CNPJ */}
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="00000000000000"
                    maxLength={14}
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value)
                      field.onChange(formatted)
                    }}
                    disabled={loadingCnpj}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onConsultarCnpj(field.value)}
                  disabled={loadingCnpj || field.value.length !== 14}
                >
                  {loadingCnpj ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconSearch className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormDescription>
                Digite o CNPJ para buscar dados automaticamente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Razão Social */}
        <FormField
          control={form.control}
          name="razaoSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Razão Social da Empresa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nome Fantasia */}
        <FormField
          control={form.control}
          name="nomeFantasia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome Fantasia (opcional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Inscrição Estadual */}
        <FormField
          control={form.control}
          name="inscricaoEstadual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inscrição Estadual</FormLabel>
              <FormControl>
                <Input {...field} placeholder="000000000000 (opcional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Inscrição Municipal */}
        <FormField
          control={form.control}
          name="inscricaoMunicipal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inscrição Municipal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="00000000 (opcional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CNAE */}
        <FormField
          control={form.control}
          name="cnae"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNAE</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0000000 (opcional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Regime Tributário */}
        <FormField
          control={form.control}
          name="regimeTributario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regime Tributário *</FormLabel>
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
                  <SelectItem value="1">Simples Nacional</SelectItem>
                  <SelectItem value="2">Lucro Presumido</SelectItem>
                  <SelectItem value="3">Regime Normal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Ativo */}
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Emitente Ativo</FormLabel>
                <FormDescription>
                  Emitente ativo para emissão de NFe
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

