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
import { FormaPagamentoService } from "@/lib/services/forma-pagamento.service"

interface FormaPagamento {
  id: string
  codigo: string
  descricao: string
}

interface FormaPagamentoComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Se true, retorna o código ao invés do ID */
  returnCode?: boolean
}

export function FormaPagamentoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione a forma de pagamento",
  disabled = false,
  className,
  returnCode = false,
}: FormaPagamentoComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [formasPagamento, setFormasPagamento] = React.useState<FormaPagamento[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Carregar formas de pagamento
  React.useEffect(() => {
    loadFormasPagamento()
  }, [])

  const loadFormasPagamento = async () => {
    try {
      setLoading(true)
      const data = await FormaPagamentoService.getAll()
      setFormasPagamento(data)
    } catch (error) {
      console.error("Erro ao carregar formas de pagamento:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar formas de pagamento
  const filteredFormas = React.useMemo(() => {
    if (!search) return formasPagamento

    return formasPagamento.filter((forma) =>
      searchInFields(search, [forma.codigo, forma.descricao])
    )
  }, [formasPagamento, search])

  // Encontrar forma selecionada
  const selectedForma = formasPagamento.find((f) =>
    returnCode ? f.codigo === value : f.id === value
  )

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
          {selectedForma ? (
            <span className="truncate">
              {selectedForma.codigo} - {selectedForma.descricao}
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
              {loading ? "Carregando..." : "Nenhuma forma de pagamento encontrada"}
            </CommandEmpty>
            <CommandGroup>
              {filteredFormas.map((forma) => {
                const formaValue = returnCode ? forma.codigo : forma.id
                const isSelected = returnCode ? forma.codigo === value : forma.id === value

                return (
                  <CommandItem
                    key={forma.id}
                    value={forma.id}
                    onSelect={() => {
                      onValueChange(isSelected ? undefined : formaValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{forma.codigo} - {forma.descricao}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

