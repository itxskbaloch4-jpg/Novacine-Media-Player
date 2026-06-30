import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import { startTranscode } from '../ffmpeg/transcode'
import { extractClip } from '../ffmpeg/clipExtract'
import { cancelJob } from '../ffmpeg/ffmpegRunner'
import type { TranscodeOptions, ClipOptions, TranscodeProgress } from '../../shared/types/media'

function getMainWindow(): BrowserWindow | null {
  const windows = BrowserWindow.getAllWindows()
  return windows.length > 0 ? windows[0] : null
}

export function registerFFmpegHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.FFMPEG_TRANSCODE, async (_e, options: TranscodeOptions) => {
    const jobId = await startTranscode(
      options,
      (progress: TranscodeProgress) => {
        getMainWindow()?.webContents.send(IPC_CHANNELS.FFMPEG_PROGRESS, progress)
      }
    )
    return { jobId }
  })

  ipcMain.handle(IPC_CHANNELS.FFMPEG_CLIP, async (_e, options: ClipOptions) => {
    const jobId = await extractClip(
      options,
      (progress: TranscodeProgress) => {
        getMainWindow()?.webContents.send(IPC_CHANNELS.FFMPEG_PROGRESS, progress)
      }
    )
    return { jobId }
  })

  ipcMain.handle(IPC_CHANNELS.FFMPEG_CANCEL, (_e, { jobId }: { jobId: string }) => {
    cancelJob(jobId)
  })
}
