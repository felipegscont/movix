"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { ClienteService } from "@/lib/services/cliente.service"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import { useAuxiliar } from "@/hooks/shared/use-auxiliar"
import { useExternalApis } from "@/hooks/shared/use-external-apis"
import type { CnpjData, CepData } from "@/lib/services/external-api.service"

const clienteFormSchema = z.object({
  tipo: z.enum(["FISICA", "JURIDICA"]).default("JURIDICA"),
  documento: z.string()
    .min(11, "Documento deve ter pelo menos 11 caracteres")
    .max(14, "Documento deve ter no máximo 14 caracteres")
    .refine((val) => /^\d+$/.test(val.replace(/\D/g, '')), "Documento deve conter apenas números"),
  nome: z.string().min(1, "Nome é obrigatório"),
  nomeFantasia: z.string().optional().or(z.literal("")),
  inscricaoEstadual: z.string().optional().or(z.literal("")),
  inscricaoMunicipal: z.string().optional().or(z.literal("")),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z.string()
    .min(8, "CEP deve ter 8 caracteres")
    .refine((val) => /^\d{8}$/.test(val.replace(/\D/g, '')), "CEP deve conter apenas números"),
  municipioId: z.string().min(1, "Município é obrigatório"),
  estadoId: z.string().min(1, "Estado é obrigatório"),
  telefone: z.string().optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  indicadorIE: z.number().optional(),
  ativo: z.boolean().default(true),
})

export type ClienteFormValues = z.infer<typeof clienteFormSchema>

// Funções de máscara
const formatCnpj = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    // Máscara CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else {
    // Máscara CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
}

const formatCep = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  // Máscara CEP: 00000-000
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else {
    // Celular: (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
}

interface UseClienteFormProps {
  clienteId?: string
  onSuccess?: () => void
}

interface UseClienteFormReturn {
  // Form
  form: any

  // Loading states
  loading: boolean
  loadingCnpj: boolean
  loadingCep: boolean
  loadingEstados: boolean
  loadingMunicipios: boolean

  // Actions
  handleSubmit: (data: any) => Promise<boolean>
  handleDocumentoChange: (value: string) => Promise<void>
  handleCepSearch: () => Promise<void>
  loadCliente: () => Promise<void>
  resetForm: () => void
  loadMunicipios: (estadoId: string) => Promise<void>

  // External data
  estados: any[]
  municipios: any[]

  // Mask functions
  formatCnpj: (value: string) => string
  formatCep: (value: string) => string
  formatPhone: (value: string) => string

  // Alert dialog
  alertDialog: {
    open: boolean
    title: string
    description: string
    onClose: () => void
  }
}

