import { getDb } from '../connection'
import type { Tag } from '../../../shared/types/media'

interface TagRow {
  id: number
  name: string
  color: string
}

export const tagRepo = {
  getAll(): Tag[] {
    return getDb().prepare('SELECT * FROM tags ORDER BY name').all() as Tag[]
  },

  create(name: string, color: string): Tag {
    const db = getDb()
    const result = db.prepare('INSERT INTO tags (name, color) VALUES (?, ?)').run(name, color)
    return db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid) as Tag
  },

  assign(mediaId: number, tagId: number): void {
    getDb().prepare(
      'INSERT OR IGNORE INTO media_tags (media_id, tag_id) VALUES (?, ?)'
    ).run(mediaId, tagId)
  },

  remove(mediaId: number, tagId: number): void {
    getDb().prepare(
      'DELETE FROM media_tags WHERE media_id = ? AND tag_id = ?'
    ).run(mediaId, tagId)
  },
}
