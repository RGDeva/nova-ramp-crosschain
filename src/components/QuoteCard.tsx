import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";

interface QuoteCardProps {
  provider: string;
  rate: number;
  fee: number;
  total: number;
  time: string;
  icon: string;
  isSelected?: boolean;
}

const QuoteCard = ({ 
  provider, 
  rate, 
  fee, 
  total, 
  time, 
  icon, 
  isSelected = false 
}: QuoteCardProps) => {
  return (
    <Card className={`transition-all duration-nova cursor-pointer ${
      isSelected 
        ? 'border-primary bg-primary/5 shadow-glow' 
        : 'border-border/30 bg-background/30 hover:border-primary/20'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-semibold">{provider}</p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
            </div>
          </div>
          {isSelected && (
            <Badge className="bg-primary text-primary-foreground">
              Selected
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Exchange Rate:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-nova-success" />
              <span className="font-medium">{rate}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Fee:</span>
            <span className="font-medium">${fee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border/30">
            <span className="font-medium">You'll receive:</span>
            <span className="text-lg font-bold text-nova-success">
              ${total.toFixed(2)} USDC
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Privacy: Zero-Knowledge</span>
            <span>Security: Verified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;