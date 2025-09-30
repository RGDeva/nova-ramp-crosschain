import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/PrivyProvider";
import { useAccount, useConnect } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteItem } from "@/components/QuoteItem";
import ProviderSelector from "@/components/ProviderSelector";
import { MiniStepper, defaultSteps, Step } from "@/components/MiniStepper";
import { PreflightChecklist } from "@/components/PreflightChecklist";
import Layout from "@/components/Layout";
import { toast } from "sonner";

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
  const [selectedQuote, setSelectedQuote] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepperSteps, setStepperSteps] = useState<Step[]>(defaultSteps);
  
  const { isAuthenticated, login } = useAuth();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

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
      // Import the API function
      const { fetchQuotes: apiFetchQuotes } = await import("@/lib/inova-api");
      
      // Fetch real quotes from our API
      const apiQuotes = await apiFetchQuotes(
        parseFloat(amount),
        selectedProvider,
        'USD',
        'onramp'
      );

      // Convert API quotes to our format
      const formattedQuotes: Quote[] = apiQuotes.map((quote, index) => ({
        provider: quote.provider,
        receiveAmount: quote.netAmount.toFixed(2),
        fees: {
          maker: quote.fees.maker,
          protocol: quote.fees.protocol,
          gasEst: 2.50 // Mock gas estimate
        },
        eta: quote.eta,
        isBestPrice: index === 0
      }));
      
      setQuotes(formattedQuotes);
      if (formattedQuotes.length > 0) {
        setSelectedQuote(0); // Auto-select best quote
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      toast.error("Failed to fetch quotes. Please try again.");
      
      // Fallback to mock quotes
      const mockQuotes: Quote[] = [
        {
          provider: selectedProvider || "Best Rate",
          receiveAmount: (parseFloat(amount) * 0.995).toFixed(2),
          fees: { maker: 0.3, protocol: 0.2, gasEst: 2.50 },
          eta: "2-5 min",
          isBestPrice: true,
        }
      ];
      setQuotes(mockQuotes);
      setSelectedQuote(0);
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
      toast.error("Please connect your wallet and authenticate.");
      return;
    }

    if (!amount || !selectedProvider || selectedQuote === -1) {
      toast.error("Please enter an amount, select a provider, and choose a quote.");
      return;
    }

    setCurrentStep(1);
    
    // Update stepper to show Start as active
    setStepperSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? 'active' : 'idle'
    })));

    try {
      // Import the API function
      const { createOrder } = await import("@/lib/inova-api");
      const selectedQuoteData = quotes[selectedQuote];
      
      // Create order through our API
      const order = await createOrder({
        depositId: `deposit_${Date.now()}`, // In real app, get from quote
        orderType: 'onramp',
        provider: selectedProvider,
        fiatAmount: parseFloat(amount),
        tokenAmount: parseFloat(selectedQuoteData.receiveAmount),
        conversionRate: parseFloat(selectedQuoteData.receiveAmount) / parseFloat(amount)
      });

      toast.success(`Order created! Order ID: ${order.order_id || order.id}`);
      
      // Progress through steps
      setTimeout(() => {
        setStepperSteps(prev => prev.map((step, idx) => ({
          ...step,
          status: idx === 0 ? 'done' : idx === 1 ? 'active' : 'idle'
        })));
      }, 1000);

      // Redirect to orders page after a delay
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);

    } catch (error) {
      console.error('Failed to start order:', error);
      toast.error("Failed to start order. Please try again.");
      setCurrentStep(0);
      
      // Reset stepper
      setStepperSteps(defaultSteps);
    }
  };

  const canStartOrder = isAuthenticated && isConnected && amount && selectedProvider;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Buy Crypto</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pay with Venmo, Cash App, or bank transfer • Receive USDC instantly
          </p>
        </div>

        {/* Single Screen Layout */}
        <div className="max-w-4xl mx-auto space-y-8">
          <PreflightChecklist 
            onConnectWallet={handleConnectWallet}
            onConnectPrivy={handleConnectPrivy}
          />

          <Card className="bg-gradient-surface border-border/50 animate-fade-in">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Order Form */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-base font-medium">Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="100.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-background/50 border-border/50 h-12 text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chain" className="text-base font-medium">Destination</Label>
                        <Select value={selectedChain} onValueChange={setSelectedChain}>
                          <SelectTrigger className="bg-background/50 border-border/50 h-12">
                            <SelectValue placeholder="Select chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="base">Base (USDC)</SelectItem>
                            <SelectItem value="avalanche">Avalanche (USDC)</SelectItem>
                            <SelectItem value="ethereum">Ethereum (USDC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Payment Method</Label>
                      <ProviderSelector 
                        selectedProvider={selectedProvider}
                        onProviderChange={setSelectedProvider}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Quotes & Action */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Quotes</h3>
                    {loading ? (
                      <div className="text-center text-muted-foreground py-8 border border-border/30 rounded-lg">
                        Finding best rates...
                      </div>
                    ) : quotes.length > 0 ? (
                      <div className="space-y-3">
                        {quotes.map((quote, index) => (
                          <QuoteItem
                            key={index}
                            provider={quote.provider}
                            receiveAmount={quote.receiveAmount}
                            fees={quote.fees}
                            eta={quote.eta}
                            isBestPrice={index === 0}
                            isSelected={selectedQuote === index}
                            onClick={() => setSelectedQuote(index)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8 border border-border/30 rounded-lg">
                        {amount ? "No quotes yet—try another provider or amount." : "Enter an amount to see quotes"}
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                    disabled={!canStartOrder}
                    onClick={handleStartOrder}
                  >
                    Start Order
                  </Button>
                </div>
              </div>

              {/* Mini Stepper */}
              {currentStep > 0 && (
                <div className="mt-8 pt-8 border-t border-border/30">
                  <MiniStepper steps={stepperSteps} className="justify-center" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Onramp;