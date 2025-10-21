"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ClienteService, type Cliente } from "@/lib/services/cliente.service"

interface ClienteStats {
  totalClientes: number
  clientesAtivos: number
  clientesNovos: number
  crescimentoMes: number
}

interface UseClientesReturn {
  // Data
  clientes: Cliente[]
  stats: ClienteStats
  
  // Loading states
  loading: boolean
  statsLoading: boolean
  
  // Actions
  loadClientes: () => Promise<void>
  loadStats: () => Promise<void>
  deleteCliente: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

export function useClientes(): UseClientesReturn {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [stats, setStats] = useState<ClienteStats>({
    totalClientes: 0,
    clientesAtivos: 0,
    clientesNovos: 0,
    crescimentoMes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await ClienteService.getAll()
      setClientes(response.data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      // Simular dados por enquanto - depois integrar com API real
      setStats({
        totalClientes: 1234,
        clientesAtivos: 1180,
        clientesNovos: 45,
        crescimentoMes: 8.5,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      toast.error("Erro ao carregar estatísticas")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const deleteCliente = useCallback(async (id: string) => {
    try {
      await ClienteService.delete(id)
      toast.success("Cliente excluído com sucesso!")
      await loadClientes()
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente")
      throw error
    }
  }, [loadClientes])

  const refreshData = useCallback(async () => {
    await Promise.all([loadClientes(), loadStats()])
  }, [loadClientes, loadStats])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    clientes,
    stats,
    loading,
    statsLoading,
    loadClientes,
    loadStats,
    deleteCliente,
    refreshData,
  }
}
