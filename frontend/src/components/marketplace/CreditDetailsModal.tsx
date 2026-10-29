import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  Trees,
  MapPin,
  Calendar,
  FileCode2,
  ExternalLink,
  Flame,
  ArrowRight,
  Check,
  Copy,
  Layers,
  Leaf,
  Coins,
  ShieldAlert,
} from 'lucide-react'
import { MarketplaceItem } from '../../lib/mockData'
import { formatNumber, formatCurrency, formatTons, shortAddress, shortHash } from '../../lib/format'
import { explorerAddress, explorerTx, MST_CHAIN_ID } from '../../config/chain'
import { api } from '../../lib/api'
import { useTx, useBalance1155, useCreditValid } from '../../hooks/useRegistry'
import { REGISTRY_ADDRESS } from '../../lib/registry'
import { registryAbi } from '../../lib/abi'
import { useToast } from '../../context/ToastContext'
import type { Address } from 'viem'

interface CreditDetailsModalProps {
  item: MarketplaceItem | null
  onClose: () => void
  account?: string
  locked?: boolean
}

export function CreditDetailsModal({ item, onClose, account, locked }: CreditDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'actions'>('overview')
  const [actionType, setActionType] = useState<'retire' | 'transfer' | 'buy'>('retire')
  const [retireAmount, setRetireAmount] = useState('100')
  const [retireReason, setRetireReason] = useState('Corporate offset 2026')
  const [recipient, setRecipient] = useState('')
  const [buyAmount, setBuyAmount] = useState('500')
  const [copiedRoot, setCopiedRoot] = useState(false)
  const [copiedEvidence, setCopiedEvidence] = useState(false)
  const toast = useToast()

  const tx = useTx()

  if (!item) return null

  // If this item maps to an on-chain project ID, we can read user balance
  const onChainId = item.onChainId ?? 1n

  const copyText = async (text: string, type: 'root' | 'evidence') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'root') {
        setCopiedRoot(true)
        setTimeout(() => setCopiedRoot(false), 2000)
      } else {
        setCopiedEvidence(true)
        setTimeout(() => setCopiedEvidence(false), 2000)
      }
      toast.success('Hash copied to clipboard', shortHash(text))
    } catch {
      toast.info('Hash', text)
    }
  }

  const handleRetire = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account) {
      toast.error('Wallet not connected', 'Please connect your Web3 wallet first.')
      return
    }

    const amt = BigInt(retireAmount || '0')
    if (amt <= 0n) {
      toast.error('Invalid amount', 'Please enter a valid credit amount to retire.')
      return
    }

    try {
      await tx.writeAsync({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: 'retireCredits',
        args: [onChainId, amt, retireReason || 'Verified voluntary offset'],
        chainId: MST_CHAIN_ID,
      })
      toast.success('Retirement transaction submitted', `${amt} kg CO₂e burned permanently`)
    } catch (err: any) {
      toast.error('Transaction Failed', err?.shortMessage || err?.message || 'Could not retire credits')
    }
  }

  const handleSimulateBuy = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(
      'Order Confirmed',
      `Purchased ${buyAmount} credits for ${(Number(buyAmount) * item.pricePerCredit).toFixed(3)} tMSTC.`
    )
    setActiveTab('overview')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Hero Image */}
        <div
          className="credit-modal-hero"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 18, 14, 0.4), #0c1712), url(${item.image})` }}
        >
          <div className="credit-modal-hero-top">
            <div className="flex items-center gap-2">
              <span className="badge-category">{item.category}</span>
              <span className="badge-status-verified">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {item.status}
              </span>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close dialog">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="credit-modal-hero-bottom">
            <h2 className="credit-modal-title">{item.name}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Vintage {item.vintage}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="credit-modal-tabs">
          <button
            className={`credit-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Project Overview
          </button>
          <button
            className={`credit-tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            Blockchain Verification
          </button>
          <button
            className={`credit-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Buy & Retire Credits
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body credit-modal-body">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="credit-stat-tile">
                  <span className="text-xs text-slate-400">Available Credits</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {formatNumber(item.availableCredits)} <span className="text-xs text-emerald-400 font-normal">kg CO₂e</span>
                  </div>
                </div>

                <div className="credit-stat-tile">
                  <span className="text-xs text-slate-400">Price / Credit</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(item.pricePerCredit)}
                  </div>
                  <span className="text-[10px] text-slate-400">≈ ${item.usdPrice} USD</span>
                </div>

                <div className="credit-stat-tile">
                  <span className="text-xs text-slate-400">Trees Registered</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {formatNumber(item.treeCount)} <span className="text-xs text-lime-400 font-normal">trees</span>
                  </div>
                </div>

                <div className="credit-stat-tile">
                  <span className="text-xs text-slate-400">Annual CO₂ Reduction</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {item.co2ReductionPerYear} <span className="text-xs text-slate-400 font-normal">t/yr</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Project Description & Methodology
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                  <strong>Approved Standard:</strong> {item.methodology}
                </div>
              </div>

              {/* Impact Highlights */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Ecological Co-Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.impactHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-200">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="verifier-box">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Independent Verifier</span>
                  <span className="badge-verifier-node">Authorized Node</span>
                </div>
                <div className="text-sm font-semibold text-white">{item.verifier}</div>
                <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1">
                  <span>Verifier Address:</span>
                  <a
                    href={explorerAddress(item.verifierAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-0.5"
                  >
                    {shortAddress(item.verifierAddress)} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Cryptographic Hashes */}
              <div className="space-y-3">
                <div className="hash-row-box">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">On-Chain Merkle Tree Root (Keccak256)</span>
                    <button
                      className="copy-btn-inline"
                      onClick={() => copyText(item.treeDataRoot, 'root')}
                    >
                      {copiedRoot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                  <code className="text-xs font-mono text-emerald-300 break-all">{item.treeDataRoot}</code>
                </div>

                <div className="hash-row-box">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Evidence Commitment Hash</span>
                    <button
                      className="copy-btn-inline"
                      onClick={() => copyText(item.evidenceHash, 'evidence')}
                    >
                      {copiedEvidence ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                  <code className="text-xs font-mono text-slate-300 break-all">{item.evidenceHash}</code>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-200">Raw Tree Dataset Payload</span>
                  </div>
                  <a
                    href={api.datasetUrl(item.treeDataRoot)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-sm"
                  >
                    <span>View JSON API</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-5">
              <div className="action-toggle-seg">
                <button
                  type="button"
                  className={`action-seg-btn ${actionType === 'retire' ? 'active' : ''}`}
                  onClick={() => setActionType('retire')}
                >
                  <Flame className="w-4 h-4 mr-1.5" />
                  Retire (Offset)
                </button>
                <button
                  type="button"
                  className={`action-seg-btn ${actionType === 'buy' ? 'active' : ''}`}
                  onClick={() => setActionType('buy')}
                >
                  <Coins className="w-4 h-4 mr-1.5" />
                  Buy Credits
                </button>
              </div>

              {actionType === 'retire' ? (
                <form onSubmit={handleRetire} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Retiring permanently burns ERC-1155 tokens on the MST blockchain, recording your environmental offset statement forever.
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Amount to Retire (kg CO₂e)</label>
                    <input
                      type="number"
                      min="1"
                      value={retireAmount}
                      onChange={(e) => setRetireAmount(e.target.value)}
                      className="input-field"
                      placeholder="e.g. 500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Retirement Purpose / Reason</label>
                    <input
                      type="text"
                      maxLength={256}
                      value={retireReason}
                      onChange={(e) => setRetireReason(e.target.value)}
                      className="input-field"
                      placeholder="e.g. 2026 Corporate Scope 3 Aviation Offset"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-action w-full justify-center py-2.5"
                    disabled={locked || tx.busy}
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    {tx.busy ? 'Submitting to Blockchain…' : `Permanently Retire ${retireAmount || 0} kg CO₂e`}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSimulateBuy} className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Purchase credits from the registry at the current price of {formatCurrency(item.pricePerCredit)} per credit.
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Quantity of Credits (kg CO₂e)</label>
                    <input
                      type="number"
                      min="1"
                      max={item.availableCredits}
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="input-field"
                      placeholder="e.g. 1000"
                      required
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex justify-between items-center text-xs">
                    <span className="text-slate-300">Total Purchase Price:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {formatCurrency(Number(buyAmount || 0) * item.pricePerCredit)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-action w-full justify-center py-2.5"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Confirm Purchase
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
