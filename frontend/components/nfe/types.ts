export type NfeStatus = 'DIGITACAO' | 'VALIDADA' | 'TRANSMITIDA' | 'AUTORIZADA' | 'CANCELADA' | 'REJEITADA'

export interface NfeStatusInfo {
  status: NfeStatus
  canEdit: boolean
  canTransmit: boolean
  canCancel: boolean
  canPrint: boolean
  nextActions: string[]
  statusColor: 'default' | 'secondary' | 'warning' | 'success' | 'destructive'
}

