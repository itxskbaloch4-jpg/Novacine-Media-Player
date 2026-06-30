import React, { useEffect, useState } from 'react'
import { useIpc } from '../hooks/useIpc'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { AppSettings } from '../../shared/types/media'

export function Settings() {
  const ipc = useIpc()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { ipc.settings.get().then(setSettings) }, [])

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const save = async () => {
    if (!settings) return
    const updated = await ipc.settings.set(settings)
    setSettings(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <div className="flex items-center justify-center h-full"><div className="text-[#555]">Loading…</div></div>

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold text-white">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-[#a0a0a0] uppercase tracking-widest">Appearance</h2>
        <div>
          <label className="text-xs text-[#a0a0a0] block mb-1">Theme</label>
          <select value={settings.theme} onChange={(e) => update('theme', e.target.value as AppSettings['theme'])}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white w-full">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-[#a0a0a0] uppercase tracking-widest">Playback</h2>
        <div>
          <label className="text-xs text-[#a0a0a0] block mb-1">Default Volume: {Math.round(settings.defaultVolume * 100)}%</label>
          <input type="range" min={0} max={1} step={0.05} value={settings.defaultVolume}
            onChange={(e) => update('defaultVolume', parseFloat(e.target.value))}
            className="w-full accent-red-600" />
        </div>
        <div>
          <label className="text-xs text-[#a0a0a0] block mb-1">Subtitle Font Size: {settings.subtitleFontSize}px</label>
          <input type="range" min={10} max={36} step={1} value={settings.subtitleFontSize}
            onChange={(e) => update('subtitleFontSize', parseInt(e.target.value))}
            className="w-full accent-red-600" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.hardwareAcceleration}
            onChange={(e) => update('hardwareAcceleration', e.target.checked)}
            className="accent-red-600" />
          <span className="text-sm text-white">Hardware Acceleration</span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-[#a0a0a0] uppercase tracking-widest">FFmpeg</h2>
        <Input label="FFmpeg Binary Path" value={settings.ffmpegPath}
          onChange={(e) => update('ffmpegPath', e.target.value)}
          placeholder="Leave blank to use bundled FFmpeg" />
        <Input label="Default Output Directory" value={settings.defaultOutputDir}
          onChange={(e) => update('defaultOutputDir', e.target.value)} />
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={save}>Save Settings</Button>
        {saved && <span className="text-sm text-green-400">Saved!</span>}
      </div>
    </div>
  )
}
