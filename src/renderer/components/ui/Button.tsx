import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-red-600 hover:bg-red-500 text-white': variant === 'primary',
          'bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a]': variant === 'secondary',
          'hover:bg-[#1a1a1a] text-[#a0a0a0] hover:text-white': variant === 'ghost',
          'bg-red-900/30 hover:bg-red-900/50 text-red-400': variant === 'danger',
          'text-xs px-2 py-1 gap-1': size === 'sm',
          'text-sm px-3 py-1.5 gap-1.5': size === 'md',
          'text-base px-4 py-2 gap-2': size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  )
}
