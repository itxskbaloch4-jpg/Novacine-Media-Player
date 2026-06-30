import React, { useEffect } from 'react'
import { Search, Film, Music, Grid } from 'lucide-react'
import { useLibraryStore } from '../store/libraryStore'
import { useIpc } from '../hooks/useIpc'
import { MediaGrid } from '../components/library/MediaGrid'
import { FolderImportButton } from '../components/library/FolderImportButton'

export function Library() {
  const ipc = useIpc()
  const { setItems, setLoading, searchQuery, setSearchQuery, filterType, setFilterType } = useLibraryStore()

  useEffect(() => {
    setLoading(true)
    ipc.library.getAll().then((items) => { setItems(items); setLoading(false) })
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search library…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
          {[['all', Grid], ['video', Film], ['audio', Music]] .map(([type, Icon]) => (
            <button
              key={type as string}
              onClick={() => setFilterType(type as 'all' | 'video' | 'audio')}
              className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${filterType === type ? 'bg-red-600 text-white' : 'text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]'}`}
            >
              <Icon size={13} /> {(type as string).charAt(0).toUpperCase() + (type as string).slice(1)}
            </button>
          ))}
        </div>

        <FolderImportButton />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <MediaGrid />
      </div>
    </div>
  )
}
