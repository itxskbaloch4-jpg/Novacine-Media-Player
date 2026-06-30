import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'novacine.db')
  const migrationPath = path.join(__dirname, 'migrations', '0001_init.sql')

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Run migration
  if (fs.existsSync(migrationPath)) {
    const sql = fs.readFileSync(migrationPath, 'utf-8')
    db.exec(sql)
  }

  return db
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
