import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111] border border-[#2a2a2a] rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
            <h2 className="font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
