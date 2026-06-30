import { getDb } from '../connection'
import type { Playlist, PlaylistItem, MediaItem } from '../../../shared/types/media'

interface PlaylistRow {
  id: number
  name: string
  description: string | null
  created_at: string
  item_count: number
}

interface PlaylistItemRow {
  id: number
  playlist_id: number
  media_id: number
  position: number
  // media fields
  file_path?: string
  file_name?: string
  title?: string
  type?: string
  duration?: number
  size?: number
  play_count?: number
  added_at?: string
}

export const playlistRepo = {
  getAll(): Playlist[] {
    const db = getDb()
    const rows = db.prepare(`
      SELECT p.*, COUNT(pi.id) as item_count
      FROM playlists p
      LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all() as PlaylistRow[]
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      createdAt: r.created_at,
      itemCount: r.item_count,
    }))
  },

  create(name: string, description?: string): Playlist {
    const db = getDb()
    const result = db.prepare(
      'INSERT INTO playlists (name, description) VALUES (?, ?)'
    ).run(name, description ?? null)
    return this.getById(result.lastInsertRowid as number)!
  },

  getById(id: number): Playlist | null {
    const db = getDb()
    const row = db.prepare(`
      SELECT p.*, COUNT(pi.id) as item_count
      FROM playlists p
      LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(id) as PlaylistRow | undefined
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      createdAt: row.created_at,
      itemCount: row.item_count,
    }
  },

  delete(id: number): void {
    getDb().prepare('DELETE FROM playlists WHERE id = ?').run(id)
  },

  addItem(playlistId: number, mediaId: number): PlaylistItem {
    const db = getDb()
    const maxPos = (db.prepare(
      'SELECT MAX(position) as mp FROM playlist_items WHERE playlist_id = ?'
    ).get(playlistId) as { mp: number | null }).mp ?? -1

    const result = db.prepare(
      'INSERT OR IGNORE INTO playlist_items (playlist_id, media_id, position) VALUES (?, ?, ?)'
    ).run(playlistId, mediaId, maxPos + 1)

    return db.prepare('SELECT * FROM playlist_items WHERE id = ?').get(result.lastInsertRowid) as PlaylistItem
  },

  removeItem(id: number): void {
    getDb().prepare('DELETE FROM playlist_items WHERE id = ?').run(id)
  },

  getItems(playlistId: number): PlaylistItem[] {
    const db = getDb()
    const rows = db.prepare(`
      SELECT pi.*, m.file_path, m.file_name, m.title, m.type, m.duration, m.size, m.play_count, m.added_at
      FROM playlist_items pi
      JOIN media m ON m.id = pi.media_id
      WHERE pi.playlist_id = ?
      ORDER BY pi.position ASC
    `).all(playlistId) as PlaylistItemRow[]

    return rows.map(r => ({
      id: r.id,
      playlistId: r.playlist_id,
      mediaId: r.media_id,
      position: r.position,
      media: r.file_path ? {
        id: r.media_id,
        filePath: r.file_path,
        fileName: r.file_name!,
        title: r.title!,
        type: r.type as 'video' | 'audio',
        duration: r.duration!,
        size: r.size!,
        playCount: r.play_count!,
        addedAt: r.added_at!,
        tags: [],
      } as MediaItem : undefined,
    }))
  },
}
