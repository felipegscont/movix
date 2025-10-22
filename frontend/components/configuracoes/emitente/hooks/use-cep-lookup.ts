import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { ExternalApiService } from "@/lib/services/external-api.service"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import type { EmitenteFormData, Estado } from "../types"

export function useCepLookup(
  form: UseFormReturn<EmitenteFormData>,
  estados: Estado[],
  loadMunicipios: (estadoId: string) => Promise<void>
) {
  const [loading, setLoading] = useState(false)

  const consultarCep = async (cep: string) => {
    if (cep.length !== 8) {
      toast.error("CEP deve ter 8 dígitos")
      return
    }

    try {
      setLoading(true)
      const data = await ExternalApiService.consultarCep(cep)

      // Preencher endereço
      form.setValue("logradouro", data.logradouro || "")
      form.setValue("bairro", data.bairro || "")
      form.setValue("complemento", data.complemento || "")

      // Buscar estado pelo UF
      const estado = estados.find(e => e.uf === data.uf)
      if (estado) {
        form.setValue("estadoId", estado.id)

        // Se tem localidade, carrega municípios e seleciona
        if (data.localidade) {
          try {
            // Carregar municípios do estado
            await loadMunicipios(estado.id)

            // Buscar municípios atualizados
            const municipiosData = await AuxiliarService.getMunicipios(estado.id)

            // Encontrar município por nome
            const municipio = municipiosData.find(m =>
              m.nome.toLowerCase().includes(data.localidade?.toLowerCase() || '') ||
              data.localidade?.toLowerCase().includes(m.nome.toLowerCase() || '')
            )

            if (municipio) {
              form.setValue("municipioId", municipio.id)
              toast.success(`Município ${municipio.nome} selecionado automaticamente`)
            } else {
              toast.warning(`Município "${data.localidade}" não encontrado. Selecione manualmente.`)
            }
          } catch (error) {
            console.error('Erro ao carregar municípios para CEP:', error)
            toast.error('Erro ao carregar dados de localização')
          }
        }
      }

      toast.success("CEP consultado com sucesso!")
    } catch (error: any) {
      console.error("Erro ao consultar CEP:", error)
      toast.error(error.message || "Erro ao consultar CEP")
    } finally {
      setLoading(false)
    }
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 8)
  }

  return {
    loading,
    consultarCep,
    formatCEP,
  }
}

