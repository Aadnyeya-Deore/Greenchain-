import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { activeWagmiConfig } from './config/wagmi'
import App from './App'
import './styles.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Carbon Ledger App Crash:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a120e',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h2 style={{ color: '#f87171', margin: '0 0 1rem', fontSize: '1.25rem' }}>
              Application Render Issue
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {this.state.error?.message || 'An unexpected error occurred during rendering.'}
            </p>
            <pre style={{
              background: '#000',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#34d399',
              overflowX: 'auto',
              maxHeight: '200px'
            }}>
              {this.state.error?.stack || 'No stack trace available'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.25rem',
                padding: '0.6rem 1.25rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reload Platform
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5_000,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={activeWagmiConfig as any}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
