"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { FornecedorService, type Fornecedor } from "@/lib/services/fornecedor.service"

interface FornecedorStats {
  totalFornecedores: number
  fornecedoresAtivos: number
  fornecedoresNovos: number
  crescimentoMes: number
}

interface UseFornecedoresReturn {
  // Data
  fornecedores: Fornecedor[]
  stats: FornecedorStats
  
  // Loading states
  loading: boolean
  statsLoading: boolean
  
  // Actions
  loadFornecedores: () => Promise<void>
  loadStats: () => Promise<void>
  deleteFornecedor: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

export function useFornecedores(): UseFornecedoresReturn {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [stats, setStats] = useState<FornecedorStats>({
    totalFornecedores: 0,
    fornecedoresAtivos: 0,
    fornecedoresNovos: 0,
    crescimentoMes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const loadFornecedores = useCallback(async () => {
    try {
      setLoading(true)
      const response = await FornecedorService.getAll()
      setFornecedores(response.data)
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
      toast.error("Erro ao carregar fornecedores")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      // Simular dados por enquanto - depois integrar com API real
      setStats({
        totalFornecedores: 456,
        fornecedoresAtivos: 420,
        fornecedoresNovos: 12,
        crescimentoMes: 3.2,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      toast.error("Erro ao carregar estatísticas")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const deleteFornecedor = useCallback(async (id: string) => {
    try {
      await FornecedorService.delete(id)
      toast.success("Fornecedor excluído com sucesso!")
      await loadFornecedores()
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error)
      toast.error("Erro ao excluir fornecedor")
      throw error
    }
  }, [loadFornecedores])

  const refreshData = useCallback(async () => {
    await Promise.all([loadFornecedores(), loadStats()])
  }, [loadFornecedores, loadStats])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    fornecedores,
    stats,
    loading,
    statsLoading,
    loadFornecedores,
    loadStats,
    deleteFornecedor,
    refreshData,
  }
}
