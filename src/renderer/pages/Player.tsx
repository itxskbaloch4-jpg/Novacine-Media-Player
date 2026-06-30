import React, { useState } from 'react'
import { VideoPlayer } from '../components/player/VideoPlayer'
import { usePlayerStore } from '../store/playerStore'
import { TranscodeModal } from '../components/transcode/TranscodeModal'
import { Scissors } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function Player() {
  const { currentMedia } = usePlayerStore()
  const [transcodeOpen, setTranscodeOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative bg-black">
        <VideoPlayer />
      </div>

      {/* Below player info bar */}
      {currentMedia && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1a1a1a] bg-[#0a0a0a]">
          <div>
            <h2 className="text-sm font-medium text-white">{currentMedia.title}</h2>
            <p className="text-xs text-[#555]">{currentMedia.filePath}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setTranscodeOpen(true)}>
            <Scissors size={13} /> Transcode
          </Button>
        </div>
      )}

      <TranscodeModal open={transcodeOpen} onClose={() => setTranscodeOpen(false)} media={currentMedia} />
    </div>
  )
}
