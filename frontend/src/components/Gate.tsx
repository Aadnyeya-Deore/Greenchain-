import { useAppKit } from '@reown/appkit/react'

export function Gate() {
  const { open } = useAppKit()
  return (
    <section className="gate" aria-labelledby="gate-title">
      <h2 id="gate-title">Sign in to open the registry</h2>
      <p>
        Use your Google account or any wallet. Everything else in the app stays locked until you have signed in, and
        your account address is shown at the top once you do.
      </p>
      <button className="btn primary" onClick={() => open({ view: 'Connect' })}>
        Sign in
      </button>
      <ul className="gate-notes">
        <li>Google sign-in creates a wallet for you. No extension needed.</li>
        <li>Already have a wallet? Choose MetaMask, BridgeKey or any WalletConnect wallet.</li>
        <li>This is a testnet. Nothing here has real monetary value.</li>
      </ul>
    </section>
  )
}
