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

interface CSOSN {
  id: string
  codigo: string
  descricao: string
}

interface CSOSNComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CSOSNCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o CSOSN",
  disabled = false,
  className,
}: CSOSNComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [csosns, setCsosns] = React.useState<CSOSN[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadCSOSNs()
  }, [])

  const loadCSOSNs = async () => {
    try {
      setLoading(true)
      const data = await AuxiliarService.getCSOSNs()
      setCsosns(data)
    } catch (error) {
      console.error("Erro ao carregar CSOSNs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCSOSNs = React.useMemo(() => {
    if (!search) return csosns

    // Busca robusta por código e descrição
    let filtered = searchInFields(csosns, search, ['codigo', 'descricao'])

    // Ordenar por relevância
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

    return filtered
  }, [csosns, search])

  const selectedCSOSN = csosns.find(csosn => csosn.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between !flex", className)}
          disabled={disabled}
        >
          <span className="truncate flex-1 text-left" title={selectedCSOSN ? `${selectedCSOSN.codigo} - ${selectedCSOSN.descricao}` : undefined}>
            {selectedCSOSN ? (
              `${selectedCSOSN.codigo} - ${selectedCSOSN.descricao}`
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
              {loading ? "Carregando..." : "Nenhum CSOSN encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCSOSNs.map((csosn) => (
                <CommandItem
                  key={csosn.id}
                  value={csosn.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === csosn.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-full min-w-0 overflow-hidden" title={`${csosn.codigo} - ${csosn.descricao}`}>
                    <span className="font-medium text-sm">{csosn.codigo}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {csosn.descricao}
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

