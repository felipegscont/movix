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
  tipo: z.enum(["FISICA", "JURIDICA"]).default("FISICA"),
  documento: z.string().min(11, "Documento deve ter pelo menos 11 caracteres"),
  nome: z.string().min(1, "Nome é obrigatório"),
  nomeFantasia: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP deve ter 8 caracteres"),
  municipioId: z.string().min(1, "Município é obrigatório"),
  estadoId: z.string().min(1, "Estado é obrigatório"),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  indicadorIE: z.number().optional(),
  ativo: z.boolean().default(true),
})

export type ClienteFormValues = z.infer<typeof clienteFormSchema>

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
  handleSubmit: (data: any) => Promise<void>
  handleDocumentoChange: (value: string) => Promise<void>
  handleCepSearch: () => Promise<void>
  loadCliente: () => Promise<void>
  resetForm: () => void
  loadMunicipios: (estadoId: string) => Promise<void>

  // External data
  estados: any[]
  municipios: any[]
}

export function useClienteForm({ clienteId, onSuccess }: UseClienteFormProps): UseClienteFormReturn {
  const [loading, setLoading] = useState(false)

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
      tipo: "FISICA",
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
    if (cnpjData.uf && estados.length > 0) {
      const estado = estados.find(e => e.uf === cnpjData.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)

        // Se tem município, carrega municípios e seleciona
        if (cnpjData.municipio) {
          try {
            await loadMunicipios(estado.id)
            const municipiosData = await AuxiliarService.getMunicipiosByEstado(estado.id)
            const municipio = municipiosData.find(m =>
              m.nome.toLowerCase().includes(cnpjData.municipio?.toLowerCase() || '') ||
              cnpjData.municipio?.toLowerCase().includes(m.nome.toLowerCase() || '')
            )
            if (municipio) {
              form.setValue("municipioId", municipio.id)
            }
          } catch (error) {
            console.warn('Erro ao carregar municípios para CNPJ:', error)
          }
        }
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

    // Auto-detect type based on document
    if (numbers.length <= 11) {
      form.setValue('tipo', 'FISICA')
    } else if (numbers.length <= 14) {
      form.setValue('tipo', 'JURIDICA')

      // Auto-query CNPJ when exactly 14 digits
      if (numbers.length === 14 && !loadingCnpj) {
        const cnpjData = await consultarCnpj(numbers)
        if (cnpjData) {
          await handleCnpjDataLoaded(cnpjData)
        }
      }
    }
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

  const handleSubmit = useCallback(async (data: ClienteFormValues) => {
    try {
      setLoading(true)
      
      if (clienteId) {
        await ClienteService.update(clienteId, data)
        toast.success("Cliente atualizado com sucesso!")
      } else {
        await ClienteService.create(data)
        toast.success("Cliente criado com sucesso!")
      }
      
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      toast.error("Erro ao salvar cliente")
    } finally {
      setLoading(false)
    }
  }, [clienteId, onSuccess])

  const resetForm = useCallback(() => {
    form.reset()
  }, [form])

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
  }
}
