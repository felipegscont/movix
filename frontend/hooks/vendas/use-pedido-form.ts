"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  pedidoFormSchema,
  type PedidoFormData,
  type ItemFormData
} from "@/lib/schemas/pedido.schema"
import { PedidoService } from "@/lib/services/pedido.service"

interface UsePedidoFormProps {
  pedidoId?: string
  onSuccess?: () => void
}

interface UsePedidoFormReturn {
  // Form
  form: any

  // Loading states
  loading: boolean
  loadingPedido: boolean

  // Data
  pedido: any
  proximoNumero: number | null

  // Actions
  handleSubmit: any
  loadPedido: () => Promise<void>
  resetForm: () => void

  // Item management
  addItem: (item: ItemFormData) => void
  updateItem: (index: number, item: ItemFormData) => void
  removeItem: (index: number) => void

  // Calculations
  calculateItemTotal: (item: Partial<ItemFormData>) => number
  calculateTotals: () => {
    subtotal: number
    valorTotal: number
  }
}

export function usePedidoForm({ pedidoId, onSuccess }: UsePedidoFormProps = {}): UsePedidoFormReturn {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingPedido, setLoadingPedido] = useState(!!pedidoId)
  const [pedido, setPedido] = useState<any>(null)
  const [proximoNumero, setProximoNumero] = useState<number | null>(null)

  // Inicializar form com React Hook Form + Zod
  const form = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoFormSchema) as any,
    mode: "onBlur",
    defaultValues: {
      numero: 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      status: 'ABERTO',
      clienteId: '',
      vendedorNome: '',
      subtotal: 0,
      valorDesconto: 0,
      valorFrete: 0,
      valorOutros: 0,
      valorTotal: 0,
      observacoes: '',
      itens: [],
    } as PedidoFormData,
  })

  // Carregar próximo número se estiver criando
  useEffect(() => {
    if (!pedidoId) {
      loadProximoNumero()
    }
  }, [pedidoId])

  // Carregar Pedido se estiver editando
  useEffect(() => {
    if (pedidoId) {
      loadPedido()
    }
  }, [pedidoId])

  const loadProximoNumero = async () => {
    try {
      const numero = await PedidoService.getProximoNumero()
      setProximoNumero(numero)
      form.setValue('numero', numero)
    } catch (error) {
      console.error("Erro ao carregar próximo número:", error)
      toast.error("Erro ao carregar próximo número")
    }
  }

  const loadPedido = async () => {
    if (!pedidoId) return

    try {
      setLoadingPedido(true)
      const pedidoData = await PedidoService.getById(pedidoId)
      setPedido(pedidoData)

      // Preencher formulário
      form.reset({
        numero: pedidoData.numero,
        dataEmissao: pedidoData.dataEmissao?.split('T')[0],
        status: pedidoData.status,
        clienteId: pedidoData.clienteId,
        vendedorNome: pedidoData.vendedorNome || '',
        subtotal: pedidoData.subtotal,
        valorDesconto: pedidoData.valorDesconto || 0,
        valorFrete: pedidoData.valorFrete || 0,
        valorOutros: pedidoData.valorOutros || 0,
        valorTotal: pedidoData.valorTotal,
        observacoes: pedidoData.observacoes || '',
        itens: pedidoData.itens || [],
      })
    } catch (error) {
      console.error("Erro ao carregar pedido:", error)
      toast.error("Erro ao carregar pedido")
    } finally {
      setLoadingPedido(false)
    }
  }

  const resetForm = () => {
    form.reset({
      numero: proximoNumero || 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      status: 'ABERTO',
      clienteId: '',
      vendedorNome: '',
      subtotal: 0,
      valorDesconto: 0,
      valorFrete: 0,
      valorOutros: 0,
      valorTotal: 0,
      observacoes: '',
      itens: [],
    })
  }

  // Gerenciamento de itens
  const addItem = useCallback((item: ItemFormData) => {
    const currentItens = form.getValues('itens') || []
    const numeroItem = currentItens.length + 1
    
    const newItem = {
      ...item,
      numeroItem,
      valorTotal: calculateItemTotal(item)
    }
    
    form.setValue('itens', [...currentItens, newItem])
    
    // Recalcular totais
    const totals = calculateTotals()
    form.setValue('subtotal', totals.subtotal)
    form.setValue('valorTotal', totals.valorTotal)
  }, [form])

  const updateItem = useCallback((index: number, item: ItemFormData) => {
    const currentItens = form.getValues('itens') || []
    const updatedItens = [...currentItens]
    
    updatedItens[index] = {
      ...item,
      numeroItem: index + 1,
      valorTotal: calculateItemTotal(item)
    }
    
    form.setValue('itens', updatedItens)
    
    // Recalcular totais
    const totals = calculateTotals()
    form.setValue('subtotal', totals.subtotal)
    form.setValue('valorTotal', totals.valorTotal)
  }, [form])

  const removeItem = useCallback((index: number) => {
    const currentItens = form.getValues('itens') || []
    const updatedItens = currentItens.filter((_, i) => i !== index)
    
    // Renumerar itens
    const renumberedItens = updatedItens.map((item, i) => ({
      ...item,
      numeroItem: i + 1
    }))
    
    form.setValue('itens', renumberedItens)
    
    // Recalcular totais
    const totals = calculateTotals()
    form.setValue('subtotal', totals.subtotal)
    form.setValue('valorTotal', totals.valorTotal)
  }, [form])

  // Cálculos
  const calculateItemTotal = (item: Partial<ItemFormData>): number => {
    const quantidade = Number(item.quantidade) || 0
    const valorUnitario = Number(item.valorUnitario) || 0
    const valorDesconto = Number(item.valorDesconto) || 0
    
    return (quantidade * valorUnitario) - valorDesconto
  }

  const calculateTotals = useCallback(() => {
    const itens = form.getValues('itens') || []
    const valorDesconto = Number(form.getValues('valorDesconto')) || 0
    const valorFrete = Number(form.getValues('valorFrete')) || 0
    const valorOutros = Number(form.getValues('valorOutros')) || 0
    
    const subtotal = itens.reduce((sum, item) => sum + (Number(item.valorTotal) || 0), 0)
    const valorTotal = subtotal - valorDesconto + valorFrete + valorOutros
    
    return {
      subtotal,
      valorTotal
    }
  }, [form])

  // Submit
  const handleSubmit = form.handleSubmit(async (data: PedidoFormData) => {
    try {
      setLoading(true)

      // Recalcular totais antes de salvar
      const totals = calculateTotals()
      data.subtotal = totals.subtotal
      data.valorTotal = totals.valorTotal

      // Garantir que valores opcionais sejam números (não strings vazias ou null)
      const cleanData = {
        ...data,
        valorDesconto: Number(data.valorDesconto) || 0,
        valorFrete: Number(data.valorFrete) || 0,
        valorOutros: Number(data.valorOutros) || 0,
        vendedorNome: data.vendedorNome || undefined,
        observacoes: data.observacoes || undefined,
        dataEntrega: data.dataEntrega || undefined,
        enderecoEntrega: data.enderecoEntrega || undefined,
      }

      if (pedidoId) {
        // Atualizar
        await PedidoService.update(pedidoId, cleanData)
        toast.success("Pedido atualizado com sucesso!")
      } else {
        // Criar
        await PedidoService.create(cleanData)
        toast.success("Pedido criado com sucesso!")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/vendas/pedidos')
      }
    } catch (error: any) {
      console.error("Erro ao salvar pedido:", error)
      toast.error(error.message || "Erro ao salvar pedido")
    } finally {
      setLoading(false)
    }
  })

  return {
    form,
    loading,
    loadingPedido,
    pedido,
    proximoNumero,
    handleSubmit,
    loadPedido,
    resetForm,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateTotals,
  }
}

