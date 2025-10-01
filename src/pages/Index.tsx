import { Link } from "react-router-dom";
import { ArrowRight, ArrowDownUp, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/PrivyProvider";
import { WelcomeOnboarding } from "@/components/WelcomeOnboarding";
import { useState, useEffect } from "react";

const Index = () => {
  const { isAuthenticated, login } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding only once for new users
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding && isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  return (
    <Layout>
      <WelcomeOnboarding 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              INoVA Ramp
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Buy and sell crypto with complete privacy. No complicated blockchain stuff.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            No signup required • Simple verification • Lightning fast
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
                Use Venmo or Cash App • Get USDC in minutes
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-between">
                  <span>• Money arrives in 2-5 minutes</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Your payments stay private</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Works with any wallet</span>
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
                    <span>Buy Crypto Now</span>
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
                Convert USDC to cash • Fast bank transfers
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-between">
                  <span>• Cash in your bank quickly</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Best rates guaranteed</span>
                  <span className="text-nova-success">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Completely private</span>
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
                    <span>Sell Crypto Now</span>
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
