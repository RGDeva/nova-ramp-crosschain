import React from 'react'
import { CheckCircle, Clock, AlertCircle, ExternalLink, Copy, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface OrderTimelineCardProps {
  orderId: string
  provider: string
  amount: string
  currency: string
  status: 'created' | 'paying' | 'auth' | 'proving' | 'fulfilled' | 'failed' | 'expired'
  txSignal?: string
  txFulfill?: string
  createdAt: string
  onAuthenticate?: () => void
  onGenerateProof?: () => void
  onFulfill?: () => void
  onRetry?: () => void
}

const timelineSteps = [
  { key: 'created', label: 'Created' },
  { key: 'paying', label: 'Paid' },
  { key: 'auth', label: 'Auth OK' },
  { key: 'proving', label: 'Proof OK' },
  { key: 'fulfilled', label: 'Fulfilled' },
]

export const OrderTimelineCard: React.FC<OrderTimelineCardProps> = ({
  orderId,
  provider,
  amount,
  currency,
  status,
  txSignal,
  txFulfill,
  createdAt,
  onAuthenticate,
  onGenerateProof,
  onFulfill,
  onRetry,
}) => {
  const { toast } = useToast()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    })
  }

  const getStepStatus = (stepKey: string) => {
    const stepIndex = timelineSteps.findIndex(step => step.key === stepKey)
    const currentIndex = timelineSteps.findIndex(step => step.key === status)
    
    if (status === 'failed' || status === 'expired') {
      return stepIndex <= currentIndex ? 'error' : 'idle'
    }
    
    if (stepIndex < currentIndex) return 'done'
    if (stepIndex === currentIndex) return 'active'
    return 'idle'
  }

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-nova-success" />
      case 'active':
        return <Clock className="h-4 w-4 text-nova-primary animate-pulse" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-nova-error" />
      default:
        return <div className="h-4 w-4 rounded-full border border-muted-foreground" />
    }
  }

  const getStatusVariant = () => {
    switch (status) {
      case 'fulfilled':
        return 'default'
      case 'failed':
      case 'expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {amount} {currency} via {provider}
          </CardTitle>
          <Badge variant={getStatusVariant()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Order ID: {orderId.slice(0, 8)}... • {new Date(createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline */}
        <div className="flex items-center space-x-2">
          {timelineSteps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center space-y-1">
                {getStepIcon(getStepStatus(step.key))}
                <span className="text-xs text-center">{step.label}</span>
              </div>
              {index < timelineSteps.length - 1 && (
                <div className="flex-1 h-0.5 bg-muted-foreground/30 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Transaction Hashes */}
        {(txSignal || txFulfill) && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            {txSignal && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Signal Tx:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {txSignal.slice(0, 10)}...{txSignal.slice(-8)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(txSignal, 'Signal transaction hash')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(`https://basescan.org/tx/${txSignal}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {txFulfill && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fulfill Tx:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {txFulfill.slice(0, 10)}...{txFulfill.slice(-8)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(txFulfill, 'Fulfill transaction hash')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(`https://basescan.org/tx/${txFulfill}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {status === 'paying' && onAuthenticate && (
            <Button size="sm" onClick={onAuthenticate}>
              Authenticate
            </Button>
          )}
          {status === 'auth' && onGenerateProof && (
            <Button size="sm" onClick={onGenerateProof}>
              Generate Proof
            </Button>
          )}
          {status === 'proving' && onFulfill && (
            <Button size="sm" onClick={onFulfill}>
              Fulfill
            </Button>
          )}
          {(status === 'failed' || status === 'expired') && onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}