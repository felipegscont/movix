"use client"

import { useState, useCallback } from "react"
import { NfeService, CreateNfeData, CreateNfeDuplicataData } from "@/lib/services/nfe.service"
import { toast } from "sonner"

interface UseNfeFormProps {
  nfeId?: string
  onSuccess?: () => void
}

export function useNfeForm({ nfeId, onSuccess }: UseNfeFormProps = {}) {
  const [loading, setLoading] = useState(false)
  
  // Dados básicos
  const [emitenteId, setEmitenteId] = useState("")
  const [clienteId, setClienteId] = useState("")
  const [naturezaOperacao, setNaturezaOperacao] = useState("Venda de mercadoria")
  const [serie, setSerie] = useState(1)
  const [tipoOperacao, setTipoOperacao] = useState(1) // 1=Saída
  const [consumidorFinal, setConsumidorFinal] = useState(1) // 1=Sim
  const [presencaComprador, setPresencaComprador] = useState(1) // 1=Presencial
  
  // Totalizadores
  const [valorProdutos, setValorProdutos] = useState(0)
  const [valorFrete, setValorFrete] = useState(0)
  const [valorSeguro, setValorSeguro] = useState(0)
  const [valorDesconto, setValorDesconto] = useState(0)
  const [valorOutros, setValorOutros] = useState(0)
  
  // Totalizadores raros (baseado em XMLs reais)
  const [valorICMSDesonerado, setValorICMSDesonerado] = useState(0)
  const [valorFCP, setValorFCP] = useState(0)
  const [valorII, setValorII] = useState(0)
  const [valorOutrasDespesas, setValorOutrasDespesas] = useState(0)
  
  // Duplicatas
  const [duplicatas, setDuplicatas] = useState<CreateNfeDuplicataData[]>([])
  
  // Informações adicionais
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("")
  const [informacoesFisco, setInformacoesFisco] = useState("")

  // Calcular valor total
  const valorTotal = valorProdutos + valorFrete + valorSeguro - valorDesconto + valorOutros

  /**
   * Adicionar duplicata
   */
  const adicionarDuplicata = useCallback((duplicata: CreateNfeDuplicataData) => {
    // Verificar se número já existe
    if (duplicatas.some(d => d.numero === duplicata.numero)) {
      toast.error("Já existe uma duplicata com este número")
      return false
    }

    setDuplicatas(prev => [...prev, duplicata])
    return true
  }, [duplicatas])

  /**
   * Remover duplicata
   */
  const removerDuplicata = useCallback((index: number) => {
    setDuplicatas(prev => prev.filter((_, i) => i !== index))
  }, [])

  /**
   * Validar duplicatas
   */
  const validarDuplicatas = useCallback(() => {
    if (duplicatas.length === 0) {
      return true // Sem duplicatas é válido
    }

    const somaDuplicatas = duplicatas.reduce((sum, dup) => sum + dup.valor, 0)
    const diferenca = Math.abs(somaDuplicatas - valorTotal)

    if (diferenca > 0.01) {
      toast.error(
        `Soma das duplicatas (${somaDuplicatas.toFixed(2)}) deve ser igual ao valor total (${valorTotal.toFixed(2)})`
      )
      return false
    }

    return true
  }, [duplicatas, valorTotal])

  /**
   * Gerar parcelas automaticamente
   */
  const gerarParcelas = useCallback((numeroParcelas: number) => {
    if (numeroParcelas < 1 || numeroParcelas > 12) {
      toast.error("Número de parcelas deve ser entre 1 e 12")
      return
    }

    if (valorTotal <= 0) {
      toast.error("Valor total deve ser maior que zero")
      return
    }

    const valorParcela = valorTotal / numeroParcelas
    const hoje = new Date()
    const novasDuplicatas: CreateNfeDuplicataData[] = []

    for (let i = 0; i < numeroParcelas; i++) {
      const dataVenc = new Date(hoje)
      dataVenc.setDate(dataVenc.getDate() + (30 * (i + 1))) // 30 dias entre parcelas

      novasDuplicatas.push({
        numero: String(i + 1).padStart(3, '0'),
        dataVencimento: dataVenc.toISOString().split('T')[0],
        valor: i === numeroParcelas - 1 
          ? valorTotal - (valorParcela * (numeroParcelas - 1)) // Última parcela ajusta diferença
          : valorParcela,
      })
    }

    setDuplicatas(novasDuplicatas)
    toast.success(`${numeroParcelas} parcelas geradas automaticamente`)
  }, [valorTotal])

  /**
   * Validar formulário
   */
  const validarFormulario = useCallback(() => {
    if (!emitenteId) {
      toast.error("Selecione um emitente")
      return false
    }

    if (!clienteId) {
      toast.error("Selecione um cliente")
      return false
    }

    if (!naturezaOperacao.trim()) {
      toast.error("Informe a natureza da operação")
      return false
    }

    if (valorTotal <= 0) {
      toast.error("Valor total deve ser maior que zero")
      return false
    }

    if (!validarDuplicatas()) {
      return false
    }

    return true
  }, [emitenteId, clienteId, naturezaOperacao, valorTotal, validarDuplicatas])

  /**
   * Submeter formulário
   */
  const handleSubmit = useCallback(async () => {
    if (!validarFormulario()) {
      return false
    }

    try {
      setLoading(true)

      const data: CreateNfeData = {
        emitenteId,
        clienteId,
        serie,
        naturezaOperacao,
        tipoOperacao,
        consumidorFinal,
        presencaComprador,
        valorFrete,
        valorSeguro,
        valorDesconto,
        valorOutros,
        // Totalizadores raros
        valorICMSDesonerado,
        valorFCP,
        valorII,
        valorOutrasDespesas,
        informacoesAdicionais,
        informacoesFisco,
        itens: [], // TODO: Implementar itens
        duplicatas: duplicatas.length > 0 ? duplicatas : undefined,
      }

      if (nfeId) {
        await NfeService.update(nfeId, data)
        toast.success("NFe atualizada com sucesso!")
      } else {
        await NfeService.create(data)
        toast.success("NFe criada com sucesso!")
      }

      onSuccess?.()
      return true
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar NFe")
      return false
    } finally {
      setLoading(false)
    }
  }, [
    validarFormulario,
    emitenteId,
    clienteId,
    serie,
    naturezaOperacao,
    tipoOperacao,
    consumidorFinal,
    presencaComprador,
    valorFrete,
    valorSeguro,
    valorDesconto,
    valorOutros,
    valorICMSDesonerado,
    valorFCP,
    valorII,
    valorOutrasDespesas,
    informacoesAdicionais,
    informacoesFisco,
    duplicatas,
    nfeId,
    onSuccess,
  ])

  return {
    // Estado
    loading,
    emitenteId,
    clienteId,
    naturezaOperacao,
    serie,
    tipoOperacao,
    consumidorFinal,
    presencaComprador,
    valorProdutos,
    valorFrete,
    valorSeguro,
    valorDesconto,
    valorOutros,
    valorICMSDesonerado,
    valorFCP,
    valorII,
    valorOutrasDespesas,
    duplicatas,
    informacoesAdicionais,
    informacoesFisco,
    valorTotal,

    // Setters
    setEmitenteId,
    setClienteId,
    setNaturezaOperacao,
    setSerie,
    setTipoOperacao,
    setConsumidorFinal,
    setPresencaComprador,
    setValorProdutos,
    setValorFrete,
    setValorSeguro,
    setValorDesconto,
    setValorOutros,
    setValorICMSDesonerado,
    setValorFCP,
    setValorII,
    setValorOutrasDespesas,
    setDuplicatas,
    setInformacoesAdicionais,
    setInformacoesFisco,

    // Ações
    adicionarDuplicata,
    removerDuplicata,
    validarDuplicatas,
    gerarParcelas,
    handleSubmit,
  }
}

