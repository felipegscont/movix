"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StaticCombobox } from "@/components/shared/combobox/static-combobox"

const TIPO_FRETE_OPTIONS = [
  { value: 0, label: "0 - Contratação do Frete por conta do Remetente (CIF)" },
  { value: 1, label: "1 - Contratação do Frete por conta do Destinatário (FOB)" },
  { value: 2, label: "2 - Contratação do Frete por conta de Terceiros" },
  { value: 3, label: "3 - Transporte Próprio por conta do Remetente" },
  { value: 4, label: "4 - Transporte Próprio por conta do Destinatário" },
  { value: 9, label: "9 - Sem Ocorrência de Transporte" },
]

const INDICADOR_PRESENCA_OPTIONS = [
  { value: 0, label: "0 - Não se aplica" },
  { value: 1, label: "1 - Operação presencial" },
  { value: 2, label: "2 - Operação não presencial, pela Internet" },
  { value: 3, label: "3 - Operação não presencial, Teleatendimento" },
  { value: 4, label: "4 - NFC-e em operação com entrega a domicílio" },
  { value: 5, label: "5 - Operação presencial, fora do estabelecimento" },
  { value: 9, label: "9 - Operação não presencial, outros" },
]

const ORIENTACAO_IMPRESSAO_OPTIONS = [
  { value: 1, label: "Retrato" },
  { value: 2, label: "Paisagem" },
]

interface NfeConfigFieldsProps {
  form: UseFormReturn<any>
  prefix: "Producao" | "Homologacao"
  showInutilizacao?: boolean
}

interface NfeInutilizacaoFieldsProps {
  form: UseFormReturn<any>
  prefix: "Producao" | "Homologacao"
}

export function NfeConfigFields({ form, prefix, showInutilizacao = true }: NfeConfigFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name={`serie${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Série *</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} max={999} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name={`proximoNumero${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Próximo Número *</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* Tipo de Frete e Indicador de Presença */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`tipoFrete${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Frete Padrão</FormLabel>
              <FormControl>
                <StaticCombobox
                  options={TIPO_FRETE_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as number)}
                  placeholder="Selecione"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`indicadorPresenca${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indicador de Presença</FormLabel>
              <FormControl>
                <StaticCombobox
                  options={INDICADOR_PRESENCA_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as number)}
                  placeholder="Selecione"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Orientação e IE Substituto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`orientacaoImpressao${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orientação da Impressão</FormLabel>
              <FormControl>
                <StaticCombobox
                  options={ORIENTACAO_IMPRESSAO_OPTIONS}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as number)}
                  placeholder="Selecione"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ieSubstituto${prefix}` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>IE do Substituto Tributário</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Inscrição Estadual" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField control={form.control} name={`observacoes${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel>Observações Padrão</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="Texto incluído automaticamente nas notas" rows={3} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name={`documentosAutorizados${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel>Documentos Autorizados (CNPJ/CPF)</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder="CNPJ ou CPF autorizados, separados por vírgula" rows={2} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />


    </div>
  )
}

// Componente separado para Inutilização
export function NfeInutilizacaoFields({ form, prefix }: NfeInutilizacaoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name={`numeroInicialInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Nº Inicial</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Número inicial"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`numeroFinalInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Nº Final</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Número final"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name={`serieInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Nº de Série da NF</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={1}
                placeholder="Série"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`anoInutilizar${prefix}` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>Ano de Inutilização NF</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type="number"
                min={2000}
                max={2100}
                placeholder="Ex: 2024"
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name={`justificativaInutilizar${prefix}` as any} render={({ field }) => (
        <FormItem>
          <FormLabel>Justificativa</FormLabel>
          <FormControl>
            <Textarea {...field} value={field.value ?? ""} placeholder="Justificativa para inutilização (mínimo 15 caracteres)" rows={3} />
          </FormControl>
          <FormDescription>
            Informe o motivo da inutilização da numeração
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  )
}

