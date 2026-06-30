import React from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, Settings
} from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { ABRepeatBar } from './ABRepeatBar'
import { SubtitleTrackMenu } from './SubtitleTrackMenu'

interface PlayerControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
}

export function PlayerControls({ videoRef }: PlayerControlsProps) {
  const {
    isPlaying, volume, isMuted, isFullscreen, currentTime, duration, playbackRate,
    setIsPlaying, setVolume, setMuted, setFullscreen, setPlaybackRate,
    nextInQueue, prevInQueue,
  } = usePlayerStore()

  const fmt = (t: number) => {
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = Math.floor(t % 60)
    return h > 0
      ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
      : `${m}:${s.toString().padStart(2,'0')}`
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) v.pause()
    else v.play()
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v) return
    const t = parseFloat(e.target.value)
    v.currentTime = t
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (videoRef.current) videoRef.current.volume = v
    if (v > 0) setMuted(false)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !isMuted
    setMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-10">
      {/* Seek bar */}
      <div className="mb-2">
        <input
          type="range" min={0} max={duration || 0} step={0.5}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-red-600"
          style={{ background: `linear-gradient(to right, #e50914 ${percent}%, #333 ${percent}%)` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevInQueue} className="p-1.5 text-[#a0a0a0] hover:text-white transition-colors">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="p-2 text-white hover:text-red-400 transition-colors">
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button onClick={nextInQueue} className="p-1.5 text-[#a0a0a0] hover:text-white transition-colors">
            <SkipForward size={18} />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1 ml-1">
            <button onClick={toggleMute} className="p-1.5 text-[#a0a0a0] hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
              onChange={handleVolume} className="w-20 accent-red-600" />
          </div>

          <span className="text-xs text-[#a0a0a0] ml-2">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <ABRepeatBar />
          <SubtitleTrackMenu />
          <select
            value={playbackRate}
            onChange={(e) => {
              const r = parseFloat(e.target.value)
              setPlaybackRate(r)
              if (videoRef.current) videoRef.current.playbackRate = r
            }}
            className="bg-transparent text-[#a0a0a0] text-xs border border-[#2a2a2a] rounded px-1 py-0.5 hover:text-white"
          >
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
              <option key={r} value={r}>{r}x</option>
            ))}
          </select>
          <button onClick={toggleFullscreen} className="p-1.5 text-[#a0a0a0] hover:text-white transition-colors">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
