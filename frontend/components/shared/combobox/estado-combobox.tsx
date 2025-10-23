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
import { AuxiliarService } from "@/lib/services/auxiliar.service"

interface Estado {
  id: string
  codigo: string
  uf: string
  nome: string
  regiao: string
  ativo: boolean
}

interface EstadoComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function EstadoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o estado",
  disabled = false,
  className,
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

    return estados.filter((estado) =>
      searchInFields(search, [estado.uf, estado.nome])
    )
  }, [estados, search])

  const selectedEstado = estados.find((estado) => estado.id === value)

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
                  value={estado.id}
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

