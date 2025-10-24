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
import { ClienteService } from "@/lib/services/cliente.service"

interface Cliente {
  id: string
  nome: string
  documento: string
  tipo: string
}

interface ClienteComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ClienteCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o cliente",
  disabled = false,
  className,
}: ClienteComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Carregar clientes
  React.useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const response = await ClienteService.getAll({ page: 1, limit: 1000 })
      setClientes(response.data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar clientes
  const filteredClientes = React.useMemo(() => {
    if (!search) return clientes

    return searchInFields(clientes, search, ['nome', 'documento'])
  }, [clientes, search])

  // Encontrar cliente selecionado
  const selectedCliente = clientes.find((c) => c.id === value)

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
          {selectedCliente ? (
            <span className="truncate">
              {selectedCliente.nome} - {selectedCliente.documento}
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
            placeholder="Buscar por nome ou documento..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Carregando..." : "Nenhum cliente encontrado"}
            </CommandEmpty>
            <CommandGroup>
              {filteredClientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.id}
                  onSelect={() => {
                    onValueChange(cliente.id === value ? undefined : cliente.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{cliente.nome}</span>
                    <span className="text-sm text-muted-foreground">{cliente.documento}</span>
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

