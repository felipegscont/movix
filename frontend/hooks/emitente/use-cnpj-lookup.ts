import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { ExternalApiService } from "@/lib/services/external-api.service"
import { AuxiliarService, type Estado } from "@/lib/services/auxiliar.service"
import type { EmitenteFormData } from "../types"

export function useCnpjLookup(
  form: UseFormReturn<EmitenteFormData>,
  estados: Estado[],
  loadMunicipios: (estadoId: string) => Promise<void>
) {
  const [loading, setLoading] = useState(false)

  const consultarCnpj = async (cnpj: string) => {
    if (cnpj.length !== 14) {
      toast.error("CNPJ deve ter 14 dígitos")
      return
    }

    try {
      setLoading(true)
      const data = await ExternalApiService.consultarCnpj(cnpj)

      // Preencher formulário com dados da consulta
      form.setValue("razaoSocial", data.razaoSocial || "")
      form.setValue("nomeFantasia", data.nomeFantasia || "")
      form.setValue("cnae", data.cnae || "")

      // Inscrição Estadual - pegar a primeira ativa
      if (data.inscricoesEstaduais && data.inscricoesEstaduais.length > 0) {
        const inscricaoAtiva = data.inscricoesEstaduais.find(ie => ie.ativo) || data.inscricoesEstaduais[0]
        form.setValue("inscricaoEstadual", inscricaoAtiva.numero || "")
      }

      // Endereço
      form.setValue("logradouro", data.logradouro || "")
      form.setValue("numero", data.numero || "")
      form.setValue("complemento", data.complemento || "")
      form.setValue("bairro", data.bairro || "")
      form.setValue("cep", data.cep?.replace(/\D/g, "") || "")

      // Estado e Município
      if (data.uf) {
        const estado = estados.find(e => e.uf === data.uf)
        if (estado) {
          form.setValue("estadoId", estado.id)

          // Se tem município, carrega municípios e seleciona
          if (data.municipio) {
            try {
              // Aguarda um pouco para garantir que o estado foi setado
              await new Promise(resolve => setTimeout(resolve, 100))

              // Carrega municípios do estado (backend popula automaticamente se não existir)
              await loadMunicipios(estado.id)

              // Aguarda mais um pouco para garantir que os municípios foram carregados
              await new Promise(resolve => setTimeout(resolve, 200))

              // Busca novamente os municípios para garantir que temos os dados atualizados
              const municipiosData = await AuxiliarService.getMunicipios(estado.id)

              // Tenta encontrar o município por nome (busca flexível)
              const municipio = municipiosData.find(m => {
                const nomeMunicipio = m.nome.toLowerCase().trim()
                const nomeCnpj = data.municipio?.toLowerCase().trim() || ''

                return nomeMunicipio === nomeCnpj ||
                       nomeMunicipio.includes(nomeCnpj) ||
                       nomeCnpj.includes(nomeMunicipio)
              })

              if (municipio) {
                form.setValue("municipioId", municipio.id)
                toast.success(`Município ${municipio.nome} selecionado automaticamente`)
              } else {
                toast.warning(`Município "${data.municipio}" não encontrado. Selecione manualmente.`)
              }
            } catch (error) {
              console.error('Erro ao carregar município:', error)
              toast.error('Erro ao carregar dados de localização')
            }
          }
        }
      }

      // Contato
      form.setValue("telefone", data.telefone || "")
      form.setValue("email", data.email || "")

      toast.success("Dados do CNPJ carregados com sucesso!")
    } catch (error: any) {
      console.error("Erro ao consultar CNPJ:", error)
      toast.error(error.message || "Erro ao consultar CNPJ")
    } finally {
      setLoading(false)
    }
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 14)
  }

  return {
    loading,
    consultarCnpj,
    formatCNPJ,
  }
}

