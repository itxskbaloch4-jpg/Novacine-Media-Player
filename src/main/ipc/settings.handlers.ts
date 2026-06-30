import { ipcMain, app } from 'electron'
import path from 'path'
import fs from 'fs'
import { IPC_CHANNELS } from '../../shared/constants'
import type { AppSettings } from '../../shared/types/media'

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json')

const defaultSettings: AppSettings = {
  theme: 'dark',
  ffmpegPath: '',
  defaultOutputDir: app.getPath('videos'),
  autoScan: false,
  defaultVolume: 0.8,
  subtitleFontSize: 18,
  hardwareAcceleration: false,
  language: 'en',
}

function readSettings(): AppSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
      return { ...defaultSettings, ...JSON.parse(raw) }
    }
  } catch {}
  return { ...defaultSettings }
}

function writeSettings(settings: AppSettings): void {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8')
}

export function registerSettingsHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, () => readSettings())

  ipcMain.handle(IPC_CHANNELS.SETTINGS_SET, (_e, partial: Partial<AppSettings>) => {
    const current = readSettings()
    const updated = { ...current, ...partial }
    writeSettings(updated)
    return updated
  })
}
