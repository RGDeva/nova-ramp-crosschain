// Mock contract interfaces and ABIs for INoVA Escrow system
// In production, these would be generated from actual deployed contracts

export const INOVA_CONTRACTS = {
  // Base mainnet (production)
  8453: {
    escrow: '0x1234567890123456789012345678901234567890',
    nullifierRegistry: '0x2345678901234567890123456789012345678901',
    verifiers: {
      venmo: '0x3456789012345678901234567890123456789012',
      cashapp: '0x4567890123456789012345678901234567890123',
      revolut: '0x5678901234567890123456789012345678901234',
      wise: '0x6789012345678901234567890123456789012345',
      zelle: '0x7890123456789012345678901234567890123456'
    },
    usdc: '0x833589fCD6eDb6E08f4c7C32d4f71b54bdA02913'
  },
  // Avalanche Fuji (demo)
  43113: {
    escrow: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    nullifierRegistry: '0xbcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    verifiers: {
      venmo: '0xcdefabcdefabcdefabcdefabcdefabcdefabcdefab',
      cashapp: '0xdefabcdefabcdefabcdefabcdefabcdefabcdefabc',
      revolut: '0xefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      wise: '0xfabcdefabcdefabcdefabcdefabcdefabcdefabcde',
      zelle: '0x1bcdefabcdefabcdefabcdefabcdefabcdefabcdef'
    },
    usdc: '0x5425890298aed601595a70AB815c96711a31Bc65'
  }
}

export const ESCROW_ABI = [
  {
    "inputs": [
      { "name": "depositId", "type": "bytes32" },
      { "name": "amount", "type": "uint256" },
      { "name": "to", "type": "address" },
      { "name": "verifier", "type": "address" },
      { "name": "fiatHash", "type": "bytes32" },
      { "name": "gatingSig", "type": "bytes" }
    ],
    "name": "signalIntent",
    "outputs": [{ "name": "intentHash", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "proofBytes", "type": "bytes" },
      { "name": "intentHash", "type": "bytes32" }
    ],
    "name": "fulfillIntent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "verifier", "type": "address" },
      { "name": "payeeHash", "type": "bytes32" }
    ],
    "name": "createDeposit",
    "outputs": [{ "name": "depositId", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "depositId", "type": "bytes32" }],
    "name": "getDeposit",
    "outputs": [
      { "name": "maker", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "verifier", "type": "address" },
      { "name": "payeeHash", "type": "bytes32" },
      { "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const VERIFIER_ABI = [
  {
    "inputs": [
      { "name": "proofBytes", "type": "bytes" },
      { "name": "intentHash", "type": "bytes32" },
      { "name": "fiatAmount", "type": "uint256" },
      { "name": "payeeHash", "type": "bytes32" }
    ],
    "name": "verifyProof",
    "outputs": [{ "name": "isValid", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "nullifier", "type": "bytes32" }],
    "name": "isNullifierUsed",
    "outputs": [{ "name": "used", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
]

export const NULLIFIER_REGISTRY_ABI = [
  {
    "inputs": [{ "name": "nullifier", "type": "bytes32" }],
    "name": "isNullifierUsed",
    "outputs": [{ "name": "used", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "nullifier", "type": "bytes32" }],
    "name": "markNullifierUsed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const ERC20_ABI = [
  {
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
]

// Helper functions for contract interactions
export const getContractAddresses = (chainId: number) => {
  return INOVA_CONTRACTS[chainId as keyof typeof INOVA_CONTRACTS] || INOVA_CONTRACTS[8453]
}

export const getVerifierAddress = (chainId: number, provider: string) => {
  const contracts = getContractAddresses(chainId)
  return contracts.verifiers[provider as keyof typeof contracts.verifiers] || contracts.verifiers.venmo
}

// Mock proof generation for demo purposes
export const generateMockProof = (intentHash: string, provider: string) => {
  return {
    proof: {
      pi_a: [`0x${Math.random().toString(16).substring(2)}`, `0x${Math.random().toString(16).substring(2)}`],
      pi_b: [[`0x${Math.random().toString(16).substring(2)}`, `0x${Math.random().toString(16).substring(2)}`], [`0x${Math.random().toString(16).substring(2)}`, `0x${Math.random().toString(16).substring(2)}`]],
      pi_c: [`0x${Math.random().toString(16).substring(2)}`, `0x${Math.random().toString(16).substring(2)}`]
    },
    publicSignals: [
      intentHash,
      `0x${Math.random().toString(16).substring(2)}`, // nullifier
      `0x${Math.random().toString(16).substring(2)}`, // payeeHash
      Math.floor(Math.random() * 1000000).toString() // amount
    ],
    provider,
    timestamp: Date.now()
  }
}

// Encode proof to bytes for contract call
export const encodeProofToBytes = (proof: any): string => {
  return '0x' + Buffer.from(JSON.stringify(proof), 'utf8').toString('hex')
}