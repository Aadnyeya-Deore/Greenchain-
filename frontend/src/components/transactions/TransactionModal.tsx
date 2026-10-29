import React, { useState } from 'react'
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Layers,
  Clock,
  Coins,
} from 'lucide-react'
import { BlockchainTransaction } from '../../lib/mockData'
import { formatNumber, formatDateTime, shortAddress, shortHash } from '../../lib/format'
import { MST_CHAIN_ID, explorerAddress, explorerTx } from '../../config/chain'
import { useToast } from '../../context/ToastContext'

interface TransactionModalProps {
  tx: BlockchainTransaction | null
  onClose: () => void
}

export function TransactionModal({ tx, onClose }: TransactionModalProps) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedSender, setCopiedSender] = useState(false)
  const [copiedReceiver, setCopiedReceiver] = useState(false)
  const toast = useToast()

  if (!tx) return null

  const copy = async (text: string, type: 'hash' | 'sender' | 'receiver') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'hash') setCopiedHash(true)
      if (type === 'sender') setCopiedSender(true)
      if (type === 'receiver') setCopiedReceiver(true)
      setTimeout(() => {
        setCopiedHash(false)
        setCopiedSender(false)
        setCopiedReceiver(false)
      }, 2000)
      toast.success('Copied to clipboard', text)
    } catch {
      toast.info('Copied', text)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="modal-title">Transaction Receipt</h3>
              <p className="modal-subtitle">Verified on MST Testnet Block #{tx.blockNumber}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Operation Type</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{tx.type}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Volume</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {formatNumber(tx.amount)} {tx.currency}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Hash */}
            <div className="detail-item-box">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Transaction Hash</span>
                <button className="copy-btn-inline" onClick={() => copy(tx.hash, 'hash')}>
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
              <code className="text-xs font-mono text-emerald-300 break-all">{tx.hash}</code>
            </div>

            {/* Sender */}
            <div className="detail-item-box">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Sender Address</span>
                <button className="copy-btn-inline" onClick={() => copy(tx.sender, 'sender')}>
                  {copiedSender ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <code className="text-xs font-mono text-slate-300">{tx.sender}</code>
                <a
                  href={explorerAddress(tx.sender)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Receiver if applicable */}
            {tx.receiver && (
              <div className="detail-item-box">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Receiver / Contract</span>
                  <button className="copy-btn-inline" onClick={() => copy(tx.receiver!, 'receiver')}>
                    {copiedReceiver ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-xs font-mono text-slate-300">{tx.receiver}</code>
                  <a
                    href={explorerAddress(tx.receiver)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Timestamps & Fees */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Timestamp</span>
                <span className="text-slate-200 font-medium">{formatDateTime(tx.timestamp)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Gas Fee Paid</span>
                <span className="text-slate-200 font-medium">{tx.fee}</span>
              </div>
            </div>

            {tx.projectName && (
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">Associated Project</span>
                <span className="text-emerald-300 font-medium">{tx.projectName}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href={explorerTx(tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-action w-full justify-center"
            >
              <span>View On MSTScan Explorer</span>
              <ExternalLink className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
