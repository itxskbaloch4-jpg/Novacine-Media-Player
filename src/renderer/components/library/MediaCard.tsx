import React from 'react'
import { Play, Trash2, Film, Music } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import type { MediaItem } from '../../../shared/types/media'

interface MediaCardProps {
  item: MediaItem
  onRemove: (id: number) => void
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function MediaCard({ item, onRemove }: MediaCardProps) {
  const { setCurrentMedia, setQueue, setIsPlaying } = usePlayerStore()

  const handlePlay = () => {
    setCurrentMedia(item)
    setIsPlaying(true)
  }

  return (
    <div className="group relative bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] hover:border-[#404040] transition-all overflow-hidden">
      {/* Thumbnail / Icon area */}
      <div className="aspect-video bg-[#111] flex items-center justify-center relative">
        {item.thumbnailPath ? (
          <img src={`file://${item.thumbnailPath}`} alt={item.title}
            className="w-full h-full object-cover" />
        ) : (
          <div className="text-[#333]">
            {item.type === 'video' ? <Film size={40} /> : <Music size={40} />}
          </div>
        )}

        {/* Play overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors"
        >
          <div className="bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 transform duration-200">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate" title={item.title}>{item.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#555]">
            {item.duration > 0 ? formatDuration(item.duration) : '—'} · {formatSize(item.size)}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[#555] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
        {item.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[#222] text-[#a0a0a0] rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
