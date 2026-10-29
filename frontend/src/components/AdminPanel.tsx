import { useState } from 'react'
import { isAddress, zeroAddress } from 'viem'
import { registryAbi } from '../lib/abi'
import { REGISTRY_ADDRESS, VERIFIER_ROLE } from '../lib/registry'
import { MST_CHAIN_ID } from '../config/chain'
import { useTx } from '../hooks/useRegistry'
import { TxStatus } from './Tx'
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Power,
  Sliders,
  AlertTriangle,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

export function AdminPanel({
  paused,
  creditsPerTree,
  locked,
}: {
  paused: boolean
  creditsPerTree?: bigint
  locked: boolean
}) {
  const tx = useTx()
  const toast = useToast()
  const [verifier, setVerifier] = useState('')
  const [rate, setRate] = useState('')
  const [error, setError] = useState('')

  function role(fn: 'grantRole' | 'revokeRole') {
    setError('')
    if (!isAddress(verifier) || verifier.toLowerCase() === zeroAddress) {
      return setError('Enter a valid wallet address.')
    }
    tx.write({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: fn,
      args: [VERIFIER_ROLE, verifier],
      chainId: MST_CHAIN_ID,
    })
  }

  function setRateTx() {
    setError('')
    if (!/^[1-9]\d{0,3}$/.test(rate) || Number(rate) > 1000) {
      return setError('Enter a whole number from 1 to 1000.')
    }
    tx.write({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: 'setCreditsPerTree',
      args: [BigInt(rate)],
      chainId: MST_CHAIN_ID,
    })
  }

  return (
    <div className="admin-panel-view space-y-6">
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Governance & Administration</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Super Admin Mode
            </span>
          </div>
          <p className="dashboard-subtitle">
            Configure system-wide parameters, grant/revoke verifier node keys, and control emergency stop circuits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Verifier Role Management */}
        <div className="dashboard-panel">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Authorize Verifier Node</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Grant or revoke cryptographic audit privileges to an auditor wallet address.
          </p>

          <div className="space-y-3">
            <input
              value={verifier}
              onChange={(e) => setVerifier(e.target.value.trim())}
              placeholder="Verifier address (0x…)"
              spellCheck={false}
              className="input-field text-xs font-mono"
            />
            <div className="flex items-center gap-2">
              <button
                className="btn-primary-action flex-1 justify-center py-2"
                disabled={locked || tx.busy}
                onClick={() => role('grantRole')}
              >
                Grant Role
              </button>
              <button
                className="btn-outline-sm text-rose-400 border-rose-500/30 hover:bg-rose-950/20 py-2"
                disabled={locked || tx.busy}
                onClick={() => role('revokeRole')}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Credit Rate Modifier */}
        <div className="dashboard-panel">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white">Credits Per Tree Rate</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Currently set to <strong>{creditsPerTree?.toString() ?? '10'} kg CO₂e</strong> per approved tree.
          </p>

          <div className="space-y-3">
            <input
              type="number"
              min="1"
              max="1000"
              value={rate}
              onChange={(e) => setRate(e.target.value.trim())}
              placeholder="New rate (1–1000 kg)"
              className="input-field text-xs"
            />
            <button
              className="btn-secondary-subtle w-full justify-center py-2"
              disabled={locked || tx.busy}
              onClick={setRateTx}
            >
              Update Conversion Rate
            </button>
          </div>
        </div>

        {/* Emergency Stop Circuit */}
        <div className="dashboard-panel">
          <div className="flex items-center gap-2 mb-3">
            <Power className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Emergency Stop Circuit</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            {paused
              ? 'The registry is PAUSED. All submissions, reviews, transfers, and burns are frozen.'
              : 'Pausing immediately stops project submissions, audits, transfers, and token mints.'}
          </p>

          <button
            className={`w-full justify-center py-2 font-semibold text-xs rounded-lg transition-all ${
              paused
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center gap-2'
            }`}
            disabled={tx.busy || (locked && !paused)}
            onClick={() =>
              tx.write({
                address: REGISTRY_ADDRESS,
                abi: registryAbi,
                functionName: paused ? 'unpause' : 'pause',
                chainId: MST_CHAIN_ID,
              })
            }
          >
            <Power className="w-4 h-4" />
            {paused ? 'Resume Registry Operations' : 'Activate Emergency Stop'}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
      <TxStatus state={tx.state} hash={tx.hash} error={tx.error} />
    </div>
  )
}
