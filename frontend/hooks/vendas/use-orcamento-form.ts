"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  orcamentoFormSchema,
  type OrcamentoFormData,
  type OrcamentoItemFormData
} from "@/lib/schemas/orcamento.schema"
import { OrcamentoService } from "@/lib/services/orcamento.service"

interface UseOrcamentoFormProps {
  orcamentoId?: string
  onSuccess?: () => void
}

interface UseOrcamentoFormReturn {
  // Form
  form: any

  // Loading states
  loading: boolean
  loadingOrcamento: boolean

  // Data
  orcamento: any
  proximoNumero: number | null

  // Actions
  handleSubmit: any
  loadOrcamento: () => Promise<void>
  resetForm: () => void

  // Item management
  addItem: (item: OrcamentoItemFormData) => void
  updateItem: (index: number, item: OrcamentoItemFormData) => void
  removeItem: (index: number) => void

  // Calculations
  calculateItemTotal: (item: Partial<OrcamentoItemFormData>) => number
  calculateTotals: () => {
    subtotal: number
    valorTotal: number
  }
}

export function useOrcamentoForm({ orcamentoId, onSuccess }: UseOrcamentoFormProps = {}): UseOrcamentoFormReturn {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingOrcamento, setLoadingOrcamento] = useState(!!orcamentoId)
  const [orcamento, setOrcamento] = useState<any>(null)
  const [proximoNumero, setProximoNumero] = useState<number | null>(null)

  // Inicializar form com React Hook Form + Zod
  const form = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoFormSchema) as any,
    mode: "onBlur",
    defaultValues: {
      numero: 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
      status: 'EM_ABERTO',
      clienteId: '',
      vendedorNome: '',
      subtotal: 0,
      valorDesconto: 0,
      valorFrete: 0,
      valorOutros: 0,
      valorTotal: 0,
      observacoes: '',
      itens: [],
    } as OrcamentoFormData,
  })

  // Carregar próximo número se estiver criando
  useEffect(() => {
    if (!orcamentoId) {
      loadProximoNumero()
    }
  }, [orcamentoId])

  // Carregar Orcamento se estiver editando
  useEffect(() => {
    if (orcamentoId) {
      loadOrcamento()
    }
  }, [orcamentoId])

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

  const loadOrcamento = async () => {
    if (!orcamentoId) return

    try {
      setLoadingOrcamento(true)
      const orcamentoData = await PedidoService.getById(orcamentoId)
      setOrcamento(orcamentoData)

      // Preencher formulário
      form.reset({
        numero: orcamentoData.numero,
        dataEmissao: orcamentoData.dataEmissao?.split('T')[0],
        dataValidade: orcamentoData.dataValidade?.split('T')[0],
        status: orcamentoData.status,
        clienteId: orcamentoData.clienteId,
        vendedorNome: orcamentoData.vendedorNome || '',
        subtotal: orcamentoData.subtotal,
        valorDesconto: orcamentoData.valorDesconto || 0,
        valorFrete: orcamentoData.valorFrete || 0,
        valorOutros: orcamentoData.valorOutros || 0,
        valorTotal: orcamentoData.valorTotal,
        observacoes: orcamentoData.observacoes || '',
        itens: orcamentoData.itens || [],
      })
    } catch (error) {
      console.error("Erro ao carregar orcamento:", error)
      toast.error("Erro ao carregar orcamento")
    } finally {
      setLoadingOrcamento(false)
    }
  }

  const resetForm = () => {
    form.reset({
      numero: proximoNumero || 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'EM_ABERTO',
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
  const addItem = useCallback((item: OrcamentoItemFormData) => {
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

  const updateItem = useCallback((index: number, item: OrcamentoItemFormData) => {
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
  const calculateItemTotal = (item: Partial<OrcamentoItemFormData>): number => {
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
  const handleSubmit = form.handleSubmit(async (data: OrcamentoFormData) => {
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
      }

      if (orcamentoId) {
        // Atualizar
        await OrcamentoService.update(orcamentoId, cleanData)
        toast.success("Orçamento atualizado com sucesso!")
      } else {
        // Criar
        await OrcamentoService.create(cleanData)
        toast.success("Orçamento criado com sucesso!")
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/vendas/orcamentos')
      }
    } catch (error: any) {
      console.error("Erro ao salvar orcamento:", error)
      toast.error(error.message || "Erro ao salvar orcamento")
    } finally {
      setLoading(false)
    }
  })

  return {
    form,
    loading,
    loadingOrcamento,
    orcamento,
    proximoNumero,
    handleSubmit,
    loadOrcamento,
    resetForm,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateTotals,
  }
}

