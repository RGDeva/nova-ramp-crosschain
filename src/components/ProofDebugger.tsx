import { useState } from "react";
import { Code, Copy, Eye, EyeOff, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProofDebuggerProps {
  orderId: string;
}

const ProofDebugger = ({ orderId }: ProofDebuggerProps) => {
  const [isProofVisible, setIsProofVisible] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  // Mock proof data - in real app this would come from actual proof generation
  const proofData = {
    proof: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    publicSignals: [
      "0x0000000000000000000000000000000000000000000000000000000000000064", // Amount 
      "0x1234567890abcdef1234567890abcdef12345678", // Provider hash
      "0xabcdef1234567890abcdef1234567890abcdef12", // Nullifier
      "0x9876543210fedcba9876543210fedcba98765432", // Intent hash
    ],
    metadata: {
      provider: "venmo",
      amount: "100.00",
      currency: "USD",
      timestamp: "2024-01-15T10:30:00Z",
      verifierContract: "0xCA38607D85E8F6294Dc10728669605E6664C2D70",
    },
    verification: {
      status: "valid",
      gasEstimate: "180,000",
      confidence: 99.8,
    }
  };

  const handleCopyProof = () => {
    navigator.clipboard.writeText(proofData.proof);
    // Show toast notification in real app
  };

  const handleDownloadProof = () => {
    const proofJson = JSON.stringify({
      proof: proofData.proof,
      publicSignals: proofData.publicSignals,
      metadata: proofData.metadata,
      orderId,
    }, null, 2);

    const blob = new Blob([proofJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof-${orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-accent" />
          <span>Proof Debugger</span>
        </CardTitle>
        <CardDescription>
          Inspect and verify zero-knowledge proof details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proof" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proof">Proof Data</TabsTrigger>
            <TabsTrigger value="signals">Public Signals</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="proof" className="space-y-4 mt-4">
            {/* Proof Verification Status */}
            <div className="flex items-center justify-between p-3 bg-nova-success/10 border border-nova-success/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-nova-success" />
                <span className="text-sm font-medium">Proof Valid</span>
              </div>
              <Badge className="bg-nova-success/20 text-nova-success">
                {proofData.verification.confidence}% Confidence
              </Badge>
            </div>

            {/* Proof Data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Zero-Knowledge Proof</label>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsProofVisible(!isProofVisible)}
                  >
                    {isProofVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyProof}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={isProofVisible ? proofData.proof : "•".repeat(160)}
                readOnly
                className="bg-background/30 border-border/30 font-mono text-xs resize-none"
                rows={6}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleDownloadProof} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Proof
              </Button>
              <Button variant="outline" className="flex-1">
                Verify on Chain
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="space-y-4 mt-4">
            <div className="space-y-3">
              {proofData.publicSignals.map((signal, index) => (
                <div key={index} className="p-3 bg-background/30 border border-border/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Signal {index + 1}
                      {index === 0 && " (Amount)"}
                      {index === 1 && " (Provider Hash)"}
                      {index === 2 && " (Nullifier)"}
                      {index === 3 && " (Intent Hash)"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(signal)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-xs font-mono text-muted-foreground break-all">
                    {signal}
                  </code>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-background/30 border-border/30">
                <CardContent className="p-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-nova-success mx-auto mb-2" />
                    <p className="font-medium">Valid Proof</p>
                    <p className="text-xs text-muted-foreground">Cryptographically verified</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30 border-border/30">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {proofData.verification.gasEstimate}
                    </div>
                    <p className="text-xs text-muted-foreground">Estimated Gas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Metadata */}
            <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>View Metadata</span>
                  <Code className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="p-3 bg-background/30 border border-border/30 rounded-lg text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-mono">{proofData.metadata.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-mono">${proofData.metadata.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency:</span>
                      <span className="font-mono">{proofData.metadata.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verifier:</span>
                      <span className="font-mono text-xs">{proofData.metadata.verifierContract}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProofDebugger;