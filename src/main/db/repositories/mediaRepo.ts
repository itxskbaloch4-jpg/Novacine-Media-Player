import { getDb } from '../connection'
import type { MediaItem } from '../../../shared/types/media'

interface MediaRow {
  id: number
  file_path: string
  file_name: string
  title: string
  type: string
  duration: number
  size: number
  width: number | null
  height: number | null
  codec: string | null
  bitrate: number | null
  thumbnail_path: string | null
  added_at: string
  last_played_at: string | null
  play_count: number
  tags: string | null
}

function rowToMediaItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    filePath: row.file_path,
    fileName: row.file_name,
    title: row.title,
    type: row.type as 'video' | 'audio',
    duration: row.duration,
    size: row.size,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    codec: row.codec ?? undefined,
    bitrate: row.bitrate ?? undefined,
    thumbnailPath: row.thumbnail_path ?? undefined,
    addedAt: row.added_at,
    lastPlayedAt: row.last_played_at ?? undefined,
    playCount: row.play_count,
    tags: row.tags ? row.tags.split(',').filter(Boolean) : [],
  }
}

export const mediaRepo = {
  insert(item: Omit<MediaItem, 'id' | 'addedAt' | 'playCount' | 'tags'>): MediaItem {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO media (file_path, file_name, title, type, duration, size, width, height, codec, bitrate, thumbnail_path)
      VALUES (@filePath, @fileName, @title, @type, @duration, @size, @width, @height, @codec, @bitrate, @thumbnailPath)
    `)
    const result = stmt.run({
      filePath: item.filePath,
      fileName: item.fileName,
      title: item.title,
      type: item.type,
      duration: item.duration,
      size: item.size,
      width: item.width ?? null,
      height: item.height ?? null,
      codec: item.codec ?? null,
      bitrate: item.bitrate ?? null,
      thumbnailPath: item.thumbnailPath ?? null,
    })
    return this.getById(result.lastInsertRowid as number)!
  },

  getById(id: number): MediaItem | null {
    const db = getDb()
    const row = db.prepare(`
      SELECT m.*, GROUP_CONCAT(t.name) as tags
      FROM media m
      LEFT JOIN media_tags mt ON mt.media_id = m.id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE m.id = ?
      GROUP BY m.id
    `).get(id) as MediaRow | undefined
    return row ? rowToMediaItem(row) : null
  },

  getAll(): MediaItem[] {
    const db = getDb()
    const rows = db.prepare(`
      SELECT m.*, GROUP_CONCAT(t.name) as tags
      FROM media m
      LEFT JOIN media_tags mt ON mt.media_id = m.id
      LEFT JOIN tags t ON t.id = mt.tag_id
      GROUP BY m.id
      ORDER BY m.added_at DESC
    `).all() as MediaRow[]
    return rows.map(rowToMediaItem)
  },

  search(query: string): MediaItem[] {
    const db = getDb()
    const like = `%${query}%`
    const rows = db.prepare(`
      SELECT m.*, GROUP_CONCAT(t.name) as tags
      FROM media m
      LEFT JOIN media_tags mt ON mt.media_id = m.id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE m.title LIKE ? OR m.file_name LIKE ?
      GROUP BY m.id
      ORDER BY m.added_at DESC
    `).all(like, like) as MediaRow[]
    return rows.map(rowToMediaItem)
  },

  delete(id: number): void {
    getDb().prepare('DELETE FROM media WHERE id = ?').run(id)
  },

  getByPath(filePath: string): MediaItem | null {
    const db = getDb()
    const row = db.prepare(`
      SELECT m.*, GROUP_CONCAT(t.name) as tags
      FROM media m
      LEFT JOIN media_tags mt ON mt.media_id = m.id
      LEFT JOIN tags t ON t.id = mt.tag_id
      WHERE m.file_path = ?
      GROUP BY m.id
    `).get(filePath) as MediaRow | undefined
    return row ? rowToMediaItem(row) : null
  },

  updatePlayCount(id: number): void {
    getDb().prepare(`
      UPDATE media SET play_count = play_count + 1, last_played_at = datetime('now') WHERE id = ?
    `).run(id)
  },
}
