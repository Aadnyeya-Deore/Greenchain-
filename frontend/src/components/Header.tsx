import { useState } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { explorerAddress, MST_CHAIN_ID } from '../config/chain'
import { shortAddress } from '../lib/format'

export function Header() {
  const { address, isConnected, status, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const balance = useBalance({ address, chainId: MST_CHAIN_ID, query: { enabled: !!address, refetchInterval: 20_000 } })
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be blocked; the address is still visible */
    }
  }

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <h1>CarbonLedger</h1>
          <p>Verified tree carbon credits · MST Testnet</p>
        </div>
      </div>

      {isConnected && address ? (
        <div className="account" aria-label="Signed-in account">
          <div className="account-line">
            <span className={`dot ${chainId === MST_CHAIN_ID ? 'ok' : 'warn'}`} aria-hidden="true" />
            <code className="address" title={address}>
              <span className="address-full">{address}</span>
              <span className="address-short">{shortAddress(address)}</span>
            </code>
          </div>
          <div className="account-actions">
            {balance.data && (
              <span className="balance">
                {Number(balance.data.formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })} {balance.data.symbol}
              </span>
            )}
            <button className="link" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            <a className="link" href={explorerAddress(address)} target="_blank" rel="noopener noreferrer">Explorer</a>
            <button className="link" onClick={() => open({ view: 'Account' })}>Wallet</button>
            <button className="link" onClick={() => disconnect()}>Sign out</button>
          </div>
        </div>
      ) : (
        <button className="btn primary" disabled={status === 'connecting' || status === 'reconnecting'} onClick={() => open({ view: 'Connect' })}>
          {status === 'connecting' || status === 'reconnecting' ? 'Connecting…' : 'Sign in'}
        </button>
      )}
    </header>
  )
}
