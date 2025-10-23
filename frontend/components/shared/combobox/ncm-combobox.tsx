"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
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

interface NCM {
  id: string
  codigo: string
  descricao: string
}

interface NCMComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function NCMCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o NCM",
  disabled = false,
  className,
}: NCMComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [ncms, setNcms] = React.useState<NCM[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Debounce para busca server-side
  React.useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      loadNCMs(search)
    }, 300) // 300ms de debounce

    return () => clearTimeout(timer)
  }, [open, search])

  const loadNCMs = async (searchTerm: string) => {
    try {
      setLoading(true)
      const data = await AuxiliarService.getNCMs(searchTerm)
      setNcms(data)
    } catch (error) {
      console.error("Erro ao carregar NCMs:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedNCM = ncms.find(ncm => ncm.id === value)

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
            {selectedNCM ? (
              <>
                <span className="font-medium">{selectedNCM.codigo}</span>
                <span className="text-muted-foreground ml-2">
                  {selectedNCM.descricao.length > 40
                    ? selectedNCM.descricao.substring(0, 40) + "..."
                    : selectedNCM.descricao}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
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
              {loading ? "Carregando..." : "Nenhum NCM encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {ncms.map((ncm) => (
                <CommandItem
                  key={ncm.id}
                  value={ncm.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ncm.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{ncm.codigo}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {ncm.descricao}
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

