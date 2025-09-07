import { useState } from "react";
import { ArrowLeft, Wallet, Plus, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProviderSelector from "@/components/ProviderSelector";
import { MiniStepper, defaultSteps, Step } from "@/components/MiniStepper";
import Layout from "@/components/Layout";

const Offramp = () => {
  // Quick Sell State
  const [sellAmount, setSellAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  
  // Maker Deposit State  
  const [depositAmount, setDepositAmount] = useState("");
  const [minReceive, setMinReceive] = useState("");
  const [maxReceive, setMaxReceive] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [activeTab, setActiveTab] = useState("quicksell");
  
  // Stepper State
  const [stepperSteps, setStepperSteps] = useState<Step[]>(defaultSteps);

  const currencies = [
    { id: "usd", name: "USD", symbol: "$" },
    { id: "eur", name: "EUR", symbol: "€" },
    { id: "gbp", name: "GBP", symbol: "£" },
  ];

  const mockDeposits = [
    {
      id: "1",
      amount: "1,000.00",
      currency: "USDC", 
      range: "$50 - $500",
      rate: "0.995",
      status: "Active",
    },
    {
      id: "2", 
      amount: "500.00",
      currency: "USDC",
      range: "$25 - $250", 
      rate: "0.993",
      status: "Filled",
    },
  ];

  const handleQuickSell = () => {
    console.log("Quick sell with:", { sellAmount, selectedProvider });
    // Update stepper for quick sell flow
    setStepperSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? 'active' : 'idle'
    })));
  };

  const handleCreateDeposit = () => {
    console.log("Creating deposit with:", { depositAmount, minReceive, maxReceive, selectedCurrency });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Sell Crypto</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert USDC to cash • Fast payouts to any account
          </p>
        </div>

        {/* Mode Switch */}
        <Card className="bg-gradient-surface border-border/50 animate-fade-in">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="quicksell" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Quick Sell</span>
                </TabsTrigger>
                <TabsTrigger value="makerdeposit" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Maker Deposit</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quicksell" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Quick Sell Form */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sellAmount" className="text-base font-medium">Amount to Sell (USDC)</Label>
                        <Input
                          id="sellAmount"
                          type="number"
                          placeholder="100.00"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          className="bg-background/50 border-border/50 h-12 text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-medium">Payout Method</Label>
                        <ProviderSelector 
                          selectedProvider={selectedProvider}
                          onProviderChange={setSelectedProvider}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Quote & Action */}
                  <div className="space-y-6">
                    <div className="p-6 border border-border/30 rounded-lg bg-background/30">
                      <h3 className="font-semibold mb-4">Payout Preview</h3>
                      {sellAmount && selectedProvider ? (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>USDC Amount:</span>
                            <span>{sellAmount} USDC</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Provider Fee:</span>
                            <span>-$2.50</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Network Fee:</span>
                            <span>-$1.20</span>
                          </div>
                          <div className="border-t border-border/30 pt-3 flex justify-between font-semibold text-lg">
                            <span>You'll receive:</span>
                            <span className="text-nova-success">${(parseFloat(sellAmount || "0") - 3.70).toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground text-center">
                            ETA: 2-5 minutes
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          Enter amount and select method
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                      disabled={!sellAmount || !selectedProvider}
                      onClick={handleQuickSell}
                    >
                      Get Paid
                    </Button>
                  </div>
                </div>

                {/* Mini Stepper for Quick Sell */}
                {stepperSteps.some(s => s.status !== 'idle') && (
                  <div className="mt-8 pt-8 border-t border-border/30">
                    <MiniStepper steps={stepperSteps} className="justify-center" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="makerdeposit" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Create Deposit Form */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount" className="text-base font-medium">Deposit Amount (USDC)</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="1000.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="bg-background/50 border-border/50 h-12 text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency" className="text-base font-medium">Receive Currency</Label>
                        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                          <SelectTrigger className="bg-background/50 border-border/50 h-12">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.id} value={currency.id}>
                                {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="minReceive">Min Order</Label>
                          <Input
                            id="minReceive"
                            type="number"
                            placeholder="50.00"
                            value={minReceive}
                            onChange={(e) => setMinReceive(e.target.value)}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxReceive">Max Order</Label>
                          <Input
                            id="maxReceive"
                            type="number"
                            placeholder="500.00"
                            value={maxReceive}
                            onChange={(e) => setMaxReceive(e.target.value)}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                      onClick={handleCreateDeposit}
                    >
                      Create Deposit
                    </Button>
                  </div>

                  {/* Right: Active Deposits */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Your Deposits</h3>
                    <div className="space-y-4">
                      {mockDeposits.map((deposit) => (
                        <Card key={deposit.id} className="bg-background/30 border-border/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{deposit.amount} {deposit.currency}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  deposit.status === "Active" 
                                    ? "bg-nova-success/20 text-nova-success" 
                                    : "bg-nova-text-muted/20 text-nova-text-muted"
                                }`}>
                                  {deposit.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Range: {deposit.range}</p>
                              <p>Rate: {deposit.rate}</p>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Withdraw
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Offramp;