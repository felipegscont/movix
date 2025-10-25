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
import { FornecedorService } from "@/lib/services/fornecedor.service"
import { FornecedorFormDialog } from "@/components/cadastros/fornecedores/fornecedor-form-dialog"

interface Fornecedor {
  id: string
  nome: string
  documento: string
}

interface FornecedorComboboxProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function FornecedorCombobox({
  value,
  onValueChange,
  placeholder = "Selecione o fornecedor",
  disabled = false,
  className,
}: FornecedorComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [fornecedores, setFornecedores] = React.useState<Fornecedor[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  // Carregar fornecedores
  React.useEffect(() => {
    loadFornecedores()
  }, [])

  const loadFornecedores = async () => {
    try {
      setLoading(true)
      const response = await FornecedorService.getAll({ page: 1, limit: 1000 })
      setFornecedores(response.data)
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar fornecedores
  const filteredFornecedores = React.useMemo(() => {
    if (!search) return fornecedores

    return searchInFields(fornecedores, search, ['nome', 'documento'])
  }, [fornecedores, search])

  // Encontrar fornecedor selecionado
  const selectedFornecedor = fornecedores.find((f) => f.id === value)

  const handleCreateSuccess = (novoFornecedor: any) => {
    loadFornecedores()
    onValueChange(novoFornecedor.id)
    setShowCreateDialog(false)
    setOpen(false)
  }

  return (
    <>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("w-full justify-between", className)}
              disabled={disabled || loading}
            >
              {selectedFornecedor ? (
                <span className="truncate">
                  {selectedFornecedor.nome} - {selectedFornecedor.documento}
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
                  <div className="py-6 text-center text-sm">
                    {loading ? (
                      "Carregando..."
                    ) : (
                      <div className="space-y-2">
                        <p>Nenhum fornecedor encontrado</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCreateDialog(true)
                            setOpen(false)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Cadastrar novo fornecedor
                        </Button>
                      </div>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredFornecedores.map((fornecedor) => (
                    <CommandItem
                      key={fornecedor.id}
                      value={fornecedor.id}
                      onSelect={() => {
                        onValueChange(fornecedor.id === value ? undefined : fornecedor.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === fornecedor.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{fornecedor.nome}</span>
                        <span className="text-sm text-muted-foreground">{fornecedor.documento}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowCreateDialog(true)}
          disabled={disabled}
          title="Cadastrar novo fornecedor"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <FornecedorFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}

