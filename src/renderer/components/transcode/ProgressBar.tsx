import React from 'react'

interface ProgressBarProps {
  percent: number
  label?: string
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {label && <div className="text-xs text-[#a0a0a0] flex justify-between">
        <span>{label}</span>
        <span>{Math.round(percent)}%</span>
      </div>}
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
