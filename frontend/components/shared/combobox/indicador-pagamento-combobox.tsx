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

const INDICADORES = [
  { value: 0, label: "À vista" },
  { value: 1, label: "A prazo" },
]

interface IndicadorPagamentoComboboxProps {
  value?: number
  onValueChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function IndicadorPagamentoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o indicador",
  disabled = false,
  className,
}: IndicadorPagamentoComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedIndicador = INDICADORES.find((i) => i.value === value)

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
          {selectedIndicador ? (
            <span>{selectedIndicador.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum indicador encontrado</CommandEmpty>
            <CommandGroup>
              {INDICADORES.map((indicador) => (
                <CommandItem
                  key={indicador.value}
                  value={indicador.value.toString()}
                  onSelect={() => {
                    onValueChange(indicador.value === value ? undefined : indicador.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === indicador.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {indicador.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

