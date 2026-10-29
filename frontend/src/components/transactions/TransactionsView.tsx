import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react'
import { SAMPLE_TRANSACTIONS, BlockchainTransaction } from '../../lib/mockData'
import { formatNumber, formatDateTime, formatRelativeTime, shortHash, shortAddress } from '../../lib/format'
import { explorerAddress, explorerTx } from '../../config/chain'
import { TransactionModal } from './TransactionModal'
import { useToast } from '../../context/ToastContext'

interface TransactionsViewProps {
  selectedTx: BlockchainTransaction | null
  onSelectTx: (tx: BlockchainTransaction | null) => void
}

export function TransactionsView({ selectedTx, onSelectTx }: TransactionsViewProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const pageSize = 5
  const toast = useToast()

  const types = ['All', 'Submission', 'Verification', 'Issuance', 'Transfer', 'Retirement']

  const filteredTx = useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((tx) => {
      const s = search.toLowerCase()
      const matchesSearch =
        tx.hash.toLowerCase().includes(s) ||
        tx.sender.toLowerCase().includes(s) ||
        (tx.receiver && tx.receiver.toLowerCase().includes(s)) ||
        (tx.projectName && tx.projectName.toLowerCase().includes(s))

      const matchesType = selectedType === 'All' || tx.type === selectedType
      const matchesStatus = selectedStatus === 'All' || tx.status === selectedStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [search, selectedType, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredTx.length / pageSize))
  const paginatedTx = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTx.slice(start, start + pageSize)
  }, [filteredTx, currentPage, pageSize])

  const handleCopy = async (hash: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      toast.success('Transaction hash copied', shortHash(hash))
      setTimeout(() => setCopiedHash(null), 1800)
    } catch {
      toast.info('Hash', hash)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedType('All')
    setSelectedStatus('All')
    setCurrentPage(1)
  }

  return (
    <div className="transactions-view">
      {/* Header */}
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Blockchain Transactions Explorer</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              On-Chain Activity
            </span>
          </div>
          <p className="dashboard-subtitle">
            Cryptographic audit trail of all project submissions, verifications, mints, transfers, and permanent retirements.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="marketplace-filter-card">
        <div className="marketplace-controls-top">
          {/* Search Bar */}
          <div className="marketplace-search-box">
            <Search className="w-4 h-4 text-slate-400 ml-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by transaction hash, sender, recipient, project…"
              className="marketplace-search-input"
            />
            {search && (
              <button
                className="search-clear-btn"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="marketplace-sort-box">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setCurrentPage(1)
              }}
              className="marketplace-select"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Transaction Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="marketplace-sort-box">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="marketplace-select"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {(search || selectedType !== 'All' || selectedStatus !== 'All') && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="dashboard-panel">
        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTx.map((tx) => (
                <tr
                  key={tx.hash}
                  className="table-row-hover clickable"
                  onClick={() => onSelectTx(tx)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-300 font-medium">
                        {shortHash(tx.hash)}
                      </span>
                      <button
                        className="copy-btn-inline"
                        onClick={(e) => handleCopy(tx.hash, e)}
                        title="Copy hash"
                      >
                        {copiedHash === tx.hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td>
                    <span className={`badge-tx-type ${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>

                  <td>
                    <a
                      href={explorerAddress(tx.sender)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-slate-300 hover:text-emerald-400 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {shortAddress(tx.sender)}
                    </a>
                  </td>

                  <td>
                    {tx.receiver ? (
                      <a
                        href={explorerAddress(tx.receiver)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-slate-300 hover:text-emerald-400 inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {shortAddress(tx.receiver)}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>

                  <td>
                    <span className="font-semibold text-xs text-white">
                      {formatNumber(tx.amount)} {tx.currency}
                    </span>
                  </td>

                  <td>
                    <div className="text-xs">
                      <span className="text-slate-200 block">{formatRelativeTime(tx.timestamp)}</span>
                      <span className="text-[10px] text-slate-400 block">{formatDateTime(tx.timestamp)}</span>
                    </div>
                  </td>

                  <td>
                    <span className="badge-status-confirmed">
                      <span className="pulse-dot green small" />
                      {tx.status}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn-outline-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectTx(tx)
                        }}
                      >
                        Details
                      </button>
                      <a
                        href={explorerTx(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="table-action-icon"
                        onClick={(e) => e.stopPropagation()}
                        title="MSTScan Explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredTx.length === 0 && (
          <div className="empty-state-card py-10">
            <ArrowLeftRight className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h3 className="empty-title">No transactions match your search</h3>
            <p className="empty-description">Try adjusting your filters or search keywords.</p>
            <button className="btn-secondary-subtle mt-3" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredTx.length > 0 && (
          <div className="pagination-bar">
            <span className="text-xs text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTx.length)} of {filteredTx.length} transactions
            </span>

            <div className="flex items-center gap-2">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <span className="text-xs font-medium text-slate-300 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedTx && (
        <TransactionModal tx={selectedTx} onClose={() => onSelectTx(null)} />
      )}
    </div>
  )
}
