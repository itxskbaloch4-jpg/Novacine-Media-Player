import React from 'react'
import { MediaCard } from './MediaCard'
import { useLibraryStore } from '../../store/libraryStore'
import { Spinner } from '../ui/Spinner'

export function MediaGrid() {
  const { filteredItems, isLoading, removeItem } = useLibraryStore()
  const items = filteredItems()

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div className="text-[#333]">
          <div className="text-5xl mb-3">🎬</div>
          <p className="text-[#555]">No media found. Import files or a folder.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} onRemove={removeItem} />
      ))}
    </div>
  )
}
