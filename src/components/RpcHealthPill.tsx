import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Zap, ZapOff, Clock } from 'lucide-react'
import { useChainId, usePublicClient } from 'wagmi'

interface RpcHealthPillProps {
  className?: string
}

export const RpcHealthPill: React.FC<RpcHealthPillProps> = ({ className = '' }) => {
  const [rpcStatus, setRpcStatus] = useState<'healthy' | 'slow' | 'down'>('healthy')
  const [latency, setLatency] = useState<number>(0)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  
  const chainId = useChainId()
  const publicClient = usePublicClient()

  useEffect(() => {
    const checkRpcHealth = async () => {
      if (!publicClient) {
        setRpcStatus('down')
        return
      }

      try {
        const startTime = Date.now()
        await publicClient.getBlockNumber()
        const endTime = Date.now()
        const responseTime = endTime - startTime

        setLatency(responseTime)
        setLastChecked(new Date())

        if (responseTime < 500) {
          setRpcStatus('healthy')
        } else if (responseTime < 2000) {
          setRpcStatus('slow')
        } else {
          setRpcStatus('down')
        }
      } catch (error) {
        console.error('RPC health check failed:', error)
        setRpcStatus('down')
        setLatency(0)
      }
    }

    // Initial check
    checkRpcHealth()

    // Check every 30 seconds
    const interval = setInterval(checkRpcHealth, 30000)

    return () => clearInterval(interval)
  }, [publicClient])

  const getStatusConfig = () => {
    switch (rpcStatus) {
      case 'healthy':
        return {
          icon: <Zap className="h-3 w-3" />,
          label: 'RPC Healthy',
          className: 'bg-nova-success/20 text-nova-success border-nova-success/30',
          tooltip: `RPC responding normally (${latency}ms)`
        }
      case 'slow':
        return {
          icon: <Clock className="h-3 w-3" />,
          label: 'RPC Slow',
          className: 'bg-nova-warning/20 text-nova-warning border-nova-warning/30',
          tooltip: `RPC responding slowly (${latency}ms)`
        }
      case 'down':
        return {
          icon: <ZapOff className="h-3 w-3" />,
          label: 'RPC Down',
          className: 'bg-nova-error/20 text-nova-error border-nova-error/30',
          tooltip: 'RPC not responding - check network'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center space-x-1.5 px-2.5 py-1 ${config.className} ${className}`}
          >
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p>{config.tooltip}</p>
            <p className="text-muted-foreground">
              Chain ID: {chainId}
            </p>
            <p className="text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}