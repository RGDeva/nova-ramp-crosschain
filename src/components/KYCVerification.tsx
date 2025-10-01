import { useState } from "react";
import { CheckCircle, AlertCircle, Upload, User, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

type KYCStatus = "not_started" | "in_progress" | "pending" | "verified" | "failed";

interface KYCVerificationProps {
  status?: KYCStatus;
  onStatusChange?: (status: KYCStatus) => void;
}

export const KYCVerification = ({ 
  status = "not_started",
  onStatusChange 
}: KYCVerificationProps) => {
  const [currentStatus, setCurrentStatus] = useState<KYCStatus>(status);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
    documentType: "",
  });

  const handleStatusChange = (newStatus: KYCStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    handleStatusChange("pending");
    toast.success("Verification submitted! This usually takes 1-2 minutes.");
    
    // Simulate approval (in real app, this would be backend verification)
    setTimeout(() => {
      handleStatusChange("verified");
      toast.success("🎉 You're verified! You can now start trading.");
    }, 3000);
  };

  const StatusBadge = () => {
    const statusConfig = {
      not_started: { color: "bg-muted", text: "Not Started", icon: AlertCircle },
      in_progress: { color: "bg-nova-warning/20 text-nova-warning", text: "In Progress", icon: Upload },
      pending: { color: "bg-nova-warning/20 text-nova-warning", text: "Under Review", icon: FileText },
      verified: { color: "bg-nova-success/20 text-nova-success", text: "Verified ✓", icon: CheckCircle },
      failed: { color: "bg-destructive/20 text-destructive", text: "Failed", icon: AlertCircle },
    };

    const config = statusConfig[currentStatus];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  if (currentStatus === "verified") {
    return (
      <Card className="bg-gradient-surface border-nova-success/30">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-nova-success/20">
              <CheckCircle className="h-12 w-12 text-nova-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">You're All Set! 🎉</h3>
              <p className="text-muted-foreground">
                Your identity is verified. You can now buy and sell crypto without limits.
              </p>
            </div>
            <StatusBadge />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStatus === "pending") {
    return (
      <Card className="bg-gradient-surface border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-nova-warning/20">
              <FileText className="h-12 w-12 text-nova-warning animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Reviewing Your Info...</h3>
              <p className="text-muted-foreground">
                Hang tight! This usually takes 1-2 minutes. We'll notify you when you're approved.
              </p>
            </div>
            <StatusBadge />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Quick Identity Check</CardTitle>
              <CardDescription>
                Takes 2 minutes • Required for larger transactions
              </CardDescription>
            </div>
          </div>
          <StatusBadge />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            We need this info to comply with financial regulations. Your data is encrypted and never shared.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(val) => setFormData({ ...formData, country: val })}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">ID Type</Label>
            <Select value={formData.documentType} onValueChange={(val) => setFormData({ ...formData, documentType: val })}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 border-2 border-dashed border-border/50 rounded-lg text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
            <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Upload ID Photo</p>
            <p className="text-xs text-muted-foreground">Take a photo or upload from your device</p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-primary"
          >
            Submit for Verification
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to our verification process. Your data is protected by encryption.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
