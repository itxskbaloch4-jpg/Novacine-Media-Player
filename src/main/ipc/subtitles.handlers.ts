import { ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import { getDb } from '../db/connection'
import type { SubtitleTrack } from '../../shared/types/media'

interface SubtitleRow {
  id: number
  media_id: number
  language: string
  file_path: string
  is_ai: number
  created_at: string
}

function rowToTrack(r: SubtitleRow): SubtitleTrack {
  return {
    id: r.id,
    mediaId: r.media_id,
    language: r.language,
    filePath: r.file_path,
    isAI: r.is_ai === 1,
    createdAt: r.created_at,
  }
}

export function registerSubtitleHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SUBTITLES_GET, (_e, { mediaId }: { mediaId: number }) => {
    const rows = getDb()
      .prepare('SELECT * FROM subtitles WHERE media_id = ? ORDER BY created_at DESC')
      .all(mediaId) as SubtitleRow[]
    return rows.map(rowToTrack)
  })

  ipcMain.handle(IPC_CHANNELS.SUBTITLES_GENERATE, async (_e, { mediaId, language = 'en' }: { mediaId: number; language?: string }) => {
    // AI subtitle generation placeholder – in production, pipe audio to Whisper
    const db = getDb()
    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(mediaId) as { file_path: string } | undefined
    if (!media) throw new Error('Media not found')

    const subtitleDir = path.join(app.getPath('userData'), 'subtitles')
    fs.mkdirSync(subtitleDir, { recursive: true })

    const srtPath = path.join(subtitleDir, `${mediaId}_${language}_${Date.now()}.srt`)

    // Placeholder SRT content
    const srtContent = `1\n00:00:00,000 --> 00:00:05,000\n[AI subtitle generation requires Whisper integration]\n\n`
    fs.writeFileSync(srtPath, srtContent, 'utf-8')

    const result = db.prepare(
      'INSERT INTO subtitles (media_id, language, file_path, is_ai) VALUES (?, ?, ?, 1)'
    ).run(mediaId, language, srtPath)

    const row = db.prepare('SELECT * FROM subtitles WHERE id = ?').get(result.lastInsertRowid) as SubtitleRow
    return rowToTrack(row)
  })
}
