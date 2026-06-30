import React from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { Button } from '../ui/Button'

export function ABRepeatBar() {
  const { abRepeat, setABRepeat, clearABRepeat, currentTime, duration } = usePlayerStore()

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Button size="sm" variant={abRepeat.a !== null ? 'primary' : 'secondary'}
        onClick={() => setABRepeat({ a: currentTime })}>
        A {abRepeat.a !== null ? formatTime(abRepeat.a) : '—'}
      </Button>
      <Button size="sm" variant={abRepeat.b !== null ? 'primary' : 'secondary'}
        onClick={() => setABRepeat({ b: currentTime })}>
        B {abRepeat.b !== null ? formatTime(abRepeat.b) : '—'}
      </Button>
      {(abRepeat.a !== null || abRepeat.b !== null) && (
        <Button size="sm" variant="ghost" onClick={clearABRepeat}>✕</Button>
      )}
    </div>
  )
}
