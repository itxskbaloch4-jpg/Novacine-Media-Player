import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { ProgressBar } from './ProgressBar'
import { useIpc } from '../../hooks/useIpc'
import { useTranscodeProgress } from '../../hooks/useTranscodeProgress'
import type { MediaItem, TranscodeOptions } from '../../../shared/types/media'

interface TranscodeModalProps {
  open: boolean
  onClose: () => void
  media: MediaItem | null
}

export function TranscodeModal({ open, onClose, media }: TranscodeModalProps) {
  const ipc = useIpc()
  const [jobId, setJobId] = useState<string | null>(null)
  const [format, setFormat] = useState<TranscodeOptions['format']>('mp4')
  const [resolution, setResolution] = useState<TranscodeOptions['resolution']>('original')
  const [outputPath, setOutputPath] = useState('')
  const progress = useTranscodeProgress(jobId)

  const handleStart = async () => {
    if (!media) return
    const path = outputPath || media.filePath.replace(/\.[^.]+$/, `_converted.${format}`)
    const opts: TranscodeOptions = {
      inputPath: media.filePath,
      outputPath: path,
      format,
      resolution,
    }
    const { jobId: id } = await ipc.ffmpeg.transcode(opts)
    setJobId(id)
  }

  const handleCancel = async () => {
    if (jobId) { await ipc.ffmpeg.cancel(jobId); setJobId(null) }
  }

  const isDone = progress?.done ?? false
  const isRunning = !!jobId && !isDone

  return (
    <Modal open={open} onClose={onClose} title="Transcode Media">
      <div className="space-y-4">
        <p className="text-sm text-[#a0a0a0]">{media?.title}</p>

        <div>
          <label className="text-xs text-[#a0a0a0] block mb-1">Output Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as TranscodeOptions['format'])}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white"
            disabled={isRunning}
          >
            {['mp4', 'mkv', 'webm', 'mp3', 'flac'].map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-[#a0a0a0] block mb-1">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as TranscodeOptions['resolution'])}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white"
            disabled={isRunning}
          >
            {['original', '480p', '720p', '1080p', '4K'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <Input
          label="Output Path (optional)"
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="Leave blank for auto"
          disabled={isRunning}
        />

        {progress && (
          <div className="space-y-2">
            <ProgressBar percent={progress.percent} label={isDone ? 'Complete' : `Transcoding… ${progress.speed}`} />
            {progress.error && <p className="text-xs text-red-400">{progress.error}</p>}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          {isRunning
            ? <Button variant="danger" onClick={handleCancel}>Cancel</Button>
            : isDone
            ? <Button variant="secondary" onClick={() => { setJobId(null); onClose() }}>Close</Button>
            : (
              <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleStart} disabled={!media}>Start</Button>
              </>
            )
          }
        </div>
      </div>
    </Modal>
  )
}
