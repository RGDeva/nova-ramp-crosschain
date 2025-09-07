import { Link } from "react-router-dom";
import { ArrowRight, ArrowDownUp, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/PrivyProvider";

const Index = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              INoVA Ramp
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Pay off-chain. Prove privately. Settle on-chain.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            No account signup. KYC requirements may vary by region/provider.
          </div>
        </div>

        {/* Two Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Onramp Card */}
          <Card 
            className="bg-gradient-surface border-border/50 hover:border-primary/20 transition-all duration-nova cursor-pointer group animate-fade-in"
            onClick={isAuthenticated ? undefined : login}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors duration-nova">
                <ArrowDownUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Buy Crypto</CardTitle>
              <p className="text-muted-foreground">
                Buy crypto with Venmo/Cash App
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-between">
                  <span>• Instant payments</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Zero-knowledge privacy</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Cross-chain support</span>
                  <span className="text-nova-success">✓</span>
                </div>
              </div>
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                  asChild
                >
                  <Link to="/onramp" className="flex items-center justify-center space-x-2">
                    <span>Start Onramp</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                  onClick={login}
                >
                  <span>Connect Wallet to Start</span>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Offramp Card */}
          <Card 
            className="bg-gradient-surface border-border/50 hover:border-primary/20 transition-all duration-nova cursor-pointer group animate-fade-in"
            style={{ animationDelay: "100ms" }}
            onClick={isAuthenticated ? undefined : login}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-accent/10 w-fit group-hover:bg-accent/20 transition-colors duration-nova">
                <CircleDollarSign className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Sell Crypto</CardTitle>
              <p className="text-muted-foreground">
                Sell crypto to cash
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-between">
                  <span>• Bank transfer to any account</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Competitive exchange rates</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Private transactions</span>
                  <span className="text-nova-success">✓</span>
                </div>
              </div>
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                  asChild
                >
                  <Link to="/offramp" className="flex items-center justify-center space-x-2">
                    <span>Start Offramp</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                  onClick={login}
                >
                  <span>Connect Wallet to Start</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
