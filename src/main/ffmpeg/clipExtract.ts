import { runFFmpeg } from './ffmpegRunner'
import type { ClipOptions, TranscodeProgress } from '../../shared/types/media'

export function extractClip(
  options: ClipOptions,
  onProgress: (p: TranscodeProgress) => void,
  ffmpegPath?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const duration = options.endTime - options.startTime
    const args = [
      '-y',
      '-ss', String(options.startTime),
      '-i', options.inputPath,
      '-t', String(duration),
      '-c', 'copy',
      options.outputPath,
    ]

    const jobId = runFFmpeg(
      args,
      (info) => {
        onProgress({
          jobId,
          percent: info.percent,
          fps: info.fps,
          speed: info.speed,
          eta: info.eta,
          done: false,
        })
      },
      (code) => {
        if (code === 0) {
          onProgress({ jobId, percent: 100, fps: 0, speed: '1x', eta: 0, done: true })
          resolve(jobId)
        } else {
          reject(new Error(`Clip extraction failed with code ${code}`))
        }
      },
      (err) => reject(err),
      ffmpegPath
    )

    resolve(jobId)
  })
}
