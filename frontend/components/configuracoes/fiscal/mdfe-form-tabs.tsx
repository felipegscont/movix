"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TIPO_FRETE_OPTIONS = [
  { value: "0", label: "0 - CIF (Remetente)" },
  { value: "1", label: "1 - FOB (Destinatário)" },
  { value: "2", label: "2 - Terceiros" },
  { value: "3", label: "3 - Próprio Remetente" },
  { value: "4", label: "4 - Próprio Destinatário" },
  { value: "9", label: "9 - Sem Transporte" },
]

const INDICADOR_PRESENCA_OPTIONS = [
  { value: "0", label: "0 - Não se aplica" },
  { value: "1", label: "1 - Presencial" },
  { value: "2", label: "2 - Internet" },
  { value: "3", label: "3 - Teleatendimento" },
  { value: "4", label: "4 - NFC-e Entrega" },
  { value: "5", label: "5 - Fora Estabelecimento" },
  { value: "9", label: "9 - Outros" },
]

const ORIENTACAO_IMPRESSAO_OPTIONS = [
  { value: "1", label: "Retrato" },
  { value: "2", label: "Paisagem" },
]

interface MdfeConfigFieldsProps {
  form: UseFormReturn<any>
  prefix: "Producao" | "Homologacao"
  showInutilizacao?: boolean
}

interface MdfeInutilizacaoFieldsProps {
  form: UseFormReturn<any>
  prefix: "Producao" | "Homologacao"
}

export function MdfeConfigFields({ form, prefix, showInutilizacao = true }: MdfeConfigFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={form.control} name={`serie${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Série *</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} max={999} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} className="h-8 text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name={`proximoNumero${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Próximo Número *</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} className="h-8 text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`tipoFrete${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Tipo de Frete</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger size="sm" className="h-8 text-xs w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIPO_FRETE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`indicadorPresenca${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Indicador de Presença</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger size="sm" className="h-8 text-xs w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INDICADOR_PRESENCA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`orientacaoImpressao${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Orientação Impressão</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger size="sm" className="h-8 text-xs w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ORIENTACAO_IMPRESSAO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ieSubstituto${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">IE Substituto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Inscrição Estadual" className="h-8 text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField control={form.control} name={`observacoes${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">Observações Padrão</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Texto incluído automaticamente nas notas" rows={2} className="text-sm" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name={`documentosAutorizados${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">Documentos Autorizados</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="CNPJ ou CPF autorizados, separados por vírgula" rows={2} className="text-sm" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />


    </div>
  )
}

// Componente separado para Inutilização
export function MdfeInutilizacaoFields({ form, prefix }: MdfeInutilizacaoFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={form.control} name={`numeroInicialInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Nº Inicial</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Número inicial"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`numeroFinalInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Nº Final</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Número final"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField control={form.control} name={`serieInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Série</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Série"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`anoInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Ano</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={2000}
                max={2100}
                placeholder="Ex: 2024"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name={`justificativaInutilizar${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">Justificativa (mín. 15 caracteres)</FormLabel>
          <FormControl>
            <Textarea {...field} value={field.value ?? ""} placeholder="Motivo da inutilização" rows={2} className="text-sm" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  )
}

