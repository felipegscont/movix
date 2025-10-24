"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchInFields } from "@/lib/utils/search"
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
import { AuxiliarService, type Estado } from "@/lib/services/auxiliar.service"

interface EstadoComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  returnUf?: boolean // Se true, retorna UF ao invés de ID
}

export function EstadoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o estado",
  disabled = false,
  className,
  returnUf = false,
}: EstadoComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [estados, setEstados] = React.useState<Estado[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadEstados()
  }, [])

  const loadEstados = async () => {
    try {
      setLoading(true)
      const data = await AuxiliarService.getEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEstados = React.useMemo(() => {
    if (!search) return estados

    return searchInFields(estados, search, ['uf', 'nome'])
  }, [estados, search])

  // Se returnUf=true mas value parece ser um ID (tem mais de 3 caracteres), limpar
  React.useEffect(() => {
    if (returnUf && value && value.length > 3) {
      console.warn('EstadoCombobox: valor parece ser ID mas returnUf=true, limpando:', value)
      onValueChange(undefined)
    }
  }, [returnUf, value, onValueChange])

  const selectedEstado = estados.find((estado) =>
    returnUf ? estado.uf === value : estado.id === value
  )

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
          <span className="truncate flex-1 text-left">
            {selectedEstado ? (
              <>
                <span className="font-medium">{selectedEstado.uf}</span>
                <span className="text-muted-foreground ml-2">
                  {selectedEstado.nome}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por UF ou nome..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Carregando..." : "Nenhum estado encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {filteredEstados.map((estado) => (
                <CommandItem
                  key={estado.id}
                  value={returnUf ? estado.uf : estado.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === estado.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{estado.uf}</span>
                    <span className="text-sm text-muted-foreground">
                      {estado.nome}
                    </span>
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

