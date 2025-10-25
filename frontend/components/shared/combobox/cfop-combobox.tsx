"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchInFields } from "@/lib/utils/search"
import { truncateComboboxText } from "@/lib/utils/text"
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
  }, [tipo]) // Recarregar quando tipo mudar

  const loadCFOPs = async () => {
    try {
      setLoading(true)
      // Buscar CFOPs já filtrados pela API
      const data = await AuxiliarService.getCFOPs(undefined, tipo)
      setCfops(data)
    } catch (error) {
      console.error("Erro ao carregar CFOPs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCFOPs = React.useMemo(() => {
    let filtered = cfops

    // Não precisa mais filtrar por tipo aqui, já vem filtrado da API

    // Busca robusta por código e descrição
    if (search) {
      filtered = searchInFields(filtered, search, ['codigo', 'descricao'])
      console.log(`[CFOPCombobox] Busca: "${search}", Resultados: ${filtered.length}`, filtered.slice(0, 3))
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

    console.log(`[CFOPCombobox] Total CFOPs: ${cfops.length}, Filtrados: ${filtered.length}, Tipo: ${tipo}`)
    return filtered
  }, [cfops, tipo, search])

  const selectedCFOP = cfops.find(cfop => cfop.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9 overflow-hidden", className)}
          disabled={disabled}
        >
          <span className="truncate flex-1 text-left overflow-hidden whitespace-nowrap">
            {selectedCFOP ? (
              <span className="inline-flex items-center gap-1 overflow-hidden w-full" title={`${selectedCFOP.codigo} - ${selectedCFOP.descricao}`}>
                <span className="font-medium shrink-0">{selectedCFOP.codigo}</span>
                <span className="text-muted-foreground truncate">
                  - {selectedCFOP.descricao}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90vw] sm:w-[500px] max-w-[500px] p-0"
        align="start"
        side="bottom"
        sideOffset={4}
      >
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
                  value={`${cfop.codigo}-${cfop.descricao}-${cfop.id}`}
                  onSelect={() => {
                    onValueChange(cfop.id === value ? undefined : cfop.id)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === cfop.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-full min-w-0 overflow-hidden" title={`${cfop.codigo} - ${cfop.descricao}`}>
                    <span className="font-medium text-sm">{cfop.codigo}</span>
                    <span className="text-xs text-muted-foreground truncate">
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

