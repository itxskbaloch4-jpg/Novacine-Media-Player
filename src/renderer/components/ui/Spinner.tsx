import React from 'react'
import { clsx } from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('inline-block rounded-full border-2 border-[#333] border-t-red-600 animate-spin', className)}
      style={{ width: 20, height: 20 }} />
  )
}
