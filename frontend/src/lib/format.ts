import { BaseError } from 'viem'

export const shortAddress = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')
export const shortHash = (h?: string) => (h ? `${h.slice(0, 10)}…${h.slice(-8)}` : '')

export function formatDate(sec: bigint | number): string {
  const n = Number(sec)
  if (!n) return '—'
  return new Date(n * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(msOrSec: number | bigint): string {
  const n = Number(msOrSec)
  if (!n) return '—'
  // Handle milliseconds vs seconds
  const ms = n < 10000000000 ? n * 1000 : n
  return new Date(ms).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(msOrSec: number | bigint): string {
  const n = Number(msOrSec)
  if (!n) return '—'
  const ms = n < 10000000000 ? n * 1000 : n
  const diffSec = Math.floor((Date.now() - ms) / 1000)

  if (diffSec < 60) return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

export const formatNumber = (n: bigint | number) => Number(n).toLocaleString()

export function formatTons(kgCo2: bigint | number): string {
  const n = Number(kgCo2) / 1000
  return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' t CO₂'
}

export function formatCurrency(amount: number, symbol = 'tMSTC'): string {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${symbol}`
}

/** Turn wallet/viem/network errors into one readable sentence. */
export function errorMessage(err: unknown): string {
  if (!err) return ''
  if (err instanceof BaseError) {
    const rejected = err.walk((e) => (e as { name?: string }).name === 'UserRejectedRequestError')
    if (rejected) return 'Request cancelled in your wallet.'
    return err.shortMessage || err.message
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}
