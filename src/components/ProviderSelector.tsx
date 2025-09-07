import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

const ProviderSelector = ({ selectedProvider, onProviderChange }: ProviderSelectorProps) => {
  const providers = [
    {
      id: "venmo",
      name: "Venmo", 
      icon: "💸",
      description: "Instant payments via Venmo",
      fee: "0.5%",
      eta: "2-5 mins"
    },
    {
      id: "cashapp",
      name: "Cash App",
      icon: "💰", 
      description: "Quick transfers with Cash App",
      fee: "0.6%",
      eta: "3-7 mins"
    },
    {
      id: "revolut",
      name: "Revolut",
      icon: "🏦",
      description: "Fast bank transfers",
      fee: "0.4%", 
      eta: "5-10 mins"
    },
    {
      id: "wise",
      name: "Wise",
      icon: "🌍",
      description: "International transfers",
      fee: "0.7%",
      eta: "10-15 mins"
    },
    {
      id: "zelle",
      name: "Zelle",
      icon: "⚡",
      description: "Fast US bank transfers", 
      fee: "0.3%",
      eta: "1-3 mins"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {providers.map((provider) => (
          <Card 
            key={provider.id} 
            className={`cursor-pointer transition-all duration-nova hover:border-primary/30 ${
              selectedProvider === provider.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border/30 bg-background/30'
            }`}
            onClick={() => onProviderChange(provider.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium text-nova-success">{provider.fee}</p>
                  <p className="text-muted-foreground">{provider.eta}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderSelector;