import React, { useState, useEffect } from "react";
import { ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { PreflightChecklist } from "@/components/PreflightChecklist";
import { InlineStepper, defaultOnrampSteps } from "@/components/InlineStepper";
import { QuoteItem } from "@/components/QuoteItem";
import ProviderSelector from "@/components/ProviderSelector";
import { useAuth } from "@/contexts/PrivyProvider";
import { useAccount, useConnect } from "wagmi";

interface Quote {
  provider: string;
  receiveAmount: string;
  fees: {
    maker: number;
    protocol: number;
    gasEst: number;
  };
  eta: string;
  isBestPrice?: boolean;
}

const Onramp = () => {
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedChain, setSelectedChain] = useState("base");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderStarted, setOrderStarted] = useState(false);
  const [steps, setSteps] = useState(defaultOnrampSteps);
  
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuth();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const chains = [
    { id: "base", name: "Base", symbol: "BASE" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  ];

  // Fetch quotes when amount and provider are set
  useEffect(() => {
    if (amount && selectedProvider && parseFloat(amount) > 0) {
      fetchQuotes();
    } else {
      setQuotes([]);
    }
  }, [amount, selectedProvider]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // Mock quotes - in real app would call ZKP2P API through our proxy
      const mockQuotes: Quote[] = [
        {
          provider: "Venmo",
          receiveAmount: (parseFloat(amount) * 0.995).toFixed(2),
          fees: { maker: 0.3, protocol: 0.2, gasEst: 2.50 },
          eta: "2-5 min",
          isBestPrice: true,
        },
        {
          provider: "Cash App",
          receiveAmount: (parseFloat(amount) * 0.993).toFixed(2), 
          fees: { maker: 0.4, protocol: 0.2, gasEst: 2.50 },
          eta: "3-7 min",
        },
        {
          provider: "Revolut",
          receiveAmount: (parseFloat(amount) * 0.990).toFixed(2),
          fees: { maker: 0.5, protocol: 0.2, gasEst: 2.50 },
          eta: "5-10 min",
        }
      ];

      // Sort by best price (highest receive amount) and mark the best
      const sortedQuotes = mockQuotes.sort((a, b) => 
        parseFloat(b.receiveAmount) - parseFloat(a.receiveAmount)
      );
      
      sortedQuotes[0].isBestPrice = true;
      
      setQuotes(sortedQuotes);
      
      // Auto-select the best provider
      if (!selectedProvider || selectedProvider !== sortedQuotes[0].provider.toLowerCase()) {
        setSelectedProvider(sortedQuotes[0].provider.toLowerCase());
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const handleConnectPrivy = () => {
    login();
  };

  const handleStartOrder = async () => {
    if (!isAuthenticated || !isConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet and authenticate with Privy.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !selectedProvider) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount and select a provider.",
        variant: "destructive",
      });
      return;
    }

    setOrderStarted(true);
    
    // Update stepper to show Start as done
    setSteps(prev => prev.map(step => 
      step.id === 'start' 
        ? { ...step, status: 'done' }
        : step.id === 'pay'
        ? { ...step, status: 'active' }
        : step
    ));

    try {
      // Here would implement the actual ZKP2P flow:
      // 1. Call signalIntent contract
      // 2. Create order in database
      // 3. Guide user through off-chain payment
      // 4. Authenticate with PeerAuth
      // 5. Generate proof
      // 6. Call fulfillIntent

      toast({
        title: "Order Started!",
        description: `Starting ${amount} USD onramp via ${selectedProvider}`,
      });

      // Mock progression through steps
      setTimeout(() => {
        setSteps(prev => prev.map(step => 
          step.id === 'pay' 
            ? { ...step, status: 'done' }
            : step.id === 'auth'
            ? { ...step, status: 'active' }
            : step
        ));
      }, 2000);

    } catch (error) {
      console.error('Failed to start order:', error);
      toast({
        title: "Error",
        description: "Failed to start order. Please try again.",
        variant: "destructive",
      });
      
      // Reset stepper on error
      setSteps(prev => prev.map(step => 
        step.id === 'start' 
          ? { ...step, status: 'error' }
          : { ...step, status: 'idle' }
      ));
    }
  };

  const canStartOrder = isAuthenticated && isConnected && amount && selectedProvider;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">On-Ramp</h1>
          <p className="text-muted-foreground">
            Pay off-chain. Prove privately. Receive USDC in minutes.
          </p>
        </div>

        {/* Pre-flight Checklist */}
        <div className="mb-6 animate-fade-in">
          <PreflightChecklist
            onConnectWallet={handleConnectWallet}
            onConnectPrivy={handleConnectPrivy}
          />
        </div>

        {/* Main Form Card */}
        <Card className="bg-gradient-surface border-border/50 animate-fade-in mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Amount & Provider</span>
            </CardTitle>
            <CardDescription>
              Enter the amount and select your payment provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
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

            {/* Chain Selector */}
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

            {/* Provider Selector */}
            <ProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
            />

            {/* Quotes Section */}
            {quotes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h3 className="font-medium">Live Quotes</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quotes.map((quote, index) => (
                      <QuoteItem
                        key={index}
                        {...quote}
                        isSelected={quote.provider.toLowerCase() === selectedProvider}
                        onClick={() => setSelectedProvider(quote.provider.toLowerCase())}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Start Order Button */}
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
              onClick={handleStartOrder}
              disabled={!canStartOrder || loading}
              size="lg"
            >
              <span>Start Order</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Order Progress Stepper */}
        {orderStarted && (
          <div className="animate-fade-in">
            <InlineStepper steps={steps} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Onramp;