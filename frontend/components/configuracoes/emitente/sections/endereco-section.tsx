import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { IconLoader2, IconSearch } from "@tabler/icons-react"
import type { EmitenteFormData, Estado, Municipio } from "../types"

interface EnderecoSectionProps {
  form: UseFormReturn<EmitenteFormData>
  estados: Estado[]
  municipios: Municipio[]
  loadingEstados: boolean
  loadingMunicipios: boolean
  loadingCep: boolean
  onConsultarCep: (cep: string) => void
  formatCEP: (value: string) => string
}

export function EnderecoSection({
  form,
  estados,
  municipios,
  loadingEstados,
  loadingMunicipios,
  loadingCep,
  onConsultarCep,
  formatCEP,
}: EnderecoSectionProps) {
  const watchEstadoId = form.watch("estadoId")

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* CEP */}
      <FormField
        control={form.control}
        name="cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP *</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  {...field}
                  placeholder="00000000"
                  maxLength={8}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    field.onChange(formatted)
                  }}
                  disabled={loadingCep}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onConsultarCep(field.value)}
                disabled={loadingCep || field.value.length !== 8}
              >
                {loadingCep ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconSearch className="h-4 w-4" />
                )}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Logradouro */}
      <FormField
        control={form.control}
        name="logradouro"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Logradouro *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Rua, Avenida, etc" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Número */}
      <FormField
        control={form.control}
        name="numero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="123" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bairro */}
      <FormField
        control={form.control}
        name="bairro"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Bairro *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome do Bairro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Complemento */}
      <FormField
        control={form.control}
        name="complemento"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Sala, Andar, etc" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Estado */}
      <FormField
        control={form.control}
        name="estadoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado *</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loadingEstados}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado.id} value={estado.id}>
                    {estado.uf} - {estado.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Município */}
      <FormField
        control={form.control}
        name="municipioId"
        render={({ field }) => (
          <FormItem className="md:col-span-3">
            <FormLabel>Município *</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loadingMunicipios || !watchEstadoId}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingMunicipios
                        ? "Carregando municípios..."
                        : !watchEstadoId
                        ? "Selecione o estado primeiro"
                        : "Selecione o município"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loadingMunicipios ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Carregando municípios...
                  </div>
                ) : municipios.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Nenhum município encontrado
                  </div>
                ) : (
                  municipios.map((municipio) => (
                    <SelectItem key={municipio.id} value={municipio.id}>
                      {municipio.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

