import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import { registerLibraryHandlers } from './ipc/library.handlers'
import { registerFFmpegHandlers } from './ipc/ffmpeg.handlers'
import { registerSubtitleHandlers } from './ipc/subtitles.handlers'
import { registerSettingsHandlers } from './ipc/settings.handlers'
import { getDb, closeDb } from './db/connection'

// Also register playlist and tag IPC
import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import { playlistRepo } from './db/repositories/playlistRepo'
import { tagRepo } from './db/repositories/tagRepo'

function registerPlaylistHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_GET_ALL, () => playlistRepo.getAll())
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_CREATE, (_e, { name, description }: { name: string; description?: string }) =>
    playlistRepo.create(name, description))
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_DELETE, (_e, { id }: { id: number }) => playlistRepo.delete(id))
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_ADD_ITEM, (_e, { playlistId, mediaId }: { playlistId: number; mediaId: number }) =>
    playlistRepo.addItem(playlistId, mediaId))
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_REMOVE_ITEM, (_e, { id }: { id: number }) => playlistRepo.removeItem(id))
  ipcMain.handle(IPC_CHANNELS.PLAYLIST_GET_ITEMS, (_e, { playlistId }: { playlistId: number }) =>
    playlistRepo.getItems(playlistId))
}

function registerTagHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.TAG_GET_ALL, () => tagRepo.getAll())
  ipcMain.handle(IPC_CHANNELS.TAG_CREATE, (_e, { name, color }: { name: string; color: string }) =>
    tagRepo.create(name, color))
  ipcMain.handle(IPC_CHANNELS.TAG_ASSIGN, (_e, { mediaId, tagId }: { mediaId: number; tagId: number }) =>
    tagRepo.assign(mediaId, tagId))
  ipcMain.handle(IPC_CHANNELS.TAG_REMOVE, (_e, { mediaId, tagId }: { mediaId: number; tagId: number }) =>
    tagRepo.remove(mediaId, tagId))
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // Required for local file:// video playback
    },
  })

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  nativeTheme.themeSource = 'dark'
}

app.whenReady().then(() => {
  // Initialize DB
  getDb()

  // Register all IPC handlers
  registerLibraryHandlers()
  registerFFmpegHandlers()
  registerSubtitleHandlers()
  registerSettingsHandlers()
  registerPlaylistHandlers()
  registerTagHandlers()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDb()
  if (process.platform !== 'darwin') app.quit()
})
