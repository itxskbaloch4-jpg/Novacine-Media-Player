import type {
  MediaItem, Playlist, PlaylistItem, Tag,
  TranscodeOptions, ClipOptions, TranscodeProgress,
  AppSettings, SubtitleTrack
} from './media'

export interface IpcEvents {
  // Library
  'library:scan-folder': { folderPath: string } => MediaItem[]
  'library:add-file': { filePath: string } => MediaItem
  'library:remove': { id: number } => void
  'library:get-all': void => MediaItem[]
  'library:get-by-id': { id: number } => MediaItem | null
  'library:search': { query: string } => MediaItem[]

  // FFmpeg
  'ffmpeg:transcode': TranscodeOptions => { jobId: string }
  'ffmpeg:clip': ClipOptions => { jobId: string }
  'ffmpeg:cancel': { jobId: string } => void
  'ffmpeg:progress': TranscodeProgress => void  // renderer listener

  // Subtitles
  'subtitles:generate': { mediaId: number; language?: string } => SubtitleTrack
  'subtitles:get': { mediaId: number } => SubtitleTrack[]

  // Settings
  'settings:get': void => AppSettings
  'settings:set': Partial<AppSettings> => AppSettings

  // Playlists
  'playlist:get-all': void => Playlist[]
  'playlist:create': { name: string; description?: string } => Playlist
  'playlist:delete': { id: number } => void
  'playlist:add-item': { playlistId: number; mediaId: number } => PlaylistItem
  'playlist:remove-item': { id: number } => void
  'playlist:get-items': { playlistId: number } => PlaylistItem[]

  // Tags
  'tag:get-all': void => Tag[]
  'tag:create': { name: string; color: string } => Tag
  'tag:assign': { mediaId: number; tagId: number } => void
  'tag:remove': { mediaId: number; tagId: number } => void

  // Dialog
  'dialog:open-file': { filters?: Electron.FileFilter[] } => string | null
  'dialog:open-folder': void => string | null
}

// Typed preload API exposed to renderer
export interface NovacineAPI {
  library: {
    scanFolder: (folderPath: string) => Promise<MediaItem[]>
    addFile: (filePath: string) => Promise<MediaItem>
    remove: (id: number) => Promise<void>
    getAll: () => Promise<MediaItem[]>
    getById: (id: number) => Promise<MediaItem | null>
    search: (query: string) => Promise<MediaItem[]>
  }
  ffmpeg: {
    transcode: (options: TranscodeOptions) => Promise<{ jobId: string }>
    clip: (options: ClipOptions) => Promise<{ jobId: string }>
    cancel: (jobId: string) => Promise<void>
    onProgress: (cb: (p: TranscodeProgress) => void) => () => void
  }
  subtitles: {
    generate: (mediaId: number, language?: string) => Promise<SubtitleTrack>
    get: (mediaId: number) => Promise<SubtitleTrack[]>
  }
  settings: {
    get: () => Promise<AppSettings>
    set: (s: Partial<AppSettings>) => Promise<AppSettings>
  }
  playlists: {
    getAll: () => Promise<Playlist[]>
    create: (name: string, description?: string) => Promise<Playlist>
    delete: (id: number) => Promise<void>
    addItem: (playlistId: number, mediaId: number) => Promise<PlaylistItem>
    removeItem: (id: number) => Promise<void>
    getItems: (playlistId: number) => Promise<PlaylistItem[]>
  }
  tags: {
    getAll: () => Promise<Tag[]>
    create: (name: string, color: string) => Promise<Tag>
    assign: (mediaId: number, tagId: number) => Promise<void>
    remove: (mediaId: number, tagId: number) => Promise<void>
  }
  dialog: {
    openFile: (filters?: Electron.FileFilter[]) => Promise<string | null>
    openFolder: () => Promise<string | null>
  }
}
