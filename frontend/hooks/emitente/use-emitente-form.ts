import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { EmitenteService } from "@/lib/services/emitente.service"
import { AuxiliarService, type Estado, type Municipio } from "@/lib/services/auxiliar.service"
import { emitenteSchema, type EmitenteFormData } from "@/lib/schemas/emitente.schema"

export function useEmitenteForm() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [emitenteId, setEmitenteId] = useState<string | null>(null)
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)
  const [certificadoInfo, setCertificadoInfo] = useState<any>(null)

  const form = useForm<EmitenteFormData>({
    resolver: zodResolver(emitenteSchema),
    defaultValues: {
      cnpj: "",
      razaoSocial: "",
      nomeFantasia: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      cnae: "",
      regimeTributario: 1,
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      municipioId: "",
      estadoId: "",
      telefone: "",
      email: "",
      site: "",
      ambienteNfe: 2,
      serieNfe: 1,
      proximoNumeroNfe: 1,
      ativo: true,
    },
  })

  const watchEstadoId = form.watch("estadoId")

  // Carregar estados
  const loadEstados = async () => {
    try {
      setLoadingEstados(true)
      const data = await AuxiliarService.getEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
      toast.error("Erro ao carregar estados")
    } finally {
      setLoadingEstados(false)
    }
  }

  // Carregar municípios
  const loadMunicipios = async (estadoId: string) => {
    try {
      setLoadingMunicipios(true)
      const data = await AuxiliarService.getMunicipios(estadoId)
      setMunicipios(data)
    } catch (error) {
      console.error("Erro ao carregar municípios:", error)
      toast.error("Erro ao carregar municípios")
    } finally {
      setLoadingMunicipios(false)
    }
  }

  // Carregar dados iniciais
  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      
      await loadEstados()

      const emitente = await EmitenteService.getEmitenteAtivo()

      if (emitente) {
        setEmitenteId(emitente.id)

        if (emitente.estadoId) {
          await loadMunicipios(emitente.estadoId)
        }

        // Carregar informações do certificado se existir
        try {
          const certInfo = await EmitenteService.getCertificadoAtivo(emitente.id)
          console.log('Certificado recebido do backend:', certInfo)
          if (certInfo) {
            setCertificadoInfo(certInfo)
          }
        } catch (error) {
          console.log("Nenhum certificado encontrado para este emitente")
        }

        form.reset({
          cnpj: emitente.cnpj,
          razaoSocial: emitente.razaoSocial,
          nomeFantasia: emitente.nomeFantasia || "",
          inscricaoEstadual: emitente.inscricaoEstadual || "",
          inscricaoMunicipal: emitente.inscricaoMunicipal || "",
          cnae: emitente.cnae || "",
          regimeTributario: emitente.regimeTributario,
          logradouro: emitente.logradouro,
          numero: emitente.numero,
          complemento: emitente.complemento || "",
          bairro: emitente.bairro,
          cep: emitente.cep,
          municipioId: emitente.municipioId,
          estadoId: emitente.estadoId,
          telefone: emitente.telefone || "",
          email: emitente.email || "",
          site: emitente.site || "",
          ambienteNfe: emitente.ambienteNfe,
          serieNfe: emitente.serieNfe,
          proximoNumeroNfe: emitente.proximoNumeroNfe,
          ativo: emitente.ativo,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados iniciais")
    } finally {
      setLoadingData(false)
    }
  }

  // Carregar municípios quando estado mudar
  useEffect(() => {
    if (watchEstadoId) {
      loadMunicipios(watchEstadoId)
    }
  }, [watchEstadoId])

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  return {
    form,
    loading,
    setLoading,
    loadingData,
    emitenteId,
    setEmitenteId,
    estados,
    municipios,
    loadingEstados,
    loadingMunicipios,
    loadMunicipios,
    certificadoInfo,
  }
}

