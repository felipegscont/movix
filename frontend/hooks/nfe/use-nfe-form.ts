"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  nfeFormSchema, 
  type NfeFormData,
  type NfeItemFormData,
  defaultNfeFormData 
} from "@/lib/schemas/nfe.schema"
import { NfeService } from "@/lib/services/nfe.service"
import { EmitenteService } from "@/lib/services/emitente.service"

interface UseNfeFormProps {
  nfeId?: string
  onSuccess?: () => void
}

interface UseNfeFormReturn {
  // Form
  form: any

  // Loading states
  loading: boolean
  loadingNfe: boolean
  loadingEmitente: boolean

  // Data
  emitente: any
  nfe: any

  // Actions
  handleSubmit: any
  loadNfe: () => Promise<void>
  resetForm: () => void

  // Item management
  addItem: (item: NfeItemFormData) => void
  updateItem: (index: number, item: NfeItemFormData) => void
  removeItem: (index: number) => void

  // Calculations
  calculateItemTotal: (item: Partial<NfeItemFormData>) => number
  calculateNfeTotal: () => number
  calculateTotals: () => {
    valorProdutos: number
    valorTotal: number
    valorTotalImpostos: number
    valorICMS: number
    valorIPI: number
    valorPIS: number
    valorCOFINS: number
  }

  // Alert dialog
  alertDialog: {
    open: boolean
    title: string
    description: string
    errors: string[]
    onClose: () => void
  }
}

