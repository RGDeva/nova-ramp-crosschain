import { useState } from "react";
import { ArrowRight, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import ProviderSelector from "@/components/ProviderSelector";
import QuoteCard from "@/components/QuoteCard";

const Onramp = () => {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedChain, setSelectedChain] = useState("base");

  const chains = [
    { id: "base", name: "Base", symbol: "BASE" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  ];

  const mockQuotes = [
    {
      provider: "Venmo",
      rate: 0.995,
      fee: 2.5,
      total: 97.5,
      time: "2-5 minutes",
      icon: "🟣"
    },
    {
      provider: "Cash App", 
      rate: 0.993,
      fee: 3.0,
      total: 97.0,
      time: "3-7 minutes",
      icon: "🟢"
    },
  ];

  const handleStartOrder = () => {
    // Placeholder for order creation
    console.log("Starting order with:", { amount, selectedProvider, selectedChain });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">On-Ramp</h1>
          <p className="text-muted-foreground">
            Convert fiat to crypto privately using zero-knowledge proofs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-surface border-border/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Amount & Details</span>
              </CardTitle>
              <CardDescription>
                Enter the amount you want to convert and select your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chain">Destination Chain</Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ProviderSelector
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
              />
            </CardContent>
          </Card>

          {/* Quotes */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span>Best Quotes</span>
                </CardTitle>
                <CardDescription>
                  Live quotes from verified providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {amount && selectedProvider ? (
                  <>
                    {mockQuotes.map((quote, index) => (
                      <QuoteCard
                        key={index}
                        {...quote}
                        isSelected={quote.provider.toLowerCase() === selectedProvider}
                      />
                    ))}
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                      onClick={handleStartOrder}
                    >
                      <span>Start Order</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter amount and select a provider to see quotes
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onramp;