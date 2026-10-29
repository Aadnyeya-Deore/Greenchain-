import { useState } from 'react'
import { isAddress, zeroAddress, type Address } from 'viem'
import { registryAbi } from '../lib/abi'
import { REGISTRY_ADDRESS, STATUS, STATUS_LABEL, type ProjectWithId } from '../lib/registry'
import { MST_CHAIN_ID, explorerAddress } from '../config/chain'
import { formatDate, formatNumber, shortAddress } from '../lib/format'
import { useBalance1155, useCreditValid, useTx } from '../hooks/useRegistry'
import { api } from '../lib/api'
import { TxStatus } from './Tx'
import {
  MapPin,
  Trees,
  Calendar,
  ExternalLink,
  Flame,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileCode2,
} from 'lucide-react'

interface Props {
  project: ProjectWithId
  account: Address
  /** True when the wallet is on the wrong network or the contract is paused. */
  locked: boolean
}

export function ProjectCard({ project: p, account, locked }: Props) {
  const balance = useBalance1155(account, p.id)
  const valid = useCreditValid(p.id)
  const tx = useTx()
  const [mode, setMode] = useState<'retire' | 'transfer'>('retire')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [to, setTo] = useState('')
  const [formError, setFormError] = useState('')

  const isOwner = p.owner.toLowerCase() === account.toLowerCase()
  const held = balance.data ?? 0n
  const isValid = valid.data === true
  const canClaim = isOwner && p.status === STATUS.Verified && !p.claimed && isValid
  const expired = p.status === STATUS.Verified && !isValid

  function claim() {
    setFormError('')
    tx.write({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: 'claimCredits',
      args: [p.id],
      chainId: MST_CHAIN_ID,
    })
  }

  function useCredits(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!/^[1-9]\d*$/.test(amount)) return setFormError('Enter a whole number of credits greater than zero.')
    const value = BigInt(amount)
    if (value > held) return setFormError(`You only hold ${formatNumber(held)} credits from this project.`)

    if (mode === 'retire') {
      const why = reason.trim()
      if (!why || why.length > 256) return setFormError('Add a reason (1–256 characters), e.g. “2026 flight emissions”.')
      tx.write({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: 'retireCredits',
        args: [p.id, value, why],
        chainId: MST_CHAIN_ID,
      })
    } else {
      if (!isAddress(to) || to.toLowerCase() === zeroAddress) return setFormError('Enter a valid recipient address.')
      if (to.toLowerCase() === account.toLowerCase()) return setFormError('You cannot send credits to yourself.')
      tx.write({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: 'safeTransferFrom',
        args: [account, to, p.id, value, '0x'],
        chainId: MST_CHAIN_ID,
      })
    }
  }

  return (
    <article className={`project-item-card status-border-${p.status}`}>
      {/* Header */}
      <div className="project-card-header">
        <div>
          <div className="flex items-center gap-2">
            <span className="project-id-chip">#{p.id.toString()}</span>
            <h3 className="project-item-title">{p.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{p.location}</span>
          </div>
        </div>

        <span className={`badge-status status-pill-${p.status}`}>
          {p.status === STATUS.Verified ? (
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          ) : p.status === STATUS.Pending ? (
            <Clock className="w-3.5 h-3.5 mr-1" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
          )}
          {expired ? 'Expired' : STATUS_LABEL[p.status] ?? 'Unknown'}
        </span>
      </div>

      {/* Grid of Key Facts */}
      <div className="project-facts-grid">
        <div className="fact-box">
          <span className="fact-label">Trees Submitted</span>
          <span className="fact-val">{formatNumber(p.submittedTreeCount)}</span>
        </div>

        {p.status >= STATUS.Verified && (
          <div className="fact-box">
            <span className="fact-label">Trees Approved</span>
            <span className="fact-val text-lime-400">{formatNumber(p.verifiedTreeCount)}</span>
          </div>
        )}

        {p.status >= STATUS.Verified && (
          <div className="fact-box">
            <span className="fact-label">Credits (kg CO₂e)</span>
            <span className="fact-val text-emerald-400">{formatNumber(p.creditsIssued)}</span>
          </div>
        )}

        <div className="fact-box">
          <span className="fact-label">Your Balance</span>
          <span className="fact-val text-white">{formatNumber(held)} kg</span>
        </div>

        <div className="fact-box col-span-2">
          <span className="fact-label">Project Owner</span>
          <div className="flex items-center justify-between mt-0.5">
            <a
              href={explorerAddress(p.owner)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-emerald-300 hover:underline flex items-center gap-1"
            >
              {shortAddress(p.owner)}
              {isOwner && ' (You)'}
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={api.datasetUrl(p.treeDataRoot)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <FileCode2 className="w-3 h-3 text-emerald-400" />
              Dataset JSON
            </a>
          </div>
        </div>
      </div>

      {/* Owner Claim Action */}
      {canClaim && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-300 font-semibold">Verification Complete</span>
            <span className="badge-demo">Ready to Claim</span>
          </div>
          <button
            className="btn-primary-action w-full justify-center"
            disabled={locked || tx.busy}
            onClick={claim}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {tx.busy ? 'Claiming on-chain…' : `Mint & Claim ${formatNumber(p.creditsIssued)} Credits`}
          </button>
        </div>
      )}

      {/* Credit Actions: Retire or Transfer */}
      {held > 0n && isValid && (
        <form className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-3" onSubmit={useCredits} noValidate>
          <div className="action-toggle-seg">
            <button
              type="button"
              className={`action-seg-btn ${mode === 'retire' ? 'active' : ''}`}
              onClick={() => setMode('retire')}
            >
              <Flame className="w-3.5 h-3.5 mr-1" />
              Retire
            </button>
            <button
              type="button"
              className={`action-seg-btn ${mode === 'transfer' ? 'active' : ''}`}
              onClick={() => setMode('transfer')}
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Transfer
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Quantity (kg CO₂e)</label>
            <input
              type="number"
              min="1"
              max={held.toString()}
              value={amount}
              onChange={(e) => setAmount(e.target.value.trim())}
              placeholder={`Max: ${held.toString()}`}
              className="input-field text-xs"
            />
          </div>

          {mode === 'retire' ? (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Offset Reason</label>
              <input
                value={reason}
                maxLength={256}
                onChange={(e) => setReason(e.target.value)}
                placeholder="What are you offsetting?"
                className="input-field text-xs"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Recipient Address (0x…)</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value.trim())}
                placeholder="0x…"
                spellCheck={false}
                className="input-field text-xs font-mono"
              />
            </div>
          )}

          <button className="btn-secondary-subtle w-full justify-center py-2" disabled={locked || tx.busy}>
            {mode === 'retire' ? 'Permanently Burn Credits' : 'Send Credits'}
          </button>
        </form>
      )}

      {held > 0n && !isValid && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Credits frozen: project is {expired ? 'past its validity date' : STATUS_LABEL[p.status].toLowerCase()}.</span>
        </div>
      )}

      {formError && <p className="tx-status-box tx-error mt-2">{formError}</p>}
      <TxStatus state={tx.state} hash={tx.hash} error={tx.error} />
    </article>
  )
}
