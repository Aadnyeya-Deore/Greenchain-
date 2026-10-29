import React from 'react'
import {
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
  Trees,
  ShieldCheck,
} from 'lucide-react'
import { MarketplaceItem } from '../../lib/mockData'
import { formatNumber, formatCurrency } from '../../lib/format'

interface MarketplaceCardProps {
  item: MarketplaceItem
  onSelect: (item: MarketplaceItem) => void
  onQuickRetire?: (item: MarketplaceItem) => void
}

export function MarketplaceCard({ item, onSelect, onQuickRetire }: MarketplaceCardProps) {
  return (
    <article className="marketplace-card">
      {/* Card Image Banner with Category & Status badges */}
      <div className="marketplace-card-image" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="marketplace-card-overlay" />
        <div className="marketplace-card-badges">
          <span className="badge-category">{item.category}</span>
          <span className={`badge-status ${item.status.toLowerCase()}`}>
            {item.status === 'Verified' ? (
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            ) : (
              <Clock className="w-3.5 h-3.5 mr-1" />
            )}
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="marketplace-card-body">
        <h3 className="marketplace-card-title" title={item.name}>
          {item.name}
        </h3>

        <div className="marketplace-card-location">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>

        <div className="marketplace-stats-grid">
          <div className="marketplace-stat-col">
            <span className="stat-label">Available Credits</span>
            <span className="stat-value text-white font-mono">
              {formatNumber(item.availableCredits)} <span className="stat-unit text-slate-400">kg CO₂e</span>
            </span>
          </div>

          <div className="marketplace-stat-col text-right">
            <span className="stat-label">Price / Credit</span>
            <span className="stat-value text-emerald-400 font-mono">
              {formatCurrency(item.pricePerCredit)}
            </span>
          </div>
        </div>

        {/* Tree Count indicator */}
        <div className="marketplace-trees-row">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Trees className="w-3.5 h-3.5 text-lime-400" />
            <span>{formatNumber(item.treeCount)} GPS-verified trees</span>
          </div>
          <span className="text-[11px] text-slate-400">Vintage {item.vintage}</span>
        </div>

        {/* Action Button */}
        <div className="marketplace-card-actions">
          <button
            type="button"
            className="btn-card-action"
            onClick={() => onSelect(item)}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </article>
  )
}
