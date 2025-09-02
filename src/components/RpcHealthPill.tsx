import React from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface RpcHealthPillProps {
  status: 'ok' | 'warn' | 'fail'
  chainName: string
}

export const RpcHealthPill: React.FC<RpcHealthPillProps> = ({ status, chainName }) => {
  const getIcon = () => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-3 w-3" />
      case 'warn':
        return <AlertCircle className="h-3 w-3" />
      case 'fail':
        return <XCircle className="h-3 w-3" />
    }
  }

  const getVariant = () => {
    switch (status) {
      case 'ok':
        return 'default'
      case 'warn':
        return 'secondary'
      case 'fail':
        return 'destructive'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'ok':
        return `${chainName} RPC Healthy`
      case 'warn':
        return `${chainName} RPC Slow`
      case 'fail':
        return `${chainName} RPC Failed`
    }
  }

  return (
    <Badge variant={getVariant()} className="flex items-center space-x-1">
      {getIcon()}
      <span className="text-xs">{getLabel()}</span>
    </Badge>
  )
}