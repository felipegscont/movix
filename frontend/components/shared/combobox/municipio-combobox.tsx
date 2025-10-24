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
import { AuxiliarService, type Municipio } from "@/lib/services/auxiliar.service"

interface MunicipioComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  estadoId?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MunicipioCombobox({
  value,
  onValueChange,
  estadoId,
  placeholder = "Selecione o município",
  disabled = false,
  className,
}: MunicipioComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [municipios, setMunicipios] = React.useState<Municipio[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (estadoId) {
      loadMunicipios()
    } else {
      setMunicipios([])
    }
  }, [estadoId])

  const loadMunicipios = async () => {
    if (!estadoId) return

    try {
      setLoading(true)
      const data = await AuxiliarService.getMunicipios(estadoId)
      setMunicipios(data)
    } catch (error) {
      console.error("Erro ao carregar municípios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMunicipios = React.useMemo(() => {
    if (!search) return municipios

    return searchInFields(municipios, search, ['nome', 'codigoIbge'])
  }, [municipios, search])

  const selectedMunicipio = municipios.find((municipio) => municipio.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || !estadoId}
        >
          <span className="truncate flex-1 text-left">
            {selectedMunicipio ? (
              <span>{selectedMunicipio.nome}</span>
            ) : (
              <span className="text-muted-foreground">
                {!estadoId ? "Selecione o estado primeiro" : placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar município..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Carregando..." : "Nenhum município encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {filteredMunicipios.map((municipio) => (
                <CommandItem
                  key={municipio.id}
                  value={municipio.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === municipio.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{municipio.nome}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

