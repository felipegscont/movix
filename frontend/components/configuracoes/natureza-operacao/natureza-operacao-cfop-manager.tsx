"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { CFOPCombobox } from "@/components/shared/combobox/cfop-combobox"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import { NaturezaOperacaoService } from "@/lib/services/natureza-operacao.service"
import { truncateCFOPDescription } from "@/lib/utils/text"

interface CFOP {
  id: string
  codigo: string
  descricao: string
  tipo?: string
}

interface CFOPVinculado {
  id: string
  cfop: CFOP
  padrao: boolean
}

interface NaturezaOperacaoCFOPManagerProps {
  naturezaId?: string
  tipoOperacao: number // 0=Entrada, 1=Saída
}

export function NaturezaOperacaoCFOPManager({
  naturezaId,
  tipoOperacao,
}: NaturezaOperacaoCFOPManagerProps) {
  const [cfopsVinculados, setCfopsVinculados] = useState<CFOPVinculado[]>([])
  const [selectedCfopId, setSelectedCfopId] = useState<string>("")
  const [isPadrao, setIsPadrao] = useState(false)
  const [loading, setLoading] = useState(false)

  // Dados mockados para demonstração
  useEffect(() => {
    loadCFOPsVinculados()
  }, [naturezaId])

  const loadCFOPsVinculados = async () => {
    if (!naturezaId) {
      // Mock de dados conforme o exemplo fornecido para nova natureza
      const mockCFOPs: CFOPVinculado[] = [
        {
          id: "1",
          cfop: {
            id: "cfop1",
            codigo: "5403",
            descricao: "Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituto",
          },
          padrao: false,
        },
        {
          id: "2",
          cfop: {
            id: "cfop2",
            codigo: "5102",
            descricao: "Venda de mercadoria adquirida ou recebida de terceiros",
          },
          padrao: false,
        },
      ]
      setCfopsVinculados(mockCFOPs)
      return
    }

    try {
      const cfops = await NaturezaOperacaoService.getCFOPs(naturezaId)
      setCfopsVinculados(cfops)
    } catch (error) {
      console.error("Erro ao carregar CFOPs:", error)
      toast.error("Erro ao carregar CFOPs")
    }
  }

  const handleAddCFOP = async () => {
    if (!selectedCfopId) {
      toast.error("Selecione um CFOP")
      return
    }

    try {
      setLoading(true)

      // Verificar se o CFOP já está vinculado
      const jaVinculado = cfopsVinculados.some(item => item.cfop.id === selectedCfopId)
      if (jaVinculado) {
        toast.error("Este CFOP já está vinculado")
        return
      }

      if (naturezaId) {
        // Adicionar via API
        const novoCfop = await NaturezaOperacaoService.addCFOP(naturezaId, selectedCfopId, isPadrao)
        setCfopsVinculados(prev => [...prev, novoCfop])
      } else {
        // Mock para nova natureza
        const cfops = await AuxiliarService.getCFOPs(
          tipoOperacao === 1 ? 'SAIDA' : 'ENTRADA'
        )
        const cfopSelecionado = cfops.find(c => c.id === selectedCfopId)

        if (!cfopSelecionado) {
          toast.error("CFOP não encontrado")
          return
        }

        // Se for marcado como padrão, desmarcar outros
        let novosCfops = cfopsVinculados
        if (isPadrao) {
          novosCfops = cfopsVinculados.map(item => ({
            ...item,
            padrao: false
          }))
        }

        // Adicionar novo CFOP
        const novoCfop: CFOPVinculado = {
          id: Date.now().toString(),
          cfop: cfopSelecionado,
          padrao: isPadrao,
        }

        setCfopsVinculados([...novosCfops, novoCfop])
      }

      setSelectedCfopId("")
      setIsPadrao(false)
      toast.success("CFOP adicionado com sucesso!")

    } catch (error) {
      console.error("Erro ao adicionar CFOP:", error)
      toast.error("Erro ao adicionar CFOP")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCFOP = async (id: string) => {
    try {
      const cfopVinculado = cfopsVinculados.find(item => item.id === id)
      if (!cfopVinculado) return

      if (naturezaId) {
        await NaturezaOperacaoService.removeCFOP(naturezaId, cfopVinculado.cfop.id)
      }

      setCfopsVinculados(prev => prev.filter(item => item.id !== id))
      toast.success("CFOP removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover CFOP:", error)
      toast.error("Erro ao remover CFOP")
    }
  }

  const handleTogglePadrao = async (id: string) => {
    try {
      const cfopVinculado = cfopsVinculados.find(item => item.id === id)
      if (!cfopVinculado) return

      const novoPadrao = !cfopVinculado.padrao

      if (naturezaId) {
        await NaturezaOperacaoService.updateCFOPPadrao(naturezaId, cfopVinculado.cfop.id, novoPadrao)
      }

      setCfopsVinculados(prev => prev.map(item => ({
        ...item,
        padrao: item.id === id ? novoPadrao : (novoPadrao ? false : item.padrao) // Apenas um pode ser padrão
      })))
    } catch (error) {
      console.error("Erro ao atualizar CFOP padrão:", error)
      toast.error("Erro ao atualizar CFOP padrão")
    }
  }

  const cfopTipo = tipoOperacao === 1 ? 'SAIDA' : 'ENTRADA'

  return (
    <div className="space-y-4">
      {/* Linha de adição de CFOP - Layout compacto */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <span className="text-sm font-medium mr-2">CFOP:</span>
          <CFOPCombobox
            value={selectedCfopId}
            onValueChange={(value) => setSelectedCfopId(value || "")}
            tipo={cfopTipo}
            placeholder="Selecione ..."
            className="inline-block w-64"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="padrao"
            checked={isPadrao}
            onCheckedChange={(checked) => setIsPadrao(checked)}
          />
          <label
            htmlFor="padrao"
            className="text-sm font-medium cursor-pointer"
          >
            CFOP Padrão
          </label>
        </div>

        <Button
          onClick={handleAddCFOP}
          disabled={loading || !selectedCfopId}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 h-9"
        >
          ADICIONAR
        </Button>
      </div>

      {/* Área de resultados */}
      <div className="border rounded-lg">
        {cfopsVinculados.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Não foram encontrados registros.</p>
          </div>
        ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CFOP</TableHead>
                  <TableHead>Descrição Resumida do CFOP</TableHead>
                  <TableHead className="text-center">CFOP Padrão</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cfopsVinculados.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {item.cfop.codigo}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md" title={item.cfop.descricao}>
                        {truncateCFOPDescription(item.cfop.descricao)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Switch
                          checked={item.padrao}
                          onCheckedChange={() => handleTogglePadrao(item.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCFOP(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        )}
      </div>
    </div>
  )
}
