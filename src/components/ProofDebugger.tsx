import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Copy, Download, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProofDebuggerProps {
  proofData?: string
  metadata?: any
  onRegenerateProof?: () => void
}

export const ProofDebugger: React.FC<ProofDebuggerProps> = ({
  proofData,
  metadata,
  onRegenerateProof
}) => {
  const [showRawData, setShowRawData] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Proof data copied successfully",
    })
  }

  const downloadProof = () => {
    if (!proofData) return
    
    const blob = new Blob([proofData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proof_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Proof downloaded",
      description: "Proof data saved to your device",
    })
  }

  const parseProofData = () => {
    if (!proofData) return null
    try {
      return JSON.parse(proofData)
    } catch (error) {
      return { error: 'Invalid JSON format', raw: proofData }
    }
  }

  const parsedProof = parseProofData()

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Proof Debugger</CardTitle>
          <div className="flex space-x-2">
            {onRegenerateProof && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRegenerateProof}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Regenerate</span>
              </Button>
            )}
            {proofData && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(proofData)}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadProof}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!proofData ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No proof data available</p>
            <p className="text-sm mt-2">Generate a proof to see debugging information</p>
          </div>
        ) : (
          <Tabs defaultValue="parsed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parsed">Parsed</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="parsed" className="space-y-4">
              {parsedProof ? (
                <div className="space-y-3">
                  {parsedProof.error ? (
                    <div className="text-nova-error">
                      <Badge variant="destructive" className="mb-2">Parse Error</Badge>
                      <p className="text-sm">{parsedProof.error}</p>
                    </div>
                  ) : (
                    <>
                      {parsedProof.claimData && (
                        <div className="p-3 bg-background/30 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Claim Data</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Provider:</span>
                              <span>{parsedProof.claimData.provider || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span>${parsedProof.claimData.amount || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span>{parsedProof.claimData.timestamp || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {parsedProof.signatures && (
                        <div className="p-3 bg-background/30 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Signatures</h4>
                          <div className="text-xs space-y-1">
                            {parsedProof.signatures.map((sig: string, index: number) => (
                              <div key={index} className="font-mono break-all">
                                {sig.substring(0, 20)}...{sig.substring(sig.length - 10)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p>Unable to parse proof data</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              {metadata ? (
                <div className="p-3 bg-background/30 rounded-lg">
                  <pre className="text-xs overflow-auto max-h-64">
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p>No metadata available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="raw" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Raw Proof Data</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRawData(!showRawData)}
                  className="flex items-center space-x-1"
                >
                  {showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showRawData ? 'Hide' : 'Show'}</span>
                </Button>
              </div>
              
              <Textarea
                value={showRawData ? proofData : '••••••••••••••••••••••••••••••••••••••••'}
                readOnly
                className="font-mono text-xs min-h-[200px] bg-background/30"
                placeholder="Proof data will appear here"
              />
              
              <div className="text-xs text-muted-foreground">
                Size: {new Blob([proofData]).size} bytes
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}