export function useClienteForm({ clienteId, onSuccess }: UseClienteFormProps): UseClienteFormReturn {
  const [loading, setLoading] = useState(false)
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: "",
    description: ""
  })

  // Use shared hooks
  const {
    estados,
    municipios,
    loadingEstados,
    loadingMunicipios,
    loadMunicipios,
    clearMunicipios
  } = useAuxiliar()

  const {
    loadingCnpj,
    loadingCep,
    consultarCnpj,
    consultarCep
  } = useExternalApis()

  const form = useForm({
    resolver: zodResolver(clienteFormSchema),
    mode: "onBlur",
    defaultValues: {
      tipo: "JURIDICA",
      documento: "",
      nome: "",
      nomeFantasia: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      municipioId: "",
      estadoId: "",
      telefone: "",
      celular: "",
      email: "",
      indicadorIE: 9,
      ativo: true,
    },
  })

  const watchEstadoId = form.watch("estadoId")

  // Load municipalities when state changes
  useEffect(() => {
    if (watchEstadoId) {
      loadMunicipios(watchEstadoId)
      form.setValue("municipioId", "")
    } else {
      clearMunicipios()
    }
  }, [watchEstadoId, form, loadMunicipios, clearMunicipios])



  const loadCliente = useCallback(async () => {
    if (!clienteId) return

    try {
      setLoading(true)
      const cliente = await ClienteService.getById(clienteId)
      
      // Reset form with cliente data
      form.reset({
        tipo: cliente.tipo,
        documento: cliente.documento,
        nome: cliente.nome,
        nomeFantasia: cliente.nomeFantasia || "",
        inscricaoEstadual: cliente.inscricaoEstadual || "",
        inscricaoMunicipal: cliente.inscricaoMunicipal || "",
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        complemento: cliente.complemento || "",
        bairro: cliente.bairro,
        cep: cliente.cep,
        municipioId: cliente.municipioId,
        estadoId: cliente.municipio?.estado?.id || "",
        telefone: cliente.telefone || "",
        celular: cliente.celular || "",
        email: cliente.email || "",
        indicadorIE: cliente.indicadorIE || 9,
        ativo: cliente.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      toast.error("Erro ao carregar cliente")
    } finally {
      setLoading(false)
    }
  }, [clienteId, form])

  const handleCnpjDataLoaded = useCallback(async (cnpjData: CnpjData) => {
    // Preenche dados básicos
    form.setValue("nome", cnpjData.razaoSocial)
    if (cnpjData.nomeFantasia) {
      form.setValue("nomeFantasia", cnpjData.nomeFantasia)
    }
    if (cnpjData.logradouro) {
      form.setValue("logradouro", cnpjData.logradouro)
    }
    if (cnpjData.numero) {
      form.setValue("numero", cnpjData.numero)
    }
    if (cnpjData.complemento) {
      form.setValue("complemento", cnpjData.complemento)
    }
    if (cnpjData.bairro) {
      form.setValue("bairro", cnpjData.bairro)
    }
    if (cnpjData.cep) {
      form.setValue("cep", cnpjData.cep)
    }
    if (cnpjData.email) {
      form.setValue("email", cnpjData.email)
    }
    if (cnpjData.telefone) {
      form.setValue("telefone", cnpjData.telefone)
    }

    // Busca e seleciona estado pela UF
    if (cnpjData.uf) {
      try {
        // Se estados ainda não foram carregados, carrega agora
        let estadosDisponiveis = estados
        if (estadosDisponiveis.length === 0) {
          estadosDisponiveis = await AuxiliarService.getEstados()
        }

        const estado = estadosDisponiveis.find(e => e.uf === cnpjData.uf)
        if (estado) {
          form.setValue("estadoId", estado.id)

          // Se tem município, carrega municípios e seleciona
          if (cnpjData.municipio) {
            // Aguarda um pouco para garantir que o estado foi setado
            await new Promise(resolve => setTimeout(resolve, 100))

            // Carrega municípios do estado (backend popula automaticamente se não existir)
            await loadMunicipios(estado.id)

            // Aguarda mais um pouco para garantir que os municípios foram carregados
            await new Promise(resolve => setTimeout(resolve, 200))

            // Busca novamente os municípios para garantir que temos os dados atualizados
            const municipiosData = await AuxiliarService.getMunicipiosByEstado(estado.id)

            // Tenta encontrar o município por nome (busca flexível)
            const municipio = municipiosData.find(m => {
              const nomeMunicipio = m.nome.toLowerCase().trim()
              const nomeCnpj = cnpjData.municipio?.toLowerCase().trim() || ''

              return nomeMunicipio === nomeCnpj ||
                     nomeMunicipio.includes(nomeCnpj) ||
                     nomeCnpj.includes(nomeMunicipio)
            })

            if (municipio) {
              form.setValue("municipioId", municipio.id)
              toast.success(`Município ${municipio.nome} selecionado automaticamente`)
            } else {
              toast.warning(`Município "${cnpjData.municipio}" não encontrado. Selecione manualmente.`)
            }
          }
        } else {
          toast.warning(`Estado ${cnpjData.uf} não encontrado`)
        }
      } catch (error) {
        console.error('Erro ao carregar estado/município para CNPJ:', error)
        toast.error('Erro ao carregar dados de localização')
      }
    }
  }, [form, estados, loadMunicipios])

  const handleCepDataLoaded = useCallback(async (cepData: CepData) => {
    form.setValue("logradouro", cepData.logradouro)
    form.setValue("bairro", cepData.bairro)

    // Busca e seleciona estado pela UF
    if (cepData.uf && estados.length > 0) {
      const estado = estados.find(e => e.uf === cepData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)

        // Se tem localidade, carrega municípios e seleciona
        if (cepData.localidade) {
          try {
            await loadMunicipios(estado.id)
            const municipiosData = await AuxiliarService.getMunicipiosByEstado(estado.id)
            const municipio = municipiosData.find(m =>
              m.nome.toLowerCase().includes(cepData.localidade?.toLowerCase() || '') ||
              cepData.localidade?.toLowerCase().includes(m.nome.toLowerCase() || '')
            )
            if (municipio) {
              form.setValue("municipioId", municipio.id)
            }
          } catch (error) {
            console.warn('Erro ao carregar municípios para CEP:', error)
          }
        }
      }
    }
  }, [form, estados, loadMunicipios])

  const handleDocumentoChange = useCallback(async (value: string) => {
    const numbers = value.replace(/\D/g, '')

    // Auto-detect type based on document length
    if (numbers.length === 11) {
      // Exatamente 11 dígitos = CPF
      form.setValue('tipo', 'FISICA')
    } else if (numbers.length === 14) {
      // Exatamente 14 dígitos = CNPJ
      form.setValue('tipo', 'JURIDICA')

      // Auto-query CNPJ when exactly 14 digits
      if (!loadingCnpj) {
        const cnpjData = await consultarCnpj(numbers)
        if (cnpjData) {
          await handleCnpjDataLoaded(cnpjData)
        }
      }
    }
    // Para outros tamanhos, mantém o tipo atual (padrão JURIDICA)
  }, [form, loadingCnpj, consultarCnpj, handleCnpjDataLoaded])

  const handleCepSearch = useCallback(async () => {
    const cep = form.getValues("cep")?.replace(/\D/g, '')

    if (!cep || cep.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos")
      return
    }

    const cepData = await consultarCep(cep)
    if (cepData) {
      await handleCepDataLoaded(cepData)
    }
  }, [form, consultarCep, handleCepDataLoaded])

  const handleSubmit = useCallback(async (data: ClienteFormValues): Promise<boolean> => {
    try {
      setLoading(true)

      // Limpa e valida os dados antes de enviar
      const cleanedData = {
        ...data,
        // Remove caracteres não numéricos do documento
        documento: data.documento?.replace(/\D/g, '') || '',
        // Converte strings vazias para undefined para campos opcionais
        nomeFantasia: data.nomeFantasia?.trim() || undefined,
        inscricaoEstadual: data.inscricaoEstadual?.trim() || undefined,
        inscricaoMunicipal: data.inscricaoMunicipal?.trim() || undefined,
        complemento: data.complemento?.trim() || undefined,
        telefone: data.telefone?.trim() || undefined,
        celular: data.celular?.trim() || undefined,
        email: data.email?.trim() || undefined,
        // Remove caracteres não numéricos do CEP
        cep: data.cep?.replace(/\D/g, '') || '',
      }

      if (clienteId) {
        await ClienteService.update(clienteId, cleanedData)
        toast.success("Cliente atualizado com sucesso!")
      } else {
        await ClienteService.create(cleanedData)
        toast.success("Cliente criado com sucesso!")
      }

      onSuccess?.()
      return true // Sucesso
    } catch (error: any) {
      // Trata erros específicos com alert dialog
      const errorMessage = error.message || "Erro desconhecido"

      if (errorMessage.includes("Documento já cadastrado")) {
        setAlertDialog({
          open: true,
          title: "Documento Duplicado",
          description: `O ${data.tipo === 'FISICA' ? 'CPF' : 'CNPJ'} informado já está cadastrado no sistema. Verifique o documento ou consulte se o cliente já existe.`
        })
      } else if (errorMessage.includes("Email já cadastrado")) {
        setAlertDialog({
          open: true,
          title: "Email Duplicado",
          description: "O email informado já está cadastrado no sistema. Verifique o email ou use outro endereço."
        })
      } else {
        setAlertDialog({
          open: true,
          title: "Erro ao Salvar Cliente",
          description: `Ocorreu um erro ao salvar o cliente: ${errorMessage}`
        })
      }
      return false // Falha
    } finally {
      setLoading(false)
    }
  }, [clienteId, onSuccess])

  const resetForm = useCallback(() => {
    form.reset()
  }, [form])

  const closeAlertDialog = useCallback(() => {
    setAlertDialog(prev => ({ ...prev, open: false }))
  }, [])

  return {
    form,
    loading,
    loadingCnpj,
    loadingCep,
    loadingEstados,
    loadingMunicipios,
    handleSubmit,
    handleDocumentoChange,
    handleCepSearch,
    loadCliente,
    resetForm,
    loadMunicipios,
    estados,
    municipios,
    // Funções de máscara
    formatCnpj,
    formatCep,
    formatPhone,
    // Alert dialog
    alertDialog: {
      ...alertDialog,
      onClose: closeAlertDialog
    },
  }
}
