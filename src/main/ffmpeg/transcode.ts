import { runFFmpeg } from './ffmpegRunner'
import type { TranscodeOptions, TranscodeProgress } from '../../shared/types/media'

const resolutionMap: Record<string, string[]> = {
  '480p': ['-vf', 'scale=-2:480'],
  '720p': ['-vf', 'scale=-2:720'],
  '1080p': ['-vf', 'scale=-2:1080'],
  '4K': ['-vf', 'scale=-2:2160'],
}

export function startTranscode(
  options: TranscodeOptions,
  onProgress: (p: TranscodeProgress) => void,
  ffmpegPath?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const args: string[] = ['-y', '-i', options.inputPath]

    if (options.startTime !== undefined) args.push('-ss', String(options.startTime))
    if (options.endTime !== undefined) args.push('-to', String(options.endTime))

    if (options.resolution && options.resolution !== 'original') {
      args.push(...(resolutionMap[options.resolution] ?? []))
    }

    if (options.videoBitrate) args.push('-b:v', options.videoBitrate)
    if (options.audioBitrate) args.push('-b:a', options.audioBitrate)
    if (options.fps) args.push('-r', String(options.fps))

    // Format-specific codecs
    switch (options.format) {
      case 'mp4':
        args.push('-c:v', 'libx264', '-c:a', 'aac', '-movflags', '+faststart')
        break
      case 'mkv':
        args.push('-c:v', 'libx264', '-c:a', 'aac')
        break
      case 'webm':
        args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus')
        break
      case 'mp3':
        args.push('-vn', '-c:a', 'libmp3lame', '-q:a', '2')
        break
      case 'flac':
        args.push('-vn', '-c:a', 'flac')
        break
    }

    args.push(options.outputPath)

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
          onProgress({ jobId, percent: 0, fps: 0, speed: '0x', eta: 0, done: true, error: `Exit code ${code}` })
          reject(new Error(`FFmpeg exited with code ${code}`))
        }
      },
      (err) => {
        onProgress({ jobId, percent: 0, fps: 0, speed: '0x', eta: 0, done: true, error: err.message })
        reject(err)
      },
      ffmpegPath
    )

    resolve(jobId) // return jobId immediately so caller can track
  })
}
