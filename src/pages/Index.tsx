import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/PrivyProvider";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { isAuthenticated, login } = useAuth();
  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Privacy",
      description: "Your transactions are private by design using advanced zero-knowledge proofs.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Complete on/off ramps in minutes with our optimized cross-chain infrastructure.",
    },
    {
      icon: Eye,
      title: "Transparent & Secure",
      description: "Full transparency with verifiable proofs while maintaining your privacy.",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-glow opacity-30 blur-3xl" />
          <div className="relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  The Future of{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Private
                  </span>{" "}
                  Cross-Chain Ramps
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Pay off-chain. Prove privately. Receive USDC in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {isAuthenticated ? (
                    <>
                      <Button 
                        size="lg" 
                        className="bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                        asChild
                      >
                        <Link to="/onramp" className="flex items-center space-x-2">
                          <span>Start On-Ramp</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-primary/20 hover:bg-primary/10"
                        asChild
                      >
                        <Link to="/offramp">Try Off-Ramp</Link>
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                      onClick={login}
                    >
                      <span>Connect Wallet</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative animate-scale-in">
                <img 
                  src={heroImage} 
                  alt="Nova Ramp Dashboard" 
                  className="rounded-2xl shadow-elegant w-full"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Nova Ramp?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on cutting-edge zero-knowledge technology for the most secure 
              and private cross-chain experience available.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gradient-surface border-border/50 hover:border-primary/20 transition-colors duration-nova animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-surface rounded-2xl border border-border/50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Experience Private Cross-Chain Ramps?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of users who trust Nova Ramp for their cross-chain needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
                asChild
              >
                <Link to="/onramp">Get Started</Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
                asChild
              >
                <Link to="/orders">View Orders</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
