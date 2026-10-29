import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(({ title, message, type }: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev.slice(-4), { id, title, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => showToast({ title, message, type: 'success' }), [showToast])
  const error = useCallback((title: string, message?: string) => showToast({ title, message, type: 'error' }), [showToast])
  const info = useCallback((title: string, message?: string) => showToast({ title, message, type: 'info' }), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card toast-${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-message">{t.message}</div>}
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss toast">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
