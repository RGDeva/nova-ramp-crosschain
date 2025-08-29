import { useState } from "react";
import { Settings as SettingsIcon, Hash, Globe, Key, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

const Settings = () => {
  const [selectedChain, setSelectedChain] = useState("base");
  const [enableFuji, setEnableFuji] = useState(false);
  const [hashInput, setHashInput] = useState("");
  const [hashResult, setHashResult] = useState("");

  const chains = [
    { 
      id: "base", 
      name: "Base Mainnet", 
      rpc: "https://mainnet.base.org",
      chainId: 8453,
      explorer: "https://basescan.org"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      rpc: "https://eth.llamarpc.com",
      chainId: 1,
      explorer: "https://etherscan.io"
    },
    { 
      id: "fuji", 
      name: "Avalanche Fuji", 
      rpc: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      explorer: "https://testnet.snowtrace.io",
      testnet: true
    },
  ];

  const currentChain = chains.find(chain => chain.id === selectedChain);

  const handleHashCurrency = () => {
    // Mock currency hashing - in real app this would use actual hash function
    const mockHash = `0x${hashInput.toLowerCase().replace(/[^a-z]/g, '').padEnd(64, '0').slice(0, 64)}`;
    setHashResult(mockHash);
  };

  const handleExportSettings = () => {
    const settings = {
      chain: selectedChain,
      enableFuji,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nova-ramp-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Nova Ramp preferences and network settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Network Configuration */}
          <Card className="bg-gradient-surface border-border/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Network Configuration</span>
              </CardTitle>
              <CardDescription>
                Select your preferred blockchain network and RPC settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chain">Active Chain</Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains
                      .filter(chain => chain.testnet ? enableFuji : true)
                      .map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        {chain.name} {chain.testnet && "(Testnet)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentChain && (
                <div className="p-4 bg-background/30 rounded-lg border border-border/30">
                  <h4 className="font-medium mb-3">Chain Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chain ID:</span>
                      <span className="font-mono">{currentChain.chainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RPC URL:</span>
                      <span className="font-mono text-xs truncate max-w-[200px]">{currentChain.rpc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Explorer:</span>
                      <a 
                        href={currentChain.explorer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                      >
                        {currentChain.explorer}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Switch
                  id="enableFuji"
                  checked={enableFuji}
                  onCheckedChange={setEnableFuji}
                />
                <div className="space-y-1">
                  <Label htmlFor="enableFuji">Enable Avalanche Fuji Testnet</Label>
                  <p className="text-xs text-muted-foreground">
                    Show testnet chains in the chain selector (for development)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Hash Tool */}
          <Card className="bg-gradient-surface border-border/50 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-accent" />
                <span>Currency Hash Tool</span>
              </CardTitle>
              <CardDescription>
                Generate currency hashes for ZKP verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hashInput">Currency String</Label>
                <Input
                  id="hashInput"
                  placeholder="USD, EUR, GBP, etc."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>
              
              <Button 
                onClick={handleHashCurrency}
                disabled={!hashInput.trim()}
                className="w-full"
              >
                Generate Hash
              </Button>

              {hashResult && (
                <div className="space-y-2">
                  <Label htmlFor="hashResult">Generated Hash</Label>
                  <Textarea
                    id="hashResult"
                    value={hashResult}
                    readOnly
                    className="bg-background/30 border-border/30 font-mono text-sm"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(hashResult)}
                  >
                    Copy Hash
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-gradient-surface border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <span>Application Information</span>
              </CardTitle>
              <CardDescription>
                Nova Ramp version and system information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-mono">v1.0.0-beta</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Build</p>
                  <p className="font-mono">2024.01.15</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Network</p>
                  <p className="font-mono">{currentChain?.name || "Not selected"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Status</p>
                  <p className="text-nova-success">Connected</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={handleExportSettings} className="flex-1">
                  Export Settings
                </Button>
                <Button variant="outline" className="flex-1">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;