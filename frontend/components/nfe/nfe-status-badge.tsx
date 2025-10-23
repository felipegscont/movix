"use client"

import { Badge } from "@/components/ui/badge"
import { 
  IconEdit, 
  IconSend, 
  IconCheck, 
  IconX, 
  IconAlertTriangle,
  IconClock
} from "@tabler/icons-react"
import { NfeStatus, NfeStatusInfo } from "./types"

interface NfeStatusBadgeProps {
  status: NfeStatus
  className?: string
}

export function NfeStatusBadge({ status, className }: NfeStatusBadgeProps) {
  const getStatusInfo = (status: NfeStatus): NfeStatusInfo => {
    switch (status) {
      case 'DIGITACAO':
        return {
          status,
          canEdit: true,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Adicionar itens', 'Transmitir'],
          statusColor: 'secondary'
        }
      
      case 'VALIDADA':
        return {
          status,
          canEdit: true,
          canTransmit: true,
          canCancel: false,
          canPrint: false,
          nextActions: ['Transmitir', 'Editar'],
          statusColor: 'warning'
        }
      
      case 'TRANSMITIDA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Aguardar retorno da SEFAZ'],
          statusColor: 'warning'
        }
      
      case 'AUTORIZADA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: true,
          canPrint: true,
          nextActions: ['Imprimir DANFE', 'Cancelar se necessário'],
          statusColor: 'success'
        }
      
      case 'CANCELADA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: true,
          nextActions: ['Imprimir comprovante de cancelamento'],
          statusColor: 'destructive'
        }
      
      case 'REJEITADA':
        return {
          status,
          canEdit: true,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Corrigir erros', 'Transmitir novamente'],
          statusColor: 'destructive'
        }
      
      default:
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: [],
          statusColor: 'default'
        }
    }
  }

  const statusInfo = getStatusInfo(status)

  const getStatusIcon = () => {
    switch (status) {
      case 'DIGITACAO':
        return <IconEdit className="h-3 w-3" />
      case 'VALIDADA':
        return <IconClock className="h-3 w-3" />
      case 'TRANSMITIDA':
        return <IconSend className="h-3 w-3" />
      case 'AUTORIZADA':
        return <IconCheck className="h-3 w-3" />
      case 'CANCELADA':
        return <IconX className="h-3 w-3" />
      case 'REJEITADA':
        return <IconAlertTriangle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'DIGITACAO':
        return 'Em Digitação'
      case 'VALIDADA':
        return 'Validada'
      case 'TRANSMITIDA':
        return 'Transmitida'
      case 'AUTORIZADA':
        return 'Autorizada'
      case 'CANCELADA':
        return 'Cancelada'
      case 'REJEITADA':
        return 'Rejeitada'
      default:
        return status
    }
  }

  const getVariant = () => {
    switch (statusInfo.statusColor) {
      case 'success':
        return 'default' // Verde
      case 'warning':
        return 'secondary' // Amarelo
      case 'destructive':
        return 'destructive' // Vermelho
      case 'secondary':
        return 'outline' // Cinza
      default:
        return 'default'
    }
  }

  return (
    <Badge 
      variant={getVariant()} 
      className={className}
    >
      {getStatusIcon()}
      <span className="ml-1">{getStatusLabel()}</span>
    </Badge>
  )
}

// Hook para usar informações de status
export function useNfeStatus(status: NfeStatus) {
  const getStatusInfo = (status: NfeStatus): NfeStatusInfo => {
    switch (status) {
      case 'DIGITACAO':
        return {
          status,
          canEdit: true,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Adicionar itens', 'Transmitir'],
          statusColor: 'secondary'
        }
      
      case 'VALIDADA':
        return {
          status,
          canEdit: true,
          canTransmit: true,
          canCancel: false,
          canPrint: false,
          nextActions: ['Transmitir', 'Editar'],
          statusColor: 'warning'
        }
      
      case 'TRANSMITIDA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Aguardar retorno da SEFAZ'],
          statusColor: 'warning'
        }
      
      case 'AUTORIZADA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: true,
          canPrint: true,
          nextActions: ['Imprimir DANFE', 'Cancelar se necessário'],
          statusColor: 'success'
        }
      
      case 'CANCELADA':
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: true,
          nextActions: ['Imprimir comprovante de cancelamento'],
          statusColor: 'destructive'
        }
      
      case 'REJEITADA':
        return {
          status,
          canEdit: true,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: ['Corrigir erros', 'Transmitir novamente'],
          statusColor: 'destructive'
        }
      
      default:
        return {
          status,
          canEdit: false,
          canTransmit: false,
          canCancel: false,
          canPrint: false,
          nextActions: [],
          statusColor: 'default'
        }
    }
  }

  return getStatusInfo(status)
}
