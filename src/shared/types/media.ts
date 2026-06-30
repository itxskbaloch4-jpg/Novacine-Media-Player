export type MediaType = 'video' | 'audio'

export interface MediaItem {
  id: number
  filePath: string
  fileName: string
  title: string
  type: MediaType
  duration: number        // seconds
  size: number            // bytes
  width?: number
  height?: number
  codec?: string
  bitrate?: number
  thumbnailPath?: string
  addedAt: string         // ISO date string
  lastPlayedAt?: string
  playCount: number
  tags: string[]
}

export interface Playlist {
  id: number
  name: string
  description?: string
  createdAt: string
  itemCount: number
}

export interface PlaylistItem {
  id: number
  playlistId: number
  mediaId: number
  position: number
  media?: MediaItem
}

export interface Tag {
  id: number
  name: string
  color: string
}

export interface SubtitleTrack {
  id: number
  mediaId: number
  language: string
  filePath: string
  isAI: boolean
  createdAt: string
}

export interface TranscodeOptions {
  inputPath: string
  outputPath: string
  format: 'mp4' | 'mkv' | 'webm' | 'mp3' | 'flac'
  videoBitrate?: string
  audioBitrate?: string
  resolution?: '480p' | '720p' | '1080p' | '4K' | 'original'
  fps?: number
  startTime?: number
  endTime?: number
}

export interface ClipOptions {
  inputPath: string
  outputPath: string
  startTime: number
  endTime: number
  format?: string
}

export interface TranscodeProgress {
  jobId: string
  percent: number
  fps: number
  speed: string
  eta: number
  done: boolean
  error?: string
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  ffmpegPath: string
  defaultOutputDir: string
  autoScan: boolean
  defaultVolume: number
  subtitleFontSize: number
  hardwareAcceleration: boolean
  language: string
}