export function useNfeForm({ nfeId, onSuccess }: UseNfeFormProps = {}): UseNfeFormReturn {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingNfe, setLoadingNfe] = useState(!!nfeId)
  const [loadingEmitente, setLoadingEmitente] = useState(true)
  const [emitente, setEmitente] = useState<any>(null)
  const [nfe, setNfe] = useState<any>(null)
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: "",
    description: "",
    errors: [] as string[]
  })

  // Inicializar form com React Hook Form + Zod
  const form = useForm<NfeFormData>({
    resolver: zodResolver(nfeFormSchema) as any,
    mode: "onBlur",
    defaultValues: {
      ...defaultNfeFormData,
      dataEmissao: new Date().toISOString().split('T')[0],
    } as NfeFormData,
  })

  // Carregar emitente ativo
  useEffect(() => {
    loadEmitente()
  }, [])

  // Carregar NFe se estiver editando
  useEffect(() => {
    if (nfeId) {
      loadNfe()
    }
  }, [nfeId])

  const loadEmitente = async () => {
    try {
      setLoadingEmitente(true)
      const emitenteAtivo = await EmitenteService.getEmitenteAtivo()
      setEmitente(emitenteAtivo)
      
      // Atualizar série no form
      if (emitenteAtivo?.serieNfe) {
        form.setValue('serie', emitenteAtivo.serieNfe)
      }
    } catch (error) {
      console.error("Erro ao carregar emitente:", error)
      toast.error("Erro ao carregar emitente")
    } finally {
      setLoadingEmitente(false)
    }
  }

  const loadNfe = async () => {
    if (!nfeId) return

    try {
      setLoadingNfe(true)
      const nfeData = await NfeService.getById(nfeId)
      setNfe(nfeData)

      // Preencher formulário com dados da NFe
      form.reset({
        clienteId: nfeData.clienteId,
        serie: nfeData.serie,
        naturezaOperacao: nfeData.naturezaOperacao,
        tipoOperacao: nfeData.tipoOperacao,
        finalidade: nfeData.finalidade || 0,
        consumidorFinal: nfeData.consumidorFinal,
        presencaComprador: nfeData.presencaComprador,
        dataEmissao: nfeData.dataEmissao?.split('T')[0],
        dataSaida: nfeData.dataSaida?.split('T')[0],
        modalidadeFrete: nfeData.modalidadeFrete,
        valorFrete: nfeData.valorFrete,
        valorSeguro: nfeData.valorSeguro,
        valorDesconto: nfeData.valorDesconto,
        valorOutros: nfeData.valorOutros,
        valorICMSDesonerado: nfeData.valorICMSDesonerado,
        valorFCP: nfeData.valorFCP,
        valorII: nfeData.valorII,
        valorOutrasDespesas: nfeData.valorOutrasDespesas,
        informacoesAdicionais: nfeData.informacoesAdicionais,
        informacoesFisco: nfeData.informacoesFisco,
        itens: nfeData.itens?.map((item: any) => ({
          produtoId: item.produtoId,
          codigo: item.codigo,
          codigoBarras: item.codigoBarras,
          descricao: item.descricao,
          ncmId: item.ncmId,
          cfopId: item.cfopId,
          unidadeComercial: item.unidadeComercial,
          quantidadeComercial: item.quantidadeComercial,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal,
          unidadeTributavel: item.unidadeTributavel,
          quantidadeTributavel: item.quantidadeTributavel,
          valorUnitarioTrib: item.valorUnitarioTrib,
          valorFrete: item.valorFrete,
          valorSeguro: item.valorSeguro,
          valorDesconto: item.valorDesconto,
          valorOutros: item.valorOutros,
          origem: item.origem,
          incluiTotal: item.incluiTotal,
          informacoesAdicionais: item.informacoesAdicionais,
          icms: item.icms,
          ipi: item.ipi,
          pis: item.pis,
          cofins: item.cofins,
        })) || [],
        duplicatas: nfeData.duplicatas?.map((dup: any) => ({
          numero: dup.numero,
          dataVencimento: dup.dataVencimento?.split('T')[0],
          valor: dup.valor,
        })) || [],
        pagamentos: nfeData.pagamentos?.map((pag: any) => ({
          indicadorPagamento: pag.indicadorPagamento,
          formaPagamentoId: pag.formaPagamentoId,
          descricaoPagamento: pag.descricaoPagamento,
          valor: pag.valor,
          dataPagamento: pag.dataPagamento?.split('T')[0],
          tipoIntegracao: pag.tipoIntegracao,
          cnpjCredenciadora: pag.cnpjCredenciadora,
          bandeira: pag.bandeira,
          numeroAutorizacao: pag.numeroAutorizacao,
        })) || [],
      })
    } catch (error) {
      console.error("Erro ao carregar NFe:", error)
      toast.error("Erro ao carregar NFe")
    } finally {
      setLoadingNfe(false)
    }
  }

  const handleSubmit = async (data: NfeFormData) => {
    console.log('🚀 handleSubmit chamado!')
    console.log('📋 Dados recebidos:', data)

    try {
      setLoading(true)
      console.log('⏳ Loading setado para true')

      // Validar dados antes de enviar
      if (!data.clienteId) {
        throw new Error('Cliente é obrigatório')
      }

      if (!data.itens || data.itens.length === 0) {
        throw new Error('Adicione pelo menos um item')
      }

      console.log('✅ Validações passaram')

      // Transformar dados do formulário para o formato do backend
      const backendData = {
        clienteId: data.clienteId,
        serie: data.serie,
        naturezaOperacao: data.naturezaOperacao,
        tipoOperacao: data.tipoOperacao,
        consumidorFinal: data.consumidorFinal,
        presencaComprador: data.presencaComprador,
        dataEmissao: data.dataEmissao,
        dataSaida: data.dataSaida,
        modalidadeFrete: data.modalidadeFrete,
        valorFrete: data.valorFrete,
        valorSeguro: data.valorSeguro,
        valorDesconto: data.valorDesconto,
        valorOutros: data.valorOutros,
        informacoesAdicionais: data.informacoesAdicionais,
        informacoesFisco: data.informacoesFisco,
        itens: data.itens.map((item, index) => {
          // Validar campos obrigatórios
          if (!item.cfopId) {
            throw new Error(`Item ${index + 1}: CFOP é obrigatório`)
          }
          if (!item.pis?.cstId) {
            throw new Error(`Item ${index + 1}: CST PIS é obrigatório`)
          }
          if (!item.cofins?.cstId) {
            throw new Error(`Item ${index + 1}: CST COFINS é obrigatório`)
          }

          return {
            produtoId: item.produtoId,
            numeroItem: index + 1, // Converter para inteiro começando em 1
            cfopId: item.cfopId,
            quantidadeComercial: item.quantidadeComercial,
            valorUnitario: item.valorUnitario,
            valorDesconto: item.valorDesconto || 0,
            valorFrete: item.valorFrete || 0,
            valorSeguro: item.valorSeguro || 0,
            valorOutros: item.valorOutros || 0,
            informacoesAdicionais: item.informacoesAdicionais,
            // Tributação ICMS
            icmsCstId: item.icms?.cstId,
            icmsCsosnId: item.icms?.csosnId,
            icmsBaseCalculo: item.icms?.baseCalculo || 0,
            icmsAliquota: item.icms?.aliquota || 0,
            icmsValor: item.icms?.valor || 0,
            // Tributação PIS
            pisCstId: item.pis.cstId,
            pisBaseCalculo: item.pis.baseCalculo || 0,
            pisAliquota: item.pis.aliquota || 0,
            pisValor: item.pis.valor || 0,
            // Tributação COFINS
            cofinsCstId: item.cofins.cstId,
            cofinsBaseCalculo: item.cofins.baseCalculo || 0,
            cofinsAliquota: item.cofins.aliquota || 0,
            cofinsValor: item.cofins.valor || 0,
          }
        }),
        duplicatas: data.duplicatas?.map(dup => ({
          numero: dup.numero,
          dataVencimento: dup.dataVencimento,
          valor: dup.valor,
        })),
        cobranca: data.cobranca ? {
          numeroFatura: data.cobranca.numeroFatura,
          valorOriginal: data.cobranca.valorOriginal,
          valorDesconto: data.cobranca.valorDesconto || 0,
          valorLiquido: data.cobranca.valorLiquido,
        } : undefined,
        pagamentos: data.pagamentos?.map(pag => ({
          indicadorPagamento: pag.indicadorPagamento,
          formaPagamentoId: pag.formaPagamentoId,
          descricaoPagamento: pag.descricaoPagamento,
          valor: pag.valor,
          dataPagamento: pag.dataPagamento,
          tipoIntegracao: pag.tipoIntegracao,
          cnpjCredenciadora: pag.cnpjCredenciadora,
          bandeira: pag.bandeira,
          numeroAutorizacao: pag.numeroAutorizacao,
        })),
      }

      // Buscar códigos das formas de pagamento
      if (backendData.pagamentos && backendData.pagamentos.length > 0) {
        const formasPagamento = await NfeService.getFormasPagamento()

        backendData.pagamentos = backendData.pagamentos.map((pag: any) => {
          // Buscar o código pelo ID (formaPagamentoId do formulário)
          const formaPagamentoId = pag.formaPagamentoId
          if (formaPagamentoId) {
            const forma = formasPagamento.find((f: any) => f.id === formaPagamentoId)
            if (forma) {
              const { formaPagamentoId: _, ...rest } = pag
              return { ...rest, formaPagamento: forma.codigo }
            }
          }

          throw new Error('Forma de pagamento não encontrada')
        }) as any
      }

      console.log('📦 Dados transformados para backend:', backendData)

      if (nfeId) {
        // Atualizar NFe existente
        console.log('🔄 Atualizando NFe:', nfeId)
        await NfeService.update(nfeId, backendData as any)
        toast.success("NFe atualizada com sucesso!")
      } else {
        // Criar nova NFe
        console.log('➕ Criando nova NFe')
        const result = await NfeService.create(backendData as any)
        console.log('✅ NFe criada:', result)
        toast.success("NFe criada com sucesso!")
      }

      // Chamar callback se fornecido, senão redirecionar diretamente
      if (onSuccess) {
        console.log('📞 Chamando callback onSuccess')
        onSuccess()
      } else {
        console.log('➡️ Redirecionando para /nfes')
        router.push('/nfes')
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar NFe:", error)

      // Extrair mensagem de erro mais específica
      let errorMessage = "Erro ao salvar NFe"
      let errorsList: string[] = []

      if (error.message) {
        errorMessage = error.message

        // Parsear erros de validação
        if (errorMessage.includes(',')) {
          errorsList = errorMessage.split(',').map((err: string) => err.trim())
        } else {
          errorsList = [errorMessage]
        }
      } else if (typeof error === 'string') {
        errorMessage = error
        errorsList = [error]
      }

      // Mostrar AlertDialog com os erros
      setAlertDialog({
        open: true,
        title: "Erro ao Salvar NFe",
        description: "Foram encontrados os seguintes problemas que precisam ser corrigidos:",
        errors: errorsList
      })
    } finally {
      console.log('🏁 Finalizando, setando loading para false')
      setLoading(false)
    }
  }

  const resetForm = useCallback(() => {
    form.reset({
      ...defaultNfeFormData,
      dataEmissao: new Date().toISOString().split('T')[0],
      serie: emitente?.serieNfe || 1,
    } as NfeFormData)
  }, [form, emitente])

  // Gerenciamento de itens
  const addItem = useCallback((item: NfeItemFormData) => {
    const currentItens = form.getValues('itens') || []
    form.setValue('itens', [...currentItens, item])
  }, [form])

  const updateItem = useCallback((index: number, item: NfeItemFormData) => {
    const currentItens = form.getValues('itens') || []
    const newItens = [...currentItens]
    newItens[index] = item
    form.setValue('itens', newItens)
  }, [form])

  const removeItem = useCallback((index: number) => {
    const currentItens = form.getValues('itens') || []
    const newItens = currentItens.filter((_, i) => i !== index)
    form.setValue('itens', newItens)
  }, [form])

  // Cálculos
  const calculateItemTotal = useCallback((item: Partial<NfeItemFormData>): number => {
    const quantidade = item.quantidadeComercial || 0
    const valorUnitario = item.valorUnitario || 0
    const desconto = item.valorDesconto || 0
    const frete = item.valorFrete || 0
    const seguro = item.valorSeguro || 0
    const outros = item.valorOutros || 0
    
    return (quantidade * valorUnitario) - desconto + frete + seguro + outros
  }, [])

  const calculateTotals = useCallback(() => {
    const itens = form.getValues('itens') || []
    const valorFrete = form.getValues('valorFrete') || 0
    const valorSeguro = form.getValues('valorSeguro') || 0
    const valorDesconto = form.getValues('valorDesconto') || 0
    const valorOutros = form.getValues('valorOutros') || 0

    const valorProdutos = itens.reduce((sum, item) => {
      return sum + (item.quantidadeComercial * item.valorUnitario)
    }, 0)

    const valorICMS = itens.reduce((sum, item) => sum + (item.icms?.valor || 0), 0)
    const valorIPI = itens.reduce((sum, item) => sum + (item.ipi?.valor || 0), 0)
    const valorPIS = itens.reduce((sum, item) => sum + (item.pis?.valor || 0), 0)
    const valorCOFINS = itens.reduce((sum, item) => sum + (item.cofins?.valor || 0), 0)

    const valorTotalImpostos = valorICMS + valorIPI + valorPIS + valorCOFINS

    const valorTotal = valorProdutos + valorFrete + valorSeguro + valorOutros - valorDesconto

    return {
      valorProdutos,
      valorTotal,
      valorTotalImpostos,
      valorICMS,
      valorIPI,
      valorPIS,
      valorCOFINS,
    }
  }, [form])

  const calculateNfeTotal = useCallback((): number => {
    return calculateTotals().valorTotal
  }, [calculateTotals])

  const closeAlertDialog = useCallback(() => {
    setAlertDialog(prev => ({ ...prev, open: false, errors: [] }))
  }, [])

  return {
    form,
    loading,
    loadingNfe,
    loadingEmitente,
    emitente,
    nfe,
    handleSubmit: form.handleSubmit(
      handleSubmit,
      (errors) => {
        console.error('❌ Erros de validação do formulário:', errors)

        // Coletar mensagens de erro
        const errorMessages: string[] = []

        // Mostrar erros detalhados
        Object.keys(errors).forEach(key => {
          const error = (errors as any)[key]
          console.error(`Campo "${key}":`, error)

          // Se for array (como itens), mostrar cada item
          if (Array.isArray(error)) {
            error.forEach((itemError: any, index: number) => {
              if (itemError) {
                console.error(`  Item ${index}:`, itemError)
                // Extrair mensagens de erro do item
                Object.keys(itemError).forEach(field => {
                  const fieldError = itemError[field]
                  if (fieldError?.message) {
                    errorMessages.push(`Item ${index + 1} - ${field}: ${fieldError.message}`)
                  }
                })
              }
            })
          } else if (error?.message) {
            errorMessages.push(`${key}: ${error.message}`)
          }
        })

        // Mostrar erros no console e toast
        console.error('📋 Mensagens de erro:', errorMessages)

        if (errorMessages.length > 0) {
          toast.error(errorMessages[0], {
            description: errorMessages.length > 1 ? `E mais ${errorMessages.length - 1} erro(s)` : undefined
          })
        } else {
          toast.error('Há erros no formulário. Verifique os campos.')
        }
      }
    ),
    loadNfe,
    resetForm,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateNfeTotal,
    calculateTotals,
    alertDialog: {
      ...alertDialog,
      onClose: closeAlertDialog
    },
  }
}

