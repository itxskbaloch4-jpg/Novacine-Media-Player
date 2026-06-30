import React, { useState } from 'react'
import { Library, Player, Playlists, Settings } from './pages'
import { Film, Library as LibIcon, ListMusic, Settings as SettingsIcon } from 'lucide-react'

type Page = 'library' | 'player' | 'playlists' | 'settings'

export default function App() {
  const [page, setPage] = useState<Page>('library')

  const nav: { id: Page; label: string; Icon: React.ElementType }[] = [
    { id: 'library', label: 'Library', Icon: LibIcon },
    { id: 'player', label: 'Player', Icon: Film },
    { id: 'playlists', label: 'Playlists', Icon: ListMusic },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[200px] border-r border-[#1a1a1a] flex flex-col">
        {/* Title bar area — draggable */}
        <div className="h-10 drag-region flex items-center px-4">
          <span className="text-red-500 font-bold text-sm tracking-wider">NOVACINE</span>
        </div>

        <nav className="flex-1 py-2">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`no-drag w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${page === id ? 'text-white bg-[#1a1a1a]' : 'text-[#555] hover:text-[#a0a0a0] hover:bg-[#111]'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        {page === 'library' && <Library />}
        {page === 'player' && <Player />}
        {page === 'playlists' && <Playlists />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  )
}
