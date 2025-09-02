import { http, createConfig } from 'wagmi'
import { base, avalancheFuji } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = 'your-wallet-connect-project-id'

export const config = createConfig({
  chains: [base, avalancheFuji],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'INoVA Ramp',
    }),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [base.id]: http(import.meta.env.VITE_BASE_RPC),
    [avalancheFuji.id]: http(import.meta.env.VITE_FUJI_RPC),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}