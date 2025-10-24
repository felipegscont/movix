"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface StaticOption {
  value: string | number
  label: string
  description?: string
}

interface StaticComboboxProps {
  options: StaticOption[]
  value?: string | number
  onValueChange: (value: string | number | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  searchPlaceholder?: string
  emptyMessage?: string
}

export function StaticCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  disabled = false,
  className,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhuma opção encontrada",
}: StaticComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search) return options

    const searchLower = search.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower) ||
      option.description?.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  const selectedOption = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={() => {
                    onValueChange(option.value === value ? undefined : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-sm text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Opções pré-definidas para uso comum
export const REGIME_TRIBUTARIO_OPTIONS: StaticOption[] = [
  { value: 1, label: "1 - Simples Nacional" },
  { value: 2, label: "2 - Simples Nacional - Excesso" },
  { value: 3, label: "3 - Regime Normal" },
]

export const TIPO_OPERACAO_OPTIONS: StaticOption[] = [
  { value: 0, label: "0 - Entrada" },
  { value: 1, label: "1 - Saída" },
]

export const FINALIDADE_OPTIONS: StaticOption[] = [
  { value: 1, label: "1 - Normal" },
  { value: 2, label: "2 - Complementar" },
  { value: 3, label: "3 - Ajuste" },
  { value: 4, label: "4 - Devolução" },
]

export const CONSUMIDOR_FINAL_OPTIONS: StaticOption[] = [
  { value: 0, label: "0 - Não" },
  { value: 1, label: "1 - Sim" },
]

export const PRESENCA_COMPRADOR_OPTIONS: StaticOption[] = [
  { value: 0, label: "0 - Não se aplica" },
  { value: 1, label: "1 - Presencial" },
  { value: 2, label: "2 - Internet" },
  { value: 3, label: "3 - Teleatendimento" },
  { value: 4, label: "4 - Entrega em domicílio" },
  { value: 5, label: "5 - Presencial fora do estabelecimento" },
  { value: 9, label: "9 - Outros" },
]

export const AMBIENTE_NFE_OPTIONS: StaticOption[] = [
  { value: 1, label: "1 - Produção" },
  { value: 2, label: "2 - Homologação" },
]

export const MODALIDADE_FRETE_OPTIONS: StaticOption[] = [
  { value: 0, label: "0 - Por conta do emitente" },
  { value: 1, label: "1 - Por conta do destinatário" },
  { value: 2, label: "2 - Por conta de terceiros" },
  { value: 3, label: "3 - Transporte próprio por conta do remetente" },
  { value: 4, label: "4 - Transporte próprio por conta do destinatário" },
  { value: 9, label: "9 - Sem frete" },
]

// Opções para Matriz Fiscal
export const IMPOSTO_TAXA_OPTIONS: StaticOption[] = [
  { value: "ICMS", label: "ICMS", description: "Imposto sobre Circulação de Mercadorias e Serviços" },
  { value: "PIS", label: "PIS", description: "Programa de Integração Social" },
  { value: "COFINS", label: "COFINS", description: "Contribuição para Financiamento da Seguridade Social" },
  { value: "IPI", label: "IPI", description: "Imposto sobre Produtos Industrializados" },
  { value: "ISSQN", label: "ISSQN", description: "Imposto sobre Serviços de Qualquer Natureza" },
]

export const SE_APLICA_A_OPTIONS: StaticOption[] = [
  { value: "produtos", label: "Produtos/Mercadorias" },
  { value: "servicos", label: "Serviços" },
]

export const MODELO_NF_OPTIONS: StaticOption[] = [
  { value: "nfe", label: "NF-e", description: "Nota Fiscal Eletrônica" },
  { value: "nfce", label: "NFC-e", description: "Nota Fiscal de Consumidor Eletrônica" },
  { value: "cte", label: "CT-e", description: "Conhecimento de Transporte Eletrônico" },
  { value: "nfse", label: "NFS-e", description: "Nota Fiscal de Serviço Eletrônica" },
]

export const REGIME_FISCAL_OPTIONS: StaticOption[] = [
  { value: 1, label: "Simples Nacional" },
  { value: 2, label: "Lucro Presumido" },
  { value: 3, label: "Lucro Real" },
]

export const TIPO_ITEM_OPTIONS: StaticOption[] = [
  { value: "produto", label: "Produto" },
  { value: "servico", label: "Serviço" },
]

export const INDICADOR_IE_OPTIONS: StaticOption[] = [
  { value: 1, label: "1 - Contribuinte ICMS" },
  { value: 2, label: "2 - Contribuinte isento" },
  { value: 9, label: "9 - Não Contribuinte" },
]

export const TIPO_PESSOA_OPTIONS: StaticOption[] = [
  { value: "FISICA", label: "Pessoa Física" },
  { value: "JURIDICA", label: "Pessoa Jurídica" },
]

export const TIPO_CLIENTE_OPTIONS: StaticOption[] = [
  { value: "contribuinte", label: "Contribuinte ICMS" },
  { value: "nao_contribuinte", label: "Não Contribuinte" },
  { value: "exterior", label: "Exterior" },
]

