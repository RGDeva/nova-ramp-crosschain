// Mock window.zktls shim for PeerAuth compatibility
// This provides the same API interface as the real PeerAuth extension

interface ZKTLSConnection {
  isConnected: boolean
  extensionId?: string
  version?: string
}

interface AuthenticateRequest {
  actionType: 'payment' | 'verification'
  platform: string
  metadata?: any
}

interface AuthenticateResponse {
  success: boolean
  sessionId: string
  metadata?: any
}

interface GenerateProofRequest {
  intentHashDecimal: string
  originalIndex: number
  platform: string
  sessionId?: string
}

interface GenerateProofResponse {
  success: boolean
  proofId: string
  proof?: any
}

interface ProofData {
  proof: any
  publicSignals: string[]
  provider: string
  timestamp: number
  nullifier: string
  payeeHash: string
}

class ZKTLSShim {
  private isInstalled = false
  private connection: ZKTLSConnection | null = null
  private sessions = new Map<string, any>()
  private proofs = new Map<string, ProofData>()

  constructor() {
    this.simulateExtensionCheck()
  }

  private simulateExtensionCheck() {
    // Simulate checking for extension installation
    setTimeout(() => {
      // For demo purposes, randomly simulate extension availability
      this.isInstalled = Math.random() > 0.3 // 70% chance of being "installed"
      this.dispatchConnectionEvent()
    }, 1000)
  }

  private dispatchConnectionEvent() {
    const event = new CustomEvent('zktls-connection-change', {
      detail: { isInstalled: this.isInstalled, isConnected: this.connection?.isConnected || false }
    })
    window.dispatchEvent(event)
  }

  async requestConnection(): Promise<ZKTLSConnection> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.isInstalled) {
          reject(new Error('ZKTLS extension not installed. Please install PeerAuth extension.'))
          return
        }

        this.connection = {
          isConnected: true,
          extensionId: 'mock-extension-id',
          version: '1.0.0'
        }

        this.dispatchConnectionEvent()
        resolve(this.connection)
      }, 500)
    })
  }

  async authenticate(request: AuthenticateRequest): Promise<AuthenticateResponse> {
    return new Promise((resolve, reject) => {
      if (!this.connection?.isConnected) {
        reject(new Error('Not connected to ZKTLS extension'))
        return
      }

      setTimeout(() => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Store session data
        this.sessions.set(sessionId, {
          ...request,
          timestamp: Date.now(),
          status: 'authenticated'
        })

        // Simulate metadata message
        setTimeout(() => {
          const metadata = {
            platform: request.platform,
            accountInfo: {
              username: `mock_${request.platform}_user`,
              accountId: `mock_account_${Math.random().toString(36).substr(2, 8)}`
            },
            availableProofs: [
              { index: 0, description: 'Recent payment verification', timestamp: Date.now() - 3600000 },
              { index: 1, description: 'Account balance verification', timestamp: Date.now() - 7200000 }
            ]
          }

          const metadataEvent = new CustomEvent('zktls-metadata-message', {
            detail: { sessionId, metadata }
          })
          window.dispatchEvent(metadataEvent)
        }, 1000)

        resolve({
          success: true,
          sessionId,
          metadata: {
            platform: request.platform,
            timestamp: Date.now()
          }
        })
      }, 1500) // Simulate network delay
    })
  }

  onMetadataMessage(callback: (data: any) => void) {
    const handler = (event: any) => {
      callback(event.detail)
    }
    window.addEventListener('zktls-metadata-message', handler)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('zktls-metadata-message', handler)
    }
  }

  async generateProof(request: GenerateProofRequest): Promise<GenerateProofResponse> {
    return new Promise((resolve, reject) => {
      if (!this.connection?.isConnected) {
        reject(new Error('Not connected to ZKTLS extension'))
        return
      }

      const session = this.sessions.get(request.sessionId || '')
      if (!session) {
        reject(new Error('Invalid session ID'))
        return
      }

      setTimeout(() => {
        const proofId = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Generate mock proof data
        const proofData: ProofData = {
          proof: {
            pi_a: [`0x${Math.random().toString(16).substring(2, 66)}`, `0x${Math.random().toString(16).substring(2, 66)}`],
            pi_b: [
              [`0x${Math.random().toString(16).substring(2, 66)}`, `0x${Math.random().toString(16).substring(2, 66)}`],
              [`0x${Math.random().toString(16).substring(2, 66)}`, `0x${Math.random().toString(16).substring(2, 66)}`]
            ],
            pi_c: [`0x${Math.random().toString(16).substring(2, 66)}`, `0x${Math.random().toString(16).substring(2, 66)}`]
          },
          publicSignals: [
            request.intentHashDecimal,
            `0x${Math.random().toString(16).substring(2, 66)}`, // nullifier
            `0x${Math.random().toString(16).substring(2, 66)}`, // payeeHash  
            Math.floor(Math.random() * 1000000).toString() // amount
          ],
          provider: request.platform,
          timestamp: Date.now(),
          nullifier: `0x${Math.random().toString(16).substring(2, 66)}`,
          payeeHash: `0x${Math.random().toString(16).substring(2, 66)}`
        }

        this.proofs.set(proofId, proofData)

        resolve({
          success: true,
          proofId,
          proof: proofData
        })
      }, 3000) // Simulate proof generation time
    })
  }

  async fetchProofById(proofId: string): Promise<ProofData | null> {
    return this.proofs.get(proofId) || null
  }

  logger = {
    info: (message: string, data?: any) => {
      console.log(`[ZKTLS] ${message}`, data || '')
    },
    warn: (message: string, data?: any) => {
      console.warn(`[ZKTLS] ${message}`, data || '')
    },
    error: (message: string, data?: any) => {
      console.error(`[ZKTLS] ${message}`, data || '')
    }
  }

  // Check if extension is installed
  get isExtensionInstalled(): boolean {
    return this.isInstalled
  }

  // Check if connected
  get isConnected(): boolean {
    return this.connection?.isConnected || false
  }
}

// Install the shim on window object
declare global {
  interface Window {
    zktls: ZKTLSShim
  }
}

// Initialize the shim
if (typeof window !== 'undefined') {
  window.zktls = new ZKTLSShim()
}

export default ZKTLSShim