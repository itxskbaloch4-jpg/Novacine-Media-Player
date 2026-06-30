import { useEffect, useState } from 'react'
import { useIpc } from './useIpc'
import type { TranscodeProgress } from '../../shared/types/media'

export function useTranscodeProgress(jobId: string | null) {
  const ipc = useIpc()
  const [progress, setProgress] = useState<TranscodeProgress | null>(null)

  useEffect(() => {
    if (!jobId) { setProgress(null); return }
    const unsub = ipc.ffmpeg.onProgress((p) => {
      if (p.jobId === jobId) setProgress(p)
    })
    return unsub
  }, [jobId, ipc])

  return progress
}
