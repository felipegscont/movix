"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ClienteService, Cliente } from "@/lib/services/cliente.service"
import { IconLoader2, IconMapPin, IconMail, IconPhone, IconBuilding } from "@tabler/icons-react"
import { formatCPFCNPJ } from "@/lib/utils/format"

interface ClienteInfoDisplayProps {
  clienteId: string | undefined
  className?: string
}

const INDICADOR_IE_MAP: Record<number, string> = {
  1: "Contribuinte do ICMS",
  2: "Isento de Inscrição",
  9: "Não Contribuinte",
}

export function ClienteInfoDisplay({ clienteId, className }: ClienteInfoDisplayProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (clienteId) {
      loadCliente(clienteId)
    } else {
      setCliente(null)
    }
  }, [clienteId])

  const loadCliente = async (id: string) => {
    try {
      setLoading(true)
      const data = await ClienteService.getById(id)
      setCliente(data)
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!clienteId) {
    return null
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!cliente) {
    return null
  }

  const enderecoCompleto = `${cliente.cep ? cliente.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2') : ''} (${cliente.municipio?.nome}/${cliente.estado?.uf})\n\n${cliente.logradouro}, ${cliente.numero}${cliente.complemento ? ', ' + cliente.complemento : ''} - ${cliente.bairro}`

  return (
    <Card className={className}>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <IconBuilding className="h-4 w-4" />
          {cliente.nome}
          {cliente.nomeFantasia && (
            <span className="text-xs text-muted-foreground font-normal">
              ({cliente.nomeFantasia})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {/* Linha 1: CPF/CNPJ e IE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {cliente.tipo === 'FISICA' ? 'CPF' : 'CNPJ'}
            </label>
            <div className="text-sm font-medium">
              {formatCPFCNPJ(cliente.documento)}
            </div>
          </div>

          {cliente.inscricaoEstadual && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">IE</label>
              <div className="text-sm font-medium">
                {cliente.inscricaoEstadual}
              </div>
            </div>
          )}
        </div>

        {/* Linha 2: Indicador IE */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Indicador da IE do Destinatário
          </label>
          <div>
            <Badge variant="outline" className="text-xs">
              {INDICADOR_IE_MAP[cliente.indicadorIE] || "Não informado"}
            </Badge>
          </div>
        </div>

        {/* Linha 3: Email e Telefone */}
        {(cliente.email || cliente.telefone || cliente.celular) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cliente.email && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconMail className="h-3 w-3" />
                    E-mail
                  </label>
                  <div className="text-sm">{cliente.email}</div>
                </div>
              )}

              {(cliente.telefone || cliente.celular) && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconPhone className="h-3 w-3" />
                    Telefone
                  </label>
                  <div className="text-sm">
                    {cliente.celular || cliente.telefone}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Linha 4: Endereço para faturamento */}
        <Separator />
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <IconMapPin className="h-3 w-3" />
            Endereço para faturamento
          </label>
          <div className="text-sm whitespace-pre-line bg-muted/30 p-2 rounded-md border">
            {enderecoCompleto}
          </div>
        </div>

        {/* TODO: Adicionar Crédito disponível quando implementado no backend */}
        {/* <Separator />
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Crédito disponível
          </label>
          <div className="text-lg font-bold text-green-600">
            R$ 98.472,30
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}

