export const DB_NAME = 'novacine.db'
export const SUPPORTED_VIDEO_EXTENSIONS = [
  '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.ts', '.m2ts'
]
export const SUPPORTED_AUDIO_EXTENSIONS = [
  '.mp3', '.flac', '.aac', '.wav', '.ogg', '.m4a', '.opus'
]
export const SUPPORTED_SUBTITLE_EXTENSIONS = ['.srt', '.vtt', '.ass', '.ssa']
export const ALL_SUPPORTED_EXTENSIONS = [
  ...SUPPORTED_VIDEO_EXTENSIONS,
  ...SUPPORTED_AUDIO_EXTENSIONS,
]

export const IPC_CHANNELS = {
  // Library
  LIBRARY_SCAN_FOLDER: 'library:scan-folder',
  LIBRARY_ADD_FILE: 'library:add-file',
  LIBRARY_REMOVE: 'library:remove',
  LIBRARY_GET_ALL: 'library:get-all',
  LIBRARY_GET_BY_ID: 'library:get-by-id',
  LIBRARY_SEARCH: 'library:search',

  // FFmpeg
  FFMPEG_TRANSCODE: 'ffmpeg:transcode',
  FFMPEG_CLIP: 'ffmpeg:clip',
  FFMPEG_PROGRESS: 'ffmpeg:progress',
  FFMPEG_CANCEL: 'ffmpeg:cancel',

  // Subtitles
  SUBTITLES_GENERATE: 'subtitles:generate',
  SUBTITLES_GET: 'subtitles:get',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',

  // Playlists
  PLAYLIST_GET_ALL: 'playlist:get-all',
  PLAYLIST_CREATE: 'playlist:create',
  PLAYLIST_DELETE: 'playlist:delete',
  PLAYLIST_ADD_ITEM: 'playlist:add-item',
  PLAYLIST_REMOVE_ITEM: 'playlist:remove-item',
  PLAYLIST_GET_ITEMS: 'playlist:get-items',

  // Tags
  TAG_GET_ALL: 'tag:get-all',
  TAG_CREATE: 'tag:create',
  TAG_ASSIGN: 'tag:assign',
  TAG_REMOVE: 'tag:remove',

  // Dialog
  DIALOG_OPEN_FILE: 'dialog:open-file',
  DIALOG_OPEN_FOLDER: 'dialog:open-folder',
} as const
