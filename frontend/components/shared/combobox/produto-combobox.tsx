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
import { ProdutoService } from "@/lib/services/produto.service"

interface Produto {
  id: string
  codigo: string
  descricao: string
}

interface ProdutoComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProdutoCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o produto",
  disabled = false,
  className,
}: ProdutoComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [produtos, setProdutos] = React.useState<Produto[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      setLoading(true)
      const data = await ProdutoService.getAll()
      setProdutos(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProdutos = React.useMemo(() => {
    if (!search) return produtos
    return produtos.filter((produto) =>
      searchInFields(search, [produto.codigo, produto.descricao])
    )
  }, [produtos, search])

  const selectedProduto = produtos.find((p) => p.id === value)

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
          {selectedProduto ? (
            <span className="truncate">
              {selectedProduto.codigo} - {selectedProduto.descricao}
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
              {loading ? "Carregando..." : "Nenhum produto encontrado"}
            </CommandEmpty>
            <CommandGroup>
              {filteredProdutos.map((produto) => (
                <CommandItem
                  key={produto.id}
                  value={produto.id}
                  onSelect={() => {
                    onValueChange(produto.id === value ? undefined : produto.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === produto.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{produto.codigo} - {produto.descricao}</span>
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

