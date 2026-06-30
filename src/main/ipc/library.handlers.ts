import { ipcMain, dialog, app } from 'electron'
import path from 'path'
import fs from 'fs'
import { IPC_CHANNELS, SUPPORTED_VIDEO_EXTENSIONS, SUPPORTED_AUDIO_EXTENSIONS, ALL_SUPPORTED_EXTENSIONS } from '../../shared/constants'
import { mediaRepo } from '../db/repositories/mediaRepo'
import type { MediaItem } from '../../shared/types/media'

function getMediaType(ext: string): 'video' | 'audio' | null {
  if (SUPPORTED_VIDEO_EXTENSIONS.includes(ext.toLowerCase())) return 'video'
  if (SUPPORTED_AUDIO_EXTENSIONS.includes(ext.toLowerCase())) return 'audio'
  return null
}

function scanDirectory(dirPath: string): string[] {
  const results: string[] = []
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        results.push(...scanDirectory(fullPath))
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (ALL_SUPPORTED_EXTENSIONS.includes(ext.toLowerCase())) {
          results.push(fullPath)
        }
      }
    }
  } catch {}
  return results
}

async function buildMediaItem(filePath: string): Promise<Omit<MediaItem, 'id' | 'addedAt' | 'playCount' | 'tags'>> {
  const stat = fs.statSync(filePath)
  const ext = path.extname(filePath)
  const type = getMediaType(ext) ?? 'video'
  const fileName = path.basename(filePath)
  const title = path.basename(filePath, ext)

  return {
    filePath,
    fileName,
    title,
    type,
    duration: 0, // Would use ffprobe in production
    size: stat.size,
  }
}

export function registerLibraryHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.LIBRARY_SCAN_FOLDER, async (_e, { folderPath }: { folderPath: string }) => {
    const files = scanDirectory(folderPath)
    const results: MediaItem[] = []
    for (const filePath of files) {
      const existing = mediaRepo.getByPath(filePath)
      if (existing) { results.push(existing); continue }
      try {
        const data = await buildMediaItem(filePath)
        const item = mediaRepo.insert(data)
        results.push(item)
      } catch {}
    }
    return results
  })

  ipcMain.handle(IPC_CHANNELS.LIBRARY_ADD_FILE, async (_e, { filePath }: { filePath: string }) => {
    const existing = mediaRepo.getByPath(filePath)
    if (existing) return existing
    const data = await buildMediaItem(filePath)
    return mediaRepo.insert(data)
  })

  ipcMain.handle(IPC_CHANNELS.LIBRARY_REMOVE, (_e, { id }: { id: number }) => {
    mediaRepo.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.LIBRARY_GET_ALL, () => mediaRepo.getAll())

  ipcMain.handle(IPC_CHANNELS.LIBRARY_GET_BY_ID, (_e, { id }: { id: number }) => mediaRepo.getById(id))

  ipcMain.handle(IPC_CHANNELS.LIBRARY_SEARCH, (_e, { query }: { query: string }) => mediaRepo.search(query))

  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FILE, async (_e, { filters }: { filters?: Electron.FileFilter[] }) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: filters ?? [
        { name: 'Media Files', extensions: ALL_SUPPORTED_EXTENSIONS.map(e => e.slice(1)) },
      ],
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FOLDER, async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return result.canceled ? null : result.filePaths[0]
  })
}
