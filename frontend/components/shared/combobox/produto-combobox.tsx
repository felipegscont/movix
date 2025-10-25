"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
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
import { ProdutoFormDialog } from "@/components/cadastros/produtos/produto-form-dialog"

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
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  React.useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      setLoading(true)
      const response = await ProdutoService.getAll({ page: 1, limit: 1000 })
      setProdutos(response.data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProdutos = React.useMemo(() => {
    if (!search) return produtos
    return searchInFields(produtos, search, ['codigo', 'descricao'])
  }, [produtos, search])

  const selectedProduto = produtos.find((p) => p.id === value)

  const handleCreateSuccess = () => {
    loadProdutos()
    setShowCreateDialog(false)
    setOpen(false)
  }

  return (
    <>
      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0">
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
                    <div className="py-6 text-center text-sm">
                      {loading ? (
                        "Carregando..."
                      ) : (
                        <div className="space-y-2">
                          <p>Nenhum produto encontrado</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowCreateDialog(true)
                              setOpen(false)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar novo produto
                          </Button>
                        </div>
                      )}
                    </div>
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
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => setShowCreateDialog(true)}
          disabled={disabled}
          title="Cadastrar novo produto"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ProdutoFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}

