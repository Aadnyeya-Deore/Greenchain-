import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { SAMPLE_MARKETPLACE_PROJECTS, MarketplaceItem } from '../../lib/mockData'
import { MarketplaceCard } from './MarketplaceCard'
import { CreditDetailsModal } from './CreditDetailsModal'

interface MarketplaceViewProps {
  account?: string
  locked?: boolean
  selectedItem?: MarketplaceItem | null
  onSelectItem: (item: MarketplaceItem | null) => void
}

export function MarketplaceView({ account, locked, selectedItem, onSelectItem }: MarketplaceViewProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [priceRange, setPriceRange] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'credits-desc' | 'trees-desc'>('credits-desc')

  const categories = ['All', 'Reforestation', 'Blue Carbon', 'Agroforestry', 'Soil Carbon']
  const statuses = ['All', 'Verified', 'Pending']

  const filteredItems = useMemo(() => {
    return SAMPLE_MARKETPLACE_PROJECTS.filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.methodology.toLowerCase().includes(search.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory

      // Status filter
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus

      // Price filter
      let matchesPrice = true
      if (priceRange === 'under-0.05') matchesPrice = item.pricePerCredit < 0.05
      else if (priceRange === '0.05-0.06') matchesPrice = item.pricePerCredit >= 0.05 && item.pricePerCredit <= 0.06
      else if (priceRange === 'over-0.06') matchesPrice = item.pricePerCredit > 0.06

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerCredit - b.pricePerCredit
      if (sortBy === 'price-desc') return b.pricePerCredit - a.pricePerCredit
      if (sortBy === 'credits-desc') return b.availableCredits - a.availableCredits
      if (sortBy === 'trees-desc') return b.treeCount - a.treeCount
      return 0
    })
  }, [search, selectedCategory, selectedStatus, priceRange, sortBy])

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSelectedStatus('All')
    setPriceRange('All')
    setSortBy('credits-desc')
  }

  return (
    <div className="marketplace-view">
      {/* Marketplace Header */}
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Carbon Credit Marketplace</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Verified Inventory
            </span>
          </div>
          <p className="dashboard-subtitle">
            Browse and acquire high-integrity carbon credits with cryptographic Merkle proof datasets on MST Testnet.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="marketplace-filter-card">
        {/* Top Controls Row */}
        <div className="marketplace-controls-top">
          {/* Search Field */}
          <div className="marketplace-search-box">
            <Search className="w-4 h-4 text-slate-400 ml-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, location, methodology…"
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

          {/* Sort Dropdown */}
          <div className="marketplace-sort-box">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="marketplace-select"
            >
              <option value="credits-desc">Most Credits Available</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="trees-desc">Most Trees Planted</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="marketplace-sort-box">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="marketplace-select"
            >
              <option value="All">All Price Ranges</option>
              <option value="under-0.05">&lt; 0.050 tMSTC</option>
              <option value="0.05-0.06">0.050 – 0.060 tMSTC</option>
              <option value="over-0.06">&gt; 0.060 tMSTC</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div className="marketplace-sort-box">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="marketplace-select"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Audit</option>
            </select>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="marketplace-category-pills">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}

          {(search || selectedCategory !== 'All' || selectedStatus !== 'All' || priceRange !== 'All') && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="results-count-bar">
        <span>Showing <strong>{filteredItems.length}</strong> carbon credit projects</span>
        <span className="text-xs text-slate-400">1 credit = 1 kg CO₂e verified reduction</span>
      </div>

      {/* Grid of Credit Cards */}
      {filteredItems.length > 0 ? (
        <div className="marketplace-cards-grid">
          {filteredItems.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              onSelect={(clicked) => onSelectItem(clicked)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-circle">
            <ShoppingBag className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="empty-title">No carbon projects match your criteria</h3>
          <p className="empty-description">
            Try adjusting your search query, price filter, or category selector.
          </p>
          <button className="btn-secondary-subtle mt-4" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset all filters
          </button>
        </div>
      )}

      {/* Selected Item Modal */}
      {selectedItem && (
        <CreditDetailsModal
          item={selectedItem}
          onClose={() => onSelectItem(null)}
          account={account}
          locked={locked}
        />
      )}
    </div>
  )
}
