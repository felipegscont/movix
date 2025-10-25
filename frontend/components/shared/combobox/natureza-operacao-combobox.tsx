"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchInFields } from "@/lib/utils/search"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { NaturezaOperacaoService, type NaturezaOperacao } from "@/lib/services/natureza-operacao.service"

interface NaturezaOperacaoComboboxProps {
  value?: string // Descrição da natureza
  onValueChange: (value: string | undefined, naturezaId?: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  allowCustom?: boolean // Permitir texto livre
}

export function NaturezaOperacaoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione ou digite a natureza de operação",
  disabled = false,
  className,
  allowCustom = true,
}: NaturezaOperacaoComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [naturezas, setNaturezas] = React.useState<NaturezaOperacao[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [customMode, setCustomMode] = React.useState(false)

  React.useEffect(() => {
    loadNaturezas()
  }, [])

  const loadNaturezas = async () => {
    try {
      setLoading(true)
      const response = await NaturezaOperacaoService.getAtivas()
      setNaturezas(response)
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNaturezas = React.useMemo(() => {
    if (!search) return naturezas
    return searchInFields(naturezas, search, ['codigo', 'nome'])
  }, [naturezas, search])

  // Encontrar natureza selecionada pela descrição
  const selectedNatureza = naturezas.find((n) => n.nome === value)

  // Modo customizado: input livre
  if (customMode && allowCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Digite a natureza de operação"
          disabled={disabled}
          className={className}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setCustomMode(false)}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between !flex", className)}
          disabled={disabled || loading}
        >
          <span className="truncate flex-1 text-left" title={selectedNatureza ? `${selectedNatureza.codigo} - ${value}` : value}>
            {value ? (
              selectedNatureza ? `${selectedNatureza.codigo} - ${value}` : value
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
              {loading ? (
                "Carregando..."
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Nenhuma natureza encontrada
                  </p>
                  {allowCustom && search && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onValueChange(search)
                        setOpen(false)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Usar "{search}"
                    </Button>
                  )}
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredNaturezas.map((natureza) => (
                <CommandItem
                  key={natureza.id}
                  value={natureza.id}
                  onSelect={() => {
                    onValueChange(natureza.nome, natureza.id)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === natureza.nome ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-full min-w-0 overflow-hidden" title={`${natureza.codigo} - ${natureza.nome}`}>
                    <span className="font-medium text-sm">{natureza.codigo}</span>
                    <span className="text-xs text-muted-foreground truncate">{natureza.nome}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {allowCustom && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setCustomMode(true)
                    setOpen(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Digitar texto personalizado</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

