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
import { NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"

interface NaturezaOperacao {
  id: string
  codigo: string
  descricao: string
}

interface NaturezaOperacaoComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function NaturezaOperacaoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione a natureza de operação",
  disabled = false,
  className,
}: NaturezaOperacaoComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [naturezas, setNaturezas] = React.useState<NaturezaOperacao[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadNaturezas()
  }, [])

  const loadNaturezas = async () => {
    try {
      setLoading(true)
      const response = await NaturezaOperacaoService.getAll({ page: 1, limit: 1000 })
      setNaturezas(response.data)
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNaturezas = React.useMemo(() => {
    if (!search) return naturezas
    return naturezas.filter((natureza) =>
      searchInFields(search, [natureza.codigo, natureza.descricao])
    )
  }, [naturezas, search])

  const selectedNatureza = naturezas.find((n) => n.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {selectedNatureza ? (
            <span className="truncate">
              {selectedNatureza.codigo} - {selectedNatureza.descricao}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por código ou descrição..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Carregando..." : "Nenhuma natureza encontrada"}
            </CommandEmpty>
            <CommandGroup>
              {filteredNaturezas.map((natureza) => (
                <CommandItem
                  key={natureza.id}
                  value={natureza.id}
                  onSelect={() => {
                    onValueChange(natureza.id === value ? undefined : natureza.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === natureza.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{natureza.codigo} - {natureza.descricao}</span>
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

