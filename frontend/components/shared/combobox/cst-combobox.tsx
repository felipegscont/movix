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

interface CST {
  id: string
  codigo: string
  descricao: string
  tipo: string
}

interface CSTComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  tipo: 'ICMS' | 'CSOSN' | 'PIS' | 'COFINS' | 'IPI'
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CSTCombobox({
  value,
  onValueChange,
  tipo,
  placeholder = "Selecione o CST",
  disabled = false,
  className,
}: CSTComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [csts, setCsts] = React.useState<CST[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadCSTs()
  }, [tipo])

  const loadCSTs = async () => {
    try {
      setLoading(true)
      // CSOSN tem endpoint separado
      if (tipo === 'CSOSN') {
        const data = await AuxiliarService.getCSOSNs()
        setCsts(data)
      } else {
        const data = await AuxiliarService.getCSTs(tipo)
        setCsts(data)
      }
    } catch (error) {
      console.error("Erro ao carregar CSTs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCSTs = React.useMemo(() => {
    if (!search) return csts

    // Busca robusta por código e descrição
    let filtered = searchInFields(csts, search, ['codigo', 'descricao'])

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
  }, [csts, search])

  const selectedCST = csts.find(cst => cst.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className="truncate flex-1 text-left">
            {selectedCST ? (
              <>
                <span className="font-medium">{selectedCST.codigo}</span>
                <span className="text-muted-foreground ml-2">
                  {selectedCST.descricao.length > 40
                    ? selectedCST.descricao.substring(0, 40) + "..."
                    : selectedCST.descricao}
                </span>
              </>
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
              {loading ? "Carregando..." : "Nenhum CST encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCSTs.map((cst) => (
                <CommandItem
                  key={cst.id}
                  value={cst.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cst.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-full overflow-hidden">
                    <span className="font-medium">{cst.codigo}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {cst.descricao}
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

