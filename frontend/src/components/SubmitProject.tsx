import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { api } from '../lib/api'
import { CSV_EXAMPLE, CSV_HEADER, MAX_TREES, parseTreeCsv } from '../lib/csv'
import { registryAbi } from '../lib/abi'
import { REGISTRY_ADDRESS } from '../lib/registry'
import { MST_CHAIN_ID } from '../config/chain'
import { errorMessage } from '../lib/format'
import { useTx } from '../hooks/useRegistry'
import { TxStatus } from './Tx'
import {
  FileText,
  Upload,
  CheckCircle,
  FileCode2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Trees,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

type Step = 'idle' | 'validating' | 'signing' | 'uploading' | 'chain'
const STEP_TEXT: Record<Step, string> = {
  idle: '',
  validating: 'Checking tree dataset integrity…',
  signing: 'Sign authentication message in your wallet (free, no gas)…',
  uploading: 'Computing Merkle tree & storing dataset payload…',
  chain: 'Broadcasting submitProject to MST Testnet…',
}

export function SubmitProject({ locked }: { locked: boolean }) {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const tx = useTx()
  const toast = useToast()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [csv, setCsv] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState('')

  const working = step !== 'idle' || tx.busy

  const handleLoadSampleData = () => {
    setName('Sahyadri Teak & Bamboo Canopy Initiative')
    setLocation('Pune District, Maharashtra, IN')
    setCsv(CSV_EXAMPLE)
    toast.info('Sample Data Loaded', 'Ready for Merkle validation and on-chain submission.')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address || working) return
    setError('')
    tx.reset()

    const n = name.trim()
    const l = location.trim()
    if (!n || n.length > 100) return setError('Project name must be 1–100 characters.')
    if (!l || l.length > 100) return setError('Location must be 1–100 characters.')

    let current: Step = 'validating'
    try {
      setStep('validating')
      const trees = parseTreeCsv(csv)
      const prepared = await api.prepare(address, trees)

      current = 'signing'
      setStep('signing')
      const signature = await signMessageAsync({ message: prepared.message })

      current = 'uploading'
      setStep('uploading')
      await api.upload(address, trees, prepared.issuedAt, signature)

      current = 'chain'
      setStep('chain')
      await tx.writeAsync({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: 'submitProject',
        args: [n, l, prepared.treeCount, prepared.root, prepared.dataHash, api.datasetUrl(prepared.root)],
        chainId: MST_CHAIN_ID,
      })

      setName('')
      setLocation('')
      setCsv('')
      toast.success('Project Registered', 'Your tree dataset has been submitted to the verifier queue.')
    } catch (err) {
      if (current !== 'chain') setError(errorMessage(err))
    } finally {
      setStep('idle')
    }
  }

  return (
    <div className="submit-project-view max-w-3xl">
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Submit Tree-Planting Project</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Cryptographic Ingestion
            </span>
          </div>
          <p className="dashboard-subtitle">
            Upload your GPS-tagged tree inventory. Verifiers will mathematically audit random tree leaves against your on-chain Merkle root.
          </p>
        </div>
      </div>

      <div className="dashboard-panel">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <fieldset disabled={locked || working} className="space-y-5 border-0 p-0 m-0">
            {/* Project Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Name</label>
              <input
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sahyadri Native Teak Sanctuary"
                className="input-field"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Location</label>
              <input
                value={location}
                maxLength={100}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra, IN"
                className="input-field"
                required
              />
            </div>

            {/* Tree CSV Data */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Tree Data CSV (Up to {MAX_TREES.toLocaleString()} trees)
                </label>
                <button
                  type="button"
                  className="btn-outline-sm text-emerald-400 border-emerald-500/30"
                  onClick={handleLoadSampleData}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Load Verified Sample CSV
                </button>
              </div>

              <textarea
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                rows={8}
                placeholder={CSV_EXAMPLE}
                spellCheck={false}
                className="input-field font-mono text-xs leading-relaxed"
                required
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Required Header: <code>{CSV_HEADER}</code></span>
                <span>Lat: -90 to 90 • Lon: -180 to 180</span>
              </div>
            </div>

            {/* Progress status if in flight */}
            {working && (
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <div className="spinner-emerald w-4 h-4 shrink-0" />
                <span className="text-xs text-emerald-300 font-medium">{STEP_TEXT[step] || 'Processing…'}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={locked || working}
              className="btn-primary-action w-full justify-center py-2.5"
            >
              <Trees className="w-4 h-4 mr-2" />
              {working ? 'Processing Project…' : 'Validate & Register on MST Testnet'}
            </button>
          </fieldset>
        </form>

        <TxStatus state={tx.state} hash={tx.hash} error={tx.error} />
      </div>
    </div>
  )
}
