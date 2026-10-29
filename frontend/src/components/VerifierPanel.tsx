import { useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Address } from 'viem'
import { registryAbi } from '../lib/abi'
import { REGISTRY_ADDRESS, STATUS, type ProjectWithId } from '../lib/registry'
import { MST_CHAIN_ID, explorerAddress } from '../config/chain'
import { api } from '../lib/api'
import { errorMessage, formatNumber, shortAddress } from '../lib/format'
import { useProjects, useTx } from '../hooks/useRegistry'
import { TxStatus } from './Tx'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
  ExternalLink,
  Check,
  Trees,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

interface Check { ok: boolean; text: string }
const SAMPLE_SIZE = 5

function pickSample(ids: string[], n: number): string[] {
  const pool = [...ids]
  const out: string[] = []
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  return out
}

function ReviewCard({ project: p, account, locked }: { project: ProjectWithId; account: Address; locked: boolean }) {
  const client = usePublicClient({ chainId: MST_CHAIN_ID })
  const tx = useTx()
  const toast = useToast()
  const [checks, setChecks] = useState<Check[] | null>(null)
  const [auditing, setAuditing] = useState(false)
  const [approved, setApproved] = useState(p.submittedTreeCount.toString())
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const isOwner = p.owner.toLowerCase() === account.toLowerCase()
  const passed = !!checks && checks.every((c) => c.ok)
  const pending = p.status === STATUS.Pending

  async function audit() {
    setAuditing(true)
    setError('')
    setChecks(null)
    const out: Check[] = []
    try {
      const ds = await api.dataset(p.treeDataRoot)
      out.push({ ok: ds.root.toLowerCase() === p.treeDataRoot.toLowerCase(), text: 'Stored dataset matches on-chain Merkle root' })
      out.push({ ok: ds.dataHash.toLowerCase() === p.evidenceHash.toLowerCase(), text: 'Evidence hash matches stored dataset' })
      out.push({ ok: ds.submitter.toLowerCase() === p.owner.toLowerCase(), text: 'Dataset signed by verified project owner' })
      out.push({ ok: ds.treeCount === p.submittedTreeCount, text: `Tree count matches exactly (${ds.treeCount} trees)` })

      if (!client) throw new Error('No connection to MST Testnet.')
      const sample = pickSample(ds.trees.map((t) => t.treeId), SAMPLE_SIZE)
      let good = 0
      for (const id of sample) {
        const pr = await api.proof(p.treeDataRoot, id)
        const inTree = await client.readContract({
          address: REGISTRY_ADDRESS,
          abi: registryAbi,
          functionName: 'verifyTreeRecord',
          args: [p.id, pr.leaf, pr.proof],
        })
        if (inTree) good++
      }
      out.push({ ok: good === sample.length, text: `${good}/${sample.length} randomly sampled trees cryptographically proven on-chain` })
      toast.success('Audit Completed', `${good}/${sample.length} on-chain proofs verified.`)
    } catch (e) {
      out.push({ ok: false, text: errorMessage(e) })
      toast.error('Audit Verification Issue', errorMessage(e))
    } finally {
      setChecks(out)
      setAuditing(false)
    }
  }

  function approve() {
    setError('')
    if (!/^[1-9]\d*$/.test(approved) || BigInt(approved) > BigInt(p.submittedTreeCount)) {
      return setError(`Approve between 1 and ${p.submittedTreeCount} trees.`)
    }
    tx.write({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: 'verifyProject',
      args: [p.id, Number(approved)],
      chainId: MST_CHAIN_ID,
    })
  }

  function decide(fn: 'rejectProject' | 'revokeProject') {
    setError('')
    const why = reason.trim()
    if (!why || why.length > 256) return setError('Give a reason (1–256 characters).')
    tx.write({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: fn,
      args: [p.id, why],
      chainId: MST_CHAIN_ID,
    })
  }

  return (
    <article className="dashboard-panel space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="project-id-chip">#{p.id.toString()}</span>
            <h3 className="text-base font-bold text-white">{p.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{p.location} • Submitted by {shortAddress(p.owner)}</p>
        </div>
        <span className={`badge-status status-pill-${p.status}`}>
          {p.status === STATUS.Pending ? 'Pending Audit' : p.status === STATUS.Verified ? 'Verified' : 'Revoked'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Trees Submitted</span>
          <span className="font-semibold text-white">{formatNumber(p.submittedTreeCount)}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Status</span>
          <span className="font-semibold text-emerald-400">{pending ? 'Awaiting Review' : 'Processed'}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 col-span-2">
          <span className="text-slate-400 block mb-0.5">Merkle Root</span>
          <span className="font-mono text-emerald-300 truncate block text-[11px]">{p.treeDataRoot}</span>
        </div>
      </div>

      {isOwner && (
        <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300">
          Conflict of interest: You own this project and cannot approve it. Another verifier node must audit it.
        </div>
      )}

      {/* Audit Checklist */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Cryptographic Verification Protocol</span>
          <button
            className="btn-outline-sm text-emerald-400 border-emerald-500/30"
            disabled={auditing || locked}
            onClick={audit}
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1 ${auditing ? 'animate-spin' : ''}`} />
            {auditing ? 'Verifying Proofs…' : checks ? 'Re-run Checks' : 'Run Automated Audit'}
          </button>
        </div>

        {checks && (
          <ul className="space-y-2 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
            {checks.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {c.ok ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className={c.ok ? 'text-slate-300' : 'text-rose-300 font-semibold'}>{c.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Decision Section */}
      {!isOwner && pending && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-400 block mb-1">Approved Trees</label>
              <input
                type="number"
                min="1"
                max={p.submittedTreeCount.toString()}
                value={approved}
                onChange={(e) => setApproved(e.target.value.trim())}
                className="input-field text-xs"
              />
            </div>
            <button
              className="btn-primary-action mt-5"
              disabled={!passed || locked || tx.busy}
              onClick={approve}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Approve Project
            </button>
          </div>

          <div className="pt-2">
            <label className="text-xs text-slate-400 block mb-1">Reason for Rejection</label>
            <div className="flex items-center gap-2">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Required if rejecting (e.g. Invalid coordinates)"
                className="input-field text-xs"
              />
              <button
                className="btn-outline-sm text-rose-400 border-rose-500/30 hover:bg-rose-950/20 shrink-0"
                disabled={locked || tx.busy}
                onClick={() => decide('rejectProject')}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
      <TxStatus state={tx.state} hash={tx.hash} error={tx.error} />
    </article>
  )
}

export function VerifierPanel({ account, locked }: { account: Address; locked: boolean }) {
  const { projects, isLoading } = useProjects()
  const pending = projects.filter((p) => p.status === STATUS.Pending)

  return (
    <div className="verifier-desk-view space-y-6">
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Verifier Audit Desk</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              {pending.length} Pending Audits
            </span>
          </div>
          <p className="dashboard-subtitle">
            Authoritative node interface for verifying Merkle roots, leaf hashes, and on-chain tree existence proofs.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="p-8 text-center text-slate-400">Loading audit queue from MST Testnet…</div>
      )}

      {!isLoading && pending.length === 0 && (
        <div className="empty-state-card py-12">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="empty-title">Audit Queue Clean</h3>
          <p className="empty-description">All registered tree datasets have been audited and decided.</p>
        </div>
      )}

      <div className="space-y-4">
        {pending.map((p) => (
          <ReviewCard key={p.id.toString()} project={p} account={account} locked={locked} />
        ))}
      </div>
    </div>
  )
}
