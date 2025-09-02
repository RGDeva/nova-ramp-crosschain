import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface QuoteItemProps {
  provider: string
  receiveAmount: string
  fees: {
    maker: number
    protocol: number
    gasEst: number
  }
  eta: string
  isBestPrice?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export const QuoteItem: React.FC<QuoteItemProps> = ({
  provider,
  receiveAmount,
  fees,
  eta,
  isBestPrice = false,
  isSelected = false,
  onClick,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-nova hover:border-primary/20 ${
        isSelected
          ? 'border-primary/50 bg-primary/5'
          : 'border-border/50 bg-gradient-surface'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{provider}</span>
                {isBestPrice && (
                  <Badge variant="default" className="bg-nova-success text-xs px-2 py-0.5">
                    Best price
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Maker {fees.maker}% • Protocol {fees.protocol}% • Gas ~${fees.gasEst.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">
              You receive <span className="text-nova-success">{receiveAmount} USDC</span>
            </div>
            <div className="text-sm text-muted-foreground">ETA {eta}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}