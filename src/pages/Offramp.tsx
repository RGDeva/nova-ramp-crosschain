import { useState } from "react";
import { ArrowLeft, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";

const Offramp = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [minReceive, setMinReceive] = useState("");
  const [maxReceive, setMaxReceive] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

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

  const handleCreateDeposit = () => {
    console.log("Creating deposit with:", { depositAmount, minReceive, maxReceive, selectedCurrency });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Off-Ramp</h1>
          <p className="text-muted-foreground">
            Create maker deposits and set your preferred exchange rates
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Deposit Form */}
          <Card className="bg-gradient-surface border-border/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Create Maker Deposit</span>
              </CardTitle>
              <CardDescription>
                Deposit crypto to provide liquidity and earn fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount (USDC)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="1000.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Receive Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-background/50 border-border/50">
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
                  <Label htmlFor="minReceive">Min Receive</Label>
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
                  <Label htmlFor="maxReceive">Max Receive</Label>
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

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                onClick={handleCreateDeposit}
              >
                Create Deposit
              </Button>
            </CardContent>
          </Card>

          {/* Active Deposits */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card className="bg-gradient-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  <span>Your Deposits</span>
                </CardTitle>
                <CardDescription>
                  Manage your active maker deposits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Offramp;