import React, { useEffect, useState } from 'react'
import { Plus, Trash2, ListMusic, Play } from 'lucide-react'
import { useIpc } from '../hooks/useIpc'
import { useLibraryStore } from '../store/libraryStore'
import { usePlayerStore } from '../store/playerStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { Playlist, PlaylistItem } from '../../shared/types/media'

export function Playlists() {
  const ipc = useIpc()
  const { playlists, setPlaylists } = useLibraryStore()
  const { setQueue } = usePlayerStore()
  const [selected, setSelected] = useState<Playlist | null>(null)
  const [items, setItems] = useState<PlaylistItem[]>([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    ipc.playlists.getAll().then(setPlaylists)
  }, [])

  useEffect(() => {
    if (selected) ipc.playlists.getItems(selected.id).then(setItems)
  }, [selected])

  const createPlaylist = async () => {
    if (!newName.trim()) return
    const p = await ipc.playlists.create(newName.trim())
    setPlaylists([...playlists, p])
    setNewName('')
  }

  const deletePlaylist = async (id: number) => {
    await ipc.playlists.delete(id)
    setPlaylists(playlists.filter((p) => p.id !== id))
    if (selected?.id === id) { setSelected(null); setItems([]) }
  }

  const playPlaylist = () => {
    const mediaItems = items.map((i) => i.media!).filter(Boolean)
    if (mediaItems.length > 0) setQueue(mediaItems, 0)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#1a1a1a] flex flex-col">
        <div className="p-4 border-b border-[#1a1a1a]">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
              placeholder="New playlist…"
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-red-600"
            />
            <Button size="sm" onClick={createPlaylist}><Plus size={14} /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {playlists.map((p) => (
            <div
              key={p.id}
              className={`group flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-[#1a1a1a] transition-colors ${selected?.id === p.id ? 'bg-[#1a1a1a] text-white' : 'text-[#a0a0a0]'}`}
              onClick={() => setSelected(p)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <ListMusic size={14} className="shrink-0" />
                <span className="text-sm truncate">{p.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id) }}
                className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">{selected.name}</h2>
              <Button size="sm" onClick={playPlaylist} disabled={items.length === 0}>
                <Play size={13} /> Play All
              </Button>
            </div>
            {items.length === 0 ? (
              <p className="text-[#555] text-sm">No items in this playlist.</p>
            ) : (
              <div className="space-y-1">
                {items.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3 px-3 py-2 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                    <span className="text-[#555] text-xs w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.media?.title ?? 'Unknown'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#333]">
            <p>Select a playlist</p>
          </div>
        )}
      </div>
    </div>
  )
}
