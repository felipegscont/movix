"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconDeviceFloppy, IconX } from "@tabler/icons-react"
import { ProdutoCombobox } from "@/components/shared/combobox/produto-combobox"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { NfeItemFormData } from "./types"
import { toast } from "sonner"

interface NfeItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: NfeItemFormData) => void
  item?: NfeItemFormData
  itemIndex?: number
}

export function NfeItemDialog({ isOpen, onClose, onSave, item, itemIndex }: NfeItemDialogProps) {
  const [formData, setFormData] = useState<Partial<NfeItemFormData>>({
    produtoId: '',
    codigo: '',
    descricao: '',
    ncmId: '',
    cfopId: '',
    unidadeComercial: 'UN',
    quantidadeComercial: 1,
    valorUnitario: 0,
    valorDesconto: 0,
    valorTotal: 0,
    origem: '0',
    icmsCstId: '',
    pisCstId: '',
    cofinsCstId: ''
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      // Reset form
      setFormData({
        produtoId: '',
        codigo: '',
        descricao: '',
        ncmId: '',
        cfopId: '',
        unidadeComercial: 'UN',
        quantidadeComercial: 1,
        valorUnitario: 0,
        valorDesconto: 0,
        valorTotal: 0,
        origem: '0',
        icmsCstId: '',
        pisCstId: '',
        cofinsCstId: ''
      })
    }
  }, [item, isOpen])

  // Calcular valor total automaticamente
  useEffect(() => {
    const quantidade = formData.quantidadeComercial || 0
    const valorUnitario = formData.valorUnitario || 0
    const desconto = formData.valorDesconto || 0
    
    const total = (quantidade * valorUnitario) - desconto
    
    setFormData(prev => ({ ...prev, valorTotal: total }))
  }, [formData.quantidadeComercial, formData.valorUnitario, formData.valorDesconto])

  const handleProdutoChange = (produtoId: string, produto: any) => {
    if (produto) {
      setFormData(prev => ({
        ...prev,
        produtoId,
        codigo: produto.codigo,
        descricao: produto.descricao,
        ncmId: produto.ncmId,
        unidadeComercial: produto.unidadeComercial || 'UN',
        valorUnitario: produto.valorVenda || 0
      }))
    }
  }

  const handleSubmit = () => {
    // Validações
    if (!formData.produtoId) {
      toast.error('Selecione um produto')
      return
    }

    if (!formData.cfopId) {
      toast.error('Selecione um CFOP')
      return
    }

    if (!formData.quantidadeComercial || formData.quantidadeComercial <= 0) {
      toast.error('Quantidade deve ser maior que zero')
      return
    }

    if (!formData.valorUnitario || formData.valorUnitario <= 0) {
      toast.error('Valor unitário deve ser maior que zero')
      return
    }

    if (!formData.pisCstId) {
      toast.error('Selecione o CST de PIS')
      return
    }

    if (!formData.cofinsCstId) {
      toast.error('Selecione o CST de COFINS')
      return
    }

    onSave(formData as NfeItemFormData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Item' : 'Adicionar Item'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do item da nota fiscal
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Produto */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="produto" className="text-right">
              Produto *
            </Label>
            <div className="col-span-3">
              <ProdutoCombobox
                value={formData.produtoId || ''}
                onValueChange={handleProdutoChange}
              />
            </div>
          </div>

          {/* CFOP */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cfop" className="text-right">
              CFOP *
            </Label>
            <div className="col-span-3">
              <CFOPCombobox
                value={formData.cfopId || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cfopId: value || '' }))}
              />
            </div>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade" className="text-right">
              Quantidade *
            </Label>
            <div className="col-span-1">
              <Input
                id="quantidade"
                type="number"
                step="0.0001"
                min="0"
                value={formData.quantidadeComercial || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  quantidadeComercial: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
            <Label htmlFor="unidade" className="text-right">
              Unidade
            </Label>
            <div className="col-span-1">
              <Input
                id="unidade"
                value={formData.unidadeComercial || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, unidadeComercial: e.target.value }))}
                maxLength={6}
              />
            </div>
          </div>

          {/* Valor Unitário e Desconto */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valorUnitario" className="text-right">
              Valor Unitário *
            </Label>
            <div className="col-span-1">
              <Input
                id="valorUnitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorUnitario || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  valorUnitario: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
            <Label htmlFor="desconto" className="text-right">
              Desconto
            </Label>
            <div className="col-span-1">
              <Input
                id="desconto"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorDesconto || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  valorDesconto: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
          </div>

          {/* Valor Total (readonly) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valorTotal" className="text-right">
              Valor Total
            </Label>
            <div className="col-span-3">
              <Input
                id="valorTotal"
                type="text"
                value={formData.valorTotal?.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* Origem */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="origem" className="text-right">
              Origem
            </Label>
            <div className="col-span-3">
              <select
                id="origem"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.origem || '0'}
                onChange={(e) => setFormData(prev => ({ ...prev, origem: e.target.value }))}
              >
                <option value="0">0 - Nacional</option>
                <option value="1">1 - Estrangeira - Importação direta</option>
                <option value="2">2 - Estrangeira - Adquirida no mercado interno</option>
              </select>
            </div>
          </div>

          {/* Nota sobre impostos */}
          <div className="col-span-4 text-sm text-muted-foreground">
            <p>* Os impostos (ICMS, PIS, COFINS) serão calculados automaticamente com base nas configurações do produto e CFOP.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <IconX className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <IconDeviceFloppy className="h-4 w-4 mr-2" />
            Salvar Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
