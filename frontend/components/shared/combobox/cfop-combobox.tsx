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

interface CFOP {
  id: string
  codigo: string
  descricao: string
  tipo?: string
}

interface CFOPComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  tipo?: 'ENTRADA' | 'SAIDA'
  className?: string
}

export function CFOPCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o CFOP",
  disabled = false,
  tipo,
  className,
}: CFOPComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [cfops, setCfops] = React.useState<CFOP[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadCFOPs()
  }, [])

  const loadCFOPs = async () => {
    try {
      setLoading(true)
      const data = await AuxiliarService.getCFOPs()
      setCfops(data)
    } catch (error) {
      console.error("Erro ao carregar CFOPs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCFOPs = React.useMemo(() => {
    let filtered = cfops

    // Filtrar por tipo
    if (tipo) {
      filtered = filtered.filter(cfop => cfop.tipo === tipo)
    }

    // Busca robusta por código e descrição
    if (search) {
      filtered = searchInFields(filtered, search, ['codigo', 'descricao'])
    }

    // Ordenar por relevância: código exato primeiro, depois por código, depois por descrição
    if (search) {
      const searchLower = search.toLowerCase()
      filtered.sort((a, b) => {
        const aCodigoExact = a.codigo.toLowerCase() === searchLower
        const bCodigoExact = b.codigo.toLowerCase() === searchLower
        if (aCodigoExact && !bCodigoExact) return -1
        if (!aCodigoExact && bCodigoExact) return 1

        const aCodigoStart = a.codigo.toLowerCase().startsWith(searchLower)
        const bCodigoStart = b.codigo.toLowerCase().startsWith(searchLower)
        if (aCodigoStart && !bCodigoStart) return -1
        if (!aCodigoStart && bCodigoStart) return 1

        return a.codigo.localeCompare(b.codigo)
      })
    }

    return filtered
  }, [cfops, tipo, search])

  const selectedCFOP = cfops.find(cfop => cfop.id === value)

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
          {selectedCFOP ? (
            <span className="truncate">
              {selectedCFOP.codigo} - {selectedCFOP.descricao}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por código ou descrição..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Carregando..." : "Nenhum CFOP encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCFOPs.map((cfop) => (
                <CommandItem
                  key={cfop.id}
                  value={cfop.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cfop.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{cfop.codigo}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {cfop.descricao}
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

