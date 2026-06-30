import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { app } from 'electron'
import { v4 as uuidv4 } from 'crypto'

export interface ProgressInfo {
  percent: number
  fps: number
  speed: string
  eta: number
}

type ProgressCallback = (info: ProgressInfo) => void
type DoneCallback = (code: number | null) => void
type ErrorCallback = (err: Error) => void

const activeJobs = new Map<string, ChildProcess>()

function getFFmpegPath(customPath?: string): string {
  if (customPath && customPath.trim()) return customPath

  const resourcesPath = app.isPackaged
    ? path.join(process.resourcesPath, 'ffmpeg')
    : path.join(app.getAppPath(), 'resources', 'ffmpeg')

  const binary = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  return path.join(resourcesPath, binary)
}

export function runFFmpeg(
  args: string[],
  onProgress: ProgressCallback,
  onDone: DoneCallback,
  onError: ErrorCallback,
  ffmpegPath?: string
): string {
  const jobId = uuidv4()
  const bin = getFFmpegPath(ffmpegPath)

  const proc = spawn(bin, args)
  activeJobs.set(jobId, proc)

  let totalDuration = 0
  let stderr = ''

  proc.stderr.setEncoding('utf8')
  proc.stderr.on('data', (chunk: string) => {
    stderr += chunk

    // Parse duration once
    if (!totalDuration) {
      const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.?\d*)/)
      if (durMatch) {
        totalDuration =
          parseInt(durMatch[1]) * 3600 +
          parseInt(durMatch[2]) * 60 +
          parseFloat(durMatch[3])
      }
    }

    // Parse progress lines
    const timeMatch = chunk.match(/time=(\d+):(\d+):(\d+\.?\d*)/)
    const fpsMatch = chunk.match(/fps=\s*([\d.]+)/)
    const speedMatch = chunk.match(/speed=\s*([\d.x]+)/)

    if (timeMatch) {
      const elapsed =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseFloat(timeMatch[3])
      const percent = totalDuration ? Math.min((elapsed / totalDuration) * 100, 99) : 0
      const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 0
      const speed = speedMatch ? speedMatch[1] : '?'
      const eta = fps > 0 && totalDuration
        ? Math.round((totalDuration - elapsed) / (fps * 0.04))
        : 0

      onProgress({ percent, fps, speed, eta })
    }
  })

  proc.on('close', (code) => {
    activeJobs.delete(jobId)
    onDone(code)
  })

  proc.on('error', (err) => {
    activeJobs.delete(jobId)
    onError(err)
  })

  return jobId
}

export function cancelJob(jobId: string): void {
  const proc = activeJobs.get(jobId)
  if (proc) {
    proc.kill('SIGTERM')
    activeJobs.delete(jobId)
  }
}
