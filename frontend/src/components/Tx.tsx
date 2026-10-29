import { explorerTx } from '../config/chain'
import { shortHash } from '../lib/format'
import { ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Props {
  state: 'idle' | 'signing' | 'confirming' | 'success' | 'error'
  hash?: string
  error?: string
  successText?: string
}

export function TxStatus({ state, hash, error, successText = 'Transaction confirmed on MST Testnet.' }: Props) {
  if (state === 'idle') return null

  return (
    <div className={`tx-status-box tx-${state}`} role={state === 'error' ? 'alert' : 'status'}>
      <div className="flex items-center gap-2">
        {state === 'signing' && <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />}
        {state === 'confirming' && <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />}
        {state === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
        {state === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}

        <div className="text-xs">
          {state === 'signing' && 'Confirm signature in your wallet…'}
          {state === 'confirming' && 'Broadcasting & waiting for MST Testnet block confirmation…'}
          {state === 'success' && successText}
          {state === 'error' && (error || 'Transaction failed on-chain.')}
        </div>
      </div>

      {hash && state !== 'signing' && (
        <a
          href={explorerTx(hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono shrink-0 ml-auto"
        >
          <span>{shortHash(hash)}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  )
}
