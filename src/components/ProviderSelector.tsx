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
      icon: "🟣",
      description: "Fast transfers via Venmo",
      fee: "2.5%",
      time: "2-5 min"
    },
    {
      id: "cashapp", 
      name: "Cash App",
      icon: "🟢", 
      description: "Instant Cash App payments",
      fee: "3.0%",
      time: "3-7 min"
    },
    {
      id: "revolut",
      name: "Revolut",
      icon: "🔵",
      description: "European bank transfers",
      fee: "2.0%", 
      time: "1-3 min"
    },
    {
      id: "wise",
      name: "Wise",
      icon: "🟦",
      description: "Global money transfers", 
      fee: "1.5%",
      time: "5-10 min"
    },
  ];

  return (
    <div className="space-y-2">
      <Label>Payment Provider</Label>
      <RadioGroup value={selectedProvider} onValueChange={onProviderChange}>
        <div className="grid grid-cols-1 gap-3">
          {providers.map((provider) => (
            <div key={provider.id} className="relative">
              <RadioGroupItem 
                value={provider.id} 
                id={provider.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={provider.id}
                className="flex cursor-pointer"
              >
                <Card className={`w-full transition-all duration-nova hover:border-primary/30 ${
                  selectedProvider === provider.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/30 bg-background/30'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {provider.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{provider.fee}</p>
                        <p className="text-muted-foreground">{provider.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProviderSelector;