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
import { NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"

interface NaturezaOperacao {
  id: string
  codigo: string
  descricao: string
}

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
    return naturezas.filter((natureza) =>
      searchInFields(search, [natureza.codigo, natureza.descricao])
    )
  }, [naturezas, search])

  // Encontrar natureza selecionada pela descrição
  const selectedNatureza = naturezas.find((n) => n.descricao === value)

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {value ? (
            <span className="truncate">
              {selectedNatureza ? `${selectedNatureza.codigo} - ` : ""}{value}
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
                    onValueChange(natureza.descricao, natureza.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === natureza.descricao ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{natureza.codigo}</span>
                    <span className="text-sm text-muted-foreground">{natureza.descricao}</span>
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

