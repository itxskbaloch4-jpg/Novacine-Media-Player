import React, { useState } from 'react'
import { FolderOpen, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { useIpc } from '../../hooks/useIpc'
import { useLibraryStore } from '../../store/libraryStore'
import { Spinner } from '../ui/Spinner'

export function FolderImportButton() {
  const ipc = useIpc()
  const { setItems, items } = useLibraryStore()
  const [loading, setLoading] = useState(false)

  const handleFolder = async () => {
    const folder = await ipc.dialog.openFolder()
    if (!folder) return
    setLoading(true)
    try {
      const newItems = await ipc.library.scanFolder(folder)
      const merged = [...newItems, ...items.filter((i) => !newItems.find((n) => n.id === i.id))]
      setItems(merged)
    } finally {
      setLoading(false)
    }
  }

  const handleFile = async () => {
    const file = await ipc.dialog.openFile()
    if (!file) return
    setLoading(true)
    try {
      const item = await ipc.library.addFile(file)
      if (!items.find((i) => i.id === item.id)) {
        setItems([item, ...items])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handleFile} disabled={loading}>
        {loading ? <Spinner className="w-4 h-4" /> : <Plus size={15} />}
        Add File
      </Button>
      <Button variant="secondary" size="sm" onClick={handleFolder} disabled={loading}>
        <FolderOpen size={15} />
        Import Folder
      </Button>
    </div>
  )
}
