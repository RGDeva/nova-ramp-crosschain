import React, { createContext, useContext, useEffect, useState } from 'react'
import { PrivyProvider as PrivyAuth, usePrivy } from '@privy-io/react-auth'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient()

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: () => void
  logout: () => void
  primaryAddress: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a PrivyProvider')
  }
  return context
}

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticated, user, login, logout } = usePrivy()
  const [primaryAddress, setPrimaryAddress] = useState<string | null>(null)

  useEffect(() => {
    if (user?.wallet?.address) {
      setPrimaryAddress(user.wallet.address)
    }
  }, [user])

  const contextValue: AuthContextType = {
    isAuthenticated: authenticated,
    user,
    login,
    logout,
    primaryAddress,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

interface PrivyProviderProps {
  children: React.ReactNode
}

export const PrivyProvider: React.FC<PrivyProviderProps> = ({ children }) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID

  if (!appId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Missing Privy App ID. Please check your environment variables.</p>
      </div>
    )
  }

  return (
    <PrivyAuth
      appId={appId}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
          priceDisplay: {
            primary: 'fiat-currency',
            secondary: 'native-token'
          }
        },
        appearance: {
          theme: 'dark',
          accentColor: '#7C3AED',
          showWalletLoginFirst: false,
        },
        loginMethods: ['email', 'wallet'],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyAuth>
  )
}