import { create } from 'zustand'
import type { MediaItem, SubtitleTrack } from '../../shared/types/media'

interface ABRepeat {
  a: number | null
  b: number | null
}

interface PlayerState {
  currentMedia: MediaItem | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  isMuted: boolean
  isFullscreen: boolean
  playbackRate: number
  abRepeat: ABRepeat
  subtitleTracks: SubtitleTrack[]
  activeSubtitleTrack: SubtitleTrack | null
  queue: MediaItem[]
  queueIndex: number

  setCurrentMedia: (media: MediaItem | null) => void
  setIsPlaying: (v: boolean) => void
  setVolume: (v: number) => void
  setCurrentTime: (v: number) => void
  setDuration: (v: number) => void
  setMuted: (v: boolean) => void
  setFullscreen: (v: boolean) => void
  setPlaybackRate: (v: number) => void
  setABRepeat: (ab: Partial<ABRepeat>) => void
  clearABRepeat: () => void
  setSubtitleTracks: (tracks: SubtitleTrack[]) => void
  setActiveSubtitleTrack: (track: SubtitleTrack | null) => void
  setQueue: (items: MediaItem[], index?: number) => void
  nextInQueue: () => void
  prevInQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentMedia: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  isMuted: false,
  isFullscreen: false,
  playbackRate: 1,
  abRepeat: { a: null, b: null },
  subtitleTracks: [],
  activeSubtitleTrack: null,
  queue: [],
  queueIndex: 0,

  setCurrentMedia: (media) => set({ currentMedia: media, currentTime: 0 }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setMuted: (isMuted) => set({ isMuted }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setABRepeat: (ab) => set((s) => ({ abRepeat: { ...s.abRepeat, ...ab } })),
  clearABRepeat: () => set({ abRepeat: { a: null, b: null } }),
  setSubtitleTracks: (subtitleTracks) => set({ subtitleTracks }),
  setActiveSubtitleTrack: (activeSubtitleTrack) => set({ activeSubtitleTrack }),
  setQueue: (queue, index = 0) => set({ queue, queueIndex: index, currentMedia: queue[index] ?? null }),
  nextInQueue: () => {
    const { queue, queueIndex } = get()
    const next = queueIndex + 1
    if (next < queue.length) set({ queueIndex: next, currentMedia: queue[next], currentTime: 0 })
  },
  prevInQueue: () => {
    const { queue, queueIndex } = get()
    const prev = queueIndex - 1
    if (prev >= 0) set({ queueIndex: prev, currentMedia: queue[prev], currentTime: 0 })
  },
}))
