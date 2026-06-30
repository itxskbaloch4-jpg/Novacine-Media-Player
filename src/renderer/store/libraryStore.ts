import { create } from 'zustand'
import type { MediaItem, Playlist, Tag } from '../../shared/types/media'

interface LibraryState {
  items: MediaItem[]
  playlists: Playlist[]
  tags: Tag[]
  isLoading: boolean
  searchQuery: string
  filterType: 'all' | 'video' | 'audio'

  setItems: (items: MediaItem[]) => void
  addItem: (item: MediaItem) => void
  removeItem: (id: number) => void
  setPlaylists: (playlists: Playlist[]) => void
  setTags: (tags: Tag[]) => void
  setLoading: (v: boolean) => void
  setSearchQuery: (q: string) => void
  setFilterType: (t: 'all' | 'video' | 'audio') => void

  filteredItems: () => MediaItem[]
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  items: [],
  playlists: [],
  tags: [],
  isLoading: false,
  searchQuery: '',
  filterType: 'all',

  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setPlaylists: (playlists) => set({ playlists }),
  setTags: (tags) => set({ tags }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),

  filteredItems: () => {
    const { items, searchQuery, filterType } = get()
    return items.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType
      const matchesQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesQuery
    })
  },
}))
