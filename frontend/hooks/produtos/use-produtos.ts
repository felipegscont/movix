"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ProdutoService, type Produto } from "@/lib/services/produto.service"

interface ProdutoStats {
  totalProdutos: number
  produtosAtivos: number
  produtosNovos: number
  valorTotalEstoque: number
}

interface UseProdutosReturn {
  // Data
  produtos: Produto[]
  stats: ProdutoStats
  
  // Loading states
  loading: boolean
  statsLoading: boolean
  
  // Actions
  loadProdutos: () => Promise<void>
  loadStats: () => Promise<void>
  deleteProduto: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

export function useProdutos(): UseProdutosReturn {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [stats, setStats] = useState<ProdutoStats>({
    totalProdutos: 0,
    produtosAtivos: 0,
    produtosNovos: 0,
    valorTotalEstoque: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const loadProdutos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await ProdutoService.getAll()
      setProdutos(response.data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast.error("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      // Simular dados por enquanto - depois integrar com API real
      setStats({
        totalProdutos: 2847,
        produtosAtivos: 2650,
        produtosNovos: 89,
        valorTotalEstoque: 1250000.50,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      toast.error("Erro ao carregar estatísticas")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const deleteProduto = useCallback(async (id: string) => {
    try {
      await ProdutoService.delete(id)
      toast.success("Produto excluído com sucesso!")
      await loadProdutos()
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao excluir produto")
      throw error
    }
  }, [loadProdutos])

  const refreshData = useCallback(async () => {
    await Promise.all([loadProdutos(), loadStats()])
  }, [loadProdutos, loadStats])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    produtos,
    stats,
    loading,
    statsLoading,
    loadProdutos,
    loadStats,
    deleteProduto,
    refreshData,
  }
}
