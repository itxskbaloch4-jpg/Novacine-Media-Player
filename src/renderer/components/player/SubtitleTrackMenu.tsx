import React, { useState } from 'react'
import { Subtitles } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'

export function SubtitleTrackMenu() {
  const { subtitleTracks, activeSubtitleTrack, setActiveSubtitleTrack } = usePlayerStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="p-1.5 text-[#a0a0a0] hover:text-white transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <Subtitles size={16} />
      </button>
      {open && (
        <div className="absolute bottom-8 right-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg py-1 min-w-[140px] z-10 shadow-xl">
          <button
            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#222] ${!activeSubtitleTrack ? 'text-red-400' : 'text-[#a0a0a0]'}`}
            onClick={() => { setActiveSubtitleTrack(null); setOpen(false) }}
          >
            Off
          </button>
          {subtitleTracks.map((t) => (
            <button
              key={t.id}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#222] ${activeSubtitleTrack?.id === t.id ? 'text-red-400' : 'text-[#a0a0a0]'}`}
              onClick={() => { setActiveSubtitleTrack(t); setOpen(false) }}
            >
              {t.language.toUpperCase()} {t.isAI ? '(AI)' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
