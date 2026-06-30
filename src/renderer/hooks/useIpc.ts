import { useCallback } from 'react'
import type { NovacineAPI } from '../../shared/types/ipc-events'

declare global {
  interface Window {
    novacine: NovacineAPI
  }
}

export function useIpc(): NovacineAPI {
  return window.novacine
}
