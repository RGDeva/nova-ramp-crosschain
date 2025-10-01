import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { KYCVerification } from "@/components/KYCVerification";

const Verify = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Identity Verification
            </span>
          </h1>
          <p className="text-muted-foreground">
            Quick verification to unlock unlimited trading
          </p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <KYCVerification />
        </div>
      </div>
    </Layout>
  );
};

export default Verify;
