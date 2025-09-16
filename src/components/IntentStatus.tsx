import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface IntentStatusProps {
  intentHash?: string
  txHash?: string
  status: 'pending' | 'signaled' | 'proving' | 'fulfilled' | 'failed'
  onRetry?: () => void
}

export const IntentStatus: React.FC<IntentStatusProps> = ({
  intentHash,
  txHash, 
  status,
  onRetry
}) => {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${label} copied`,
      description: "Hash copied to clipboard",
    })
  }

  const getStatusColor = () => {
    switch (status) {
      case 'fulfilled':
        return 'bg-nova-success/20 text-nova-success'
      case 'failed':
        return 'bg-nova-error/20 text-nova-error' 
      case 'proving':
        return 'bg-nova-warning/20 text-nova-warning'
      case 'signaled':
        return 'bg-nova-primary/20 text-nova-primary'
      default:
        return 'bg-nova-text-muted/20 text-nova-text-muted'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pending Payment'
      case 'signaled':
        return 'Intent Signaled'
      case 'proving':
        return 'Generating Proof'
      case 'fulfilled':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Transaction Status</h3>
          <Badge className={getStatusColor()}>
            {getStatusLabel()}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          {intentHash && (
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Intent Hash
                </p>
                <p className="font-mono text-xs">
                  {intentHash.substring(0, 10)}...{intentHash.substring(intentHash.length - 8)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(intentHash, 'Intent Hash')}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7 w-7 p-0"
                >
                  <a
                    href={`https://basescan.org/tx/${intentHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {txHash && (
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Transaction Hash
                </p>
                <p className="font-mono text-xs">
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(txHash, 'Transaction Hash')}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost" 
                  asChild
                  className="h-7 w-7 p-0"
                >
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {status === 'failed' && onRetry && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="w-full flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Transaction</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}