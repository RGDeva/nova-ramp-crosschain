import { useState } from "react";
import { Check, ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface WelcomeOnboardingProps {
  open: boolean;
  onComplete: () => void;
}

export const WelcomeOnboarding = ({ open, onComplete }: WelcomeOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to INoVA Ramp! 👋",
      description: "Buy and sell crypto with complete privacy. No complicated blockchain stuff—just simple, secure transactions.",
      icon: Zap,
      color: "text-primary",
    },
    {
      title: "Your Privacy is Protected 🔒",
      description: "We use zero-knowledge proofs to keep your transactions private. No one can see your payment details—not even us.",
      icon: Shield,
      color: "text-nova-success",
    },
    {
      title: "Fast & Easy Setup ⚡",
      description: "Just connect your wallet and you're ready to go. Most transactions complete in under 5 minutes.",
      icon: Lock,
      color: "text-accent",
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {currentStepData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-gradient-surface">
              <currentStepData.icon className={`h-12 w-12 ${currentStepData.color}`} />
            </div>
          </div>

          <p className="text-center text-muted-foreground text-lg leading-relaxed">
            {currentStepData.description}
          </p>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-primary"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Get Started
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {currentStep > 0 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
