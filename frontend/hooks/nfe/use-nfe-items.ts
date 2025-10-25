"use client"

import { useState, useCallback } from 'react'
import { type NfeItemFormData } from '@/lib/schemas/nfe.schema'
import { toast } from 'sonner'

export function useNfeItems(initialItems: NfeItemFormData[] = []) {
  const [items, setItems] = useState<NfeItemFormData[]>(initialItems)

  // Adicionar item
  const addItem = useCallback((item: NfeItemFormData) => {
    setItems(prev => [...prev, item])
    toast.success('Item adicionado com sucesso!')
  }, [])

  // Atualizar item
  const updateItem = useCallback((index: number, item: NfeItemFormData) => {
    setItems(prev => {
      const newItems = [...prev]
      newItems[index] = item
      return newItems
    })
    toast.success('Item atualizado com sucesso!')
  }, [])

  // Remover item
  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
    toast.success('Item removido com sucesso!')
  }, [])

  // Limpar todos os itens
  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  // Calcular totais
  const calculateTotals = useCallback(() => {
    const subtotal = items.reduce((sum, item) => sum + item.valorTotal, 0)
    const totalQuantidade = items.reduce((sum, item) => sum + item.quantidadeComercial, 0)

    const totalImpostos = {
      icms: items.reduce((sum, item) => sum + (item.icms?.valor || 0), 0),
      pis: items.reduce((sum, item) => sum + (item.pis?.valor || 0), 0),
      cofins: items.reduce((sum, item) => sum + (item.cofins?.valor || 0), 0)
    }

    return {
      subtotal,
      totalQuantidade,
      totalImpostos,
      totalItens: items.length
    }
  }, [items])

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    calculateTotals
  }
}
