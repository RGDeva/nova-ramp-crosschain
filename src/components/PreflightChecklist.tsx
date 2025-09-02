import React from 'react'
import { CheckCircle, AlertCircle, Clock, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/PrivyProvider'
import { useAccount, useBalance } from 'wagmi'
import { base } from 'wagmi/chains'

interface PreflightChecklistProps {
  onConnectWallet: () => void
  onConnectPrivy: () => void
}

interface CheckItemProps {
  status: 'ok' | 'warn' | 'fail'
  label: string
  onClick?: () => void
  clickable?: boolean
}

const CheckItem: React.FC<CheckItemProps> = ({ status, label, onClick, clickable = false }) => {
  const getIcon = () => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-nova-success" />
      case 'warn':
        return <Clock className="h-4 w-4 text-nova-warning" />
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-nova-error" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'ok':
        return 'text-nova-success'
      case 'warn':
        return 'text-nova-warning'
      case 'fail':
        return 'text-nova-error'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center space-x-2 px-2 py-1 h-auto ${
        clickable ? 'hover:bg-nova-elevated cursor-pointer' : 'cursor-default'
      }`}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
    >
      {getIcon()}
      <span className={`text-sm ${getStatusColor()}`}>{label}</span>
    </Button>
  )
}

export const PreflightChecklist: React.FC<PreflightChecklistProps> = ({
  onConnectWallet,
  onConnectPrivy,
}) => {
  const { isAuthenticated } = useAuth()
  const { isConnected, address } = useAccount()
  const { data: balance } = useBalance({
    address,
    chainId: base.id,
  })

  // Mock RPC health check - in real app would ping the RPC
  const rpcHealthy = true

  // Check if user has enough ETH for gas (rough estimate)
  const hasEnoughGas = balance ? parseFloat(balance.formatted) > 0.001 : false

  const walletStatus = isConnected ? 'ok' : 'fail'
  const privyStatus = isAuthenticated ? 'ok' : 'fail'
  const rpcStatus = rpcHealthy ? 'ok' : 'fail'
  const gasStatus = isConnected ? (hasEnoughGas ? 'ok' : 'warn') : 'fail'

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Pre-flight Check</h3>
          <div className="flex items-center space-x-1">
            <CheckItem
              status={walletStatus}
              label="Wallet"
              onClick={onConnectWallet}
              clickable={!isConnected}
            />
            <span className="text-muted-foreground">•</span>
            <CheckItem
              status={privyStatus}
              label="PeerAuth"
              onClick={onConnectPrivy}
              clickable={!isAuthenticated}
            />
            <span className="text-muted-foreground">•</span>
            <CheckItem
              status={rpcStatus}
              label="RPC"
            />
            <span className="text-muted-foreground">•</span>
            <CheckItem
              status={gasStatus}
              label="Gas"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}