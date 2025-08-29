import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, ArrowRight, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface IntentStatusProps {
  orderId: string;
}

const IntentStatus = ({ orderId }: IntentStatusProps) => {
  const [currentStep, setCurrentStep] = useState(2); // Mock current step

  // Mock order data - in real app this would come from props/API
  const orderData = {
    id: orderId,
    amount: "$100.00",
    provider: "Venmo",
    status: "pending_proof",
    createdAt: "2024-01-15T10:30:00Z",
    intentHash: "0x1234...5678",
    nullifierHash: "0xabcd...efgh",
  };

  const steps = [
    {
      id: 1,
      title: "Intent Verified",
      description: "Payment intent has been verified and recorded",
      icon: CheckCircle,
      status: "completed",
    },
    {
      id: 2, 
      title: "Signal Intent",
      description: "Intent signaled on blockchain, awaiting authentication",
      icon: Clock,
      status: "active",
    },
    {
      id: 3,
      title: "PeerAuth Authentication", 
      description: "Authenticate with your payment provider",
      icon: Shield,
      status: "pending",
    },
    {
      id: 4,
      title: "Generate Proof",
      description: "Generate zero-knowledge proof of payment",
      icon: Clock,
      status: "pending", 
    },
    {
      id: 5,
      title: "Fulfill Intent",
      description: "Complete transaction and receive USDC",
      icon: CheckCircle,
      status: "pending",
    },
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active"; 
    return "pending";
  };

  const getStepIcon = (step: any) => {
    const status = getStepStatus(step.id);
    if (status === "completed") return CheckCircle;
    if (status === "active") return Clock;
    return step.icon;
  };

  const getStepColor = (stepId: number) => {
    const status = getStepStatus(stepId);
    if (status === "completed") return "text-nova-success";
    if (status === "active") return "text-primary";
    return "text-muted-foreground";
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleAuthenticate = () => {
    setCurrentStep(3);
    // In real app, this would trigger PeerAuth
    console.log("Starting PeerAuth authentication...");
  };

  const handleGenerateProof = () => {
    setCurrentStep(4);
    // In real app, this would trigger proof generation
    console.log("Generating zero-knowledge proof...");
  };

  const handleFulfillIntent = () => {
    setCurrentStep(5);
    // In real app, this would call fulfill contract
    console.log("Fulfilling intent on blockchain...");
  };

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Order Status</span>
              <Badge variant="secondary">#{orderId}</Badge>
            </CardTitle>
            <CardDescription>
              {orderData.amount} via {orderData.provider}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="flex items-center space-x-1">
            <ExternalLink className="h-3 w-3" />
            <span>View on Explorer</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step List */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = getStepIcon(step);
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full border-2 transition-colors duration-nova ${
                  status === "completed" 
                    ? "border-nova-success bg-nova-success/10" 
                    : status === "active"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background/50"
                }`}>
                  <Icon className={`h-4 w-4 ${getStepColor(step.id)}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${getStepColor(step.id)}`}>
                      {step.title}
                    </h4>
                    {status === "active" && (
                      <Badge variant="secondary" className="animate-pulse">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border/30">
          {currentStep === 2 && (
            <Button 
              onClick={handleAuthenticate}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
            >
              <Shield className="mr-2 h-4 w-4" />
              Authenticate with PeerAuth
            </Button>
          )}
          {currentStep === 3 && (
            <Button 
              onClick={handleGenerateProof}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
            >
              Generate Zero-Knowledge Proof
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 4 && (
            <Button 
              onClick={handleFulfillIntent}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-nova"
            >
              Fulfill Intent & Receive USDC
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Order Details */}
        <div className="pt-4 border-t border-border/30 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intent Hash:</span>
            <span className="font-mono">{orderData.intentHash}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(orderData.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentStatus;