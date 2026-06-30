import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import type { NovacineAPI } from '../shared/types/ipc-events'
import type { TranscodeProgress, AppSettings, TranscodeOptions, ClipOptions } from '../shared/types/media'

const api: NovacineAPI = {
  library: {
    scanFolder: (folderPath) => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_SCAN_FOLDER, { folderPath }),
    addFile: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_ADD_FILE, { filePath }),
    remove: (id) => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_REMOVE, { id }),
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_GET_ALL),
    getById: (id) => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_GET_BY_ID, { id }),
    search: (query) => ipcRenderer.invoke(IPC_CHANNELS.LIBRARY_SEARCH, { query }),
  },
  ffmpeg: {
    transcode: (options: TranscodeOptions) => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_TRANSCODE, options),
    clip: (options: ClipOptions) => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_CLIP, options),
    cancel: (jobId: string) => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_CANCEL, { jobId }),
    onProgress: (cb: (p: TranscodeProgress) => void) => {
      const handler = (_: Electron.IpcRendererEvent, p: TranscodeProgress) => cb(p)
      ipcRenderer.on(IPC_CHANNELS.FFMPEG_PROGRESS, handler)
      return () => ipcRenderer.removeListener(IPC_CHANNELS.FFMPEG_PROGRESS, handler)
    },
  },
  subtitles: {
    generate: (mediaId, language) => ipcRenderer.invoke(IPC_CHANNELS.SUBTITLES_GENERATE, { mediaId, language }),
    get: (mediaId) => ipcRenderer.invoke(IPC_CHANNELS.SUBTITLES_GET, { mediaId }),
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET),
    set: (s: Partial<AppSettings>) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET, s),
  },
  playlists: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_GET_ALL),
    create: (name, description) => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_CREATE, { name, description }),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_DELETE, { id }),
    addItem: (playlistId, mediaId) => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_ADD_ITEM, { playlistId, mediaId }),
    removeItem: (id) => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_REMOVE_ITEM, { id }),
    getItems: (playlistId) => ipcRenderer.invoke(IPC_CHANNELS.PLAYLIST_GET_ITEMS, { playlistId }),
  },
  tags: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.TAG_GET_ALL),
    create: (name, color) => ipcRenderer.invoke(IPC_CHANNELS.TAG_CREATE, { name, color }),
    assign: (mediaId, tagId) => ipcRenderer.invoke(IPC_CHANNELS.TAG_ASSIGN, { mediaId, tagId }),
    remove: (mediaId, tagId) => ipcRenderer.invoke(IPC_CHANNELS.TAG_REMOVE, { mediaId, tagId }),
  },
  dialog: {
    openFile: (filters) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FILE, { filters }),
    openFolder: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_FOLDER),
  },
}

contextBridge.exposeInMainWorld('novacine', api)
