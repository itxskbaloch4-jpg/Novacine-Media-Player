import React, { useRef, useEffect, useCallback } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { PlayerControls } from './PlayerControls'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    currentMedia, isPlaying, volume, isMuted, playbackRate,
    abRepeat, setCurrentTime, setDuration, setIsPlaying,
    nextInQueue,
  } = usePlayerStore()

  useEffect(() => {
    const v = videoRef.current
    if (!v || !currentMedia) return
    v.src = `file://${currentMedia.filePath}`
    v.load()
    if (isPlaying) v.play().catch(() => {})
  }, [currentMedia])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) v.play().catch(() => {})
    else v.pause()
  }, [isPlaying])

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate
  }, [playbackRate])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)

    // A/B repeat
    if (abRepeat.a !== null && abRepeat.b !== null) {
      if (v.currentTime >= abRepeat.b) {
        v.currentTime = abRepeat.a
      }
    }
  }, [abRepeat, setCurrentTime])

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration)
        }}
        onEnded={() => {
          setIsPlaying(false)
          nextInQueue()
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {!currentMedia && (
        <div className="absolute inset-0 flex items-center justify-center text-[#333]">
          <div className="text-center">
            <div className="text-6xl mb-3">▶</div>
            <p className="text-lg">No media selected</p>
          </div>
        </div>
      )}

      {/* Controls – show on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayerControls videoRef={videoRef} />
      </div>
    </div>
  )
}
