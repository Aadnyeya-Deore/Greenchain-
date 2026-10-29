import { useState, useMemo } from 'react'
import type { Address } from 'viem'
import { useProjects } from '../hooks/useRegistry'
import { errorMessage, formatNumber } from '../lib/format'
import { ProjectCard } from './ProjectCard'
import { STATUS } from '../lib/registry'
import { Search, Trees, PlusCircle, Filter, RotateCcw, ShieldCheck } from 'lucide-react'

interface ProjectsViewProps {
  account: Address
  locked: boolean
  mineOnly?: boolean
  onSubmitClick?: () => void
}

export function ProjectsView({ account, locked, mineOnly, onSubmitClick }: ProjectsViewProps) {
  const { projects, total, isLoading, error } = useProjects()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const baseProjects = mineOnly
    ? projects.filter((p) => p.owner.toLowerCase() === account.toLowerCase())
    : projects

  const filteredProjects = useMemo(() => {
    return baseProjects.filter((p) => {
      const s = search.toLowerCase()
      const matchesSearch =
        p.name.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.id.toString().includes(s)

      let matchesStatus = true
      if (filterStatus === 'Verified') matchesStatus = p.status === STATUS.Verified
      else if (filterStatus === 'Pending') matchesStatus = p.status === STATUS.Pending

      return matchesSearch && matchesStatus
    })
  }, [baseProjects, search, filterStatus])

  return (
    <section className="space-y-6">
      {/* View Header */}
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">{mineOnly ? 'My Carbon Projects' : 'Verified Project Registry'}</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              {total} On-Chain Projects
            </span>
          </div>
          <p className="dashboard-subtitle">
            {mineOnly
              ? 'Tree datasets submitted by your account. Monitor verifier approvals and mint earned credits.'
              : 'Browse all immutable tree-planting projects registered on the MST Testnet smart contract.'}
          </p>
        </div>

        {onSubmitClick && (
          <button className="btn-primary-action" onClick={onSubmitClick}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Submit New Project
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="marketplace-filter-card">
        <div className="marketplace-controls-top">
          <div className="marketplace-search-box">
            <Search className="w-4 h-4 text-slate-400 ml-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, location, or ID…"
              className="marketplace-search-input"
            />
            {search && (
              <button className="search-clear-btn" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          <div className="marketplace-sort-box">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="marketplace-select"
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>

          {(search || filterStatus !== 'All') && (
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSearch('')
                setFilterStatus('All')
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-sm">
          Could not load projects: {errorMessage(error)}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
          <span className="pulse-dot green" />
          <span>Synchronizing projects from MST Testnet…</span>
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="empty-state-card py-12">
          <Trees className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="empty-title">
            {mineOnly ? 'You have not submitted any projects yet' : 'No projects registered'}
          </h3>
          <p className="empty-description">
            {mineOnly
              ? 'Upload your GPS tree CSV dataset to submit a project and begin the verification process.'
              : 'Be the first landowner to register GPS-tagged tree restoration data on MST Testnet.'}
          </p>
          {onSubmitClick && (
            <button className="btn-primary-action mt-4" onClick={onSubmitClick}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Submit Tree Project
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => (
          <ProjectCard key={p.id.toString()} project={p} account={account} locked={locked} />
        ))}
      </div>
    </section>
  )
}
