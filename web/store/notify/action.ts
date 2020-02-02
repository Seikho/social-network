export type Action =
  | { type: 'NOTIFY_REQUEST'; text: string; kind?: NotifyKind }
  | { type: 'NOTIFY_RAISE'; id: number; text: string; kind: NotifyKind }
  | { type: 'NOTIFY_REMOVE'; id: number }

export type NotifyKind = 'error' | 'warn' | 'info' | 'success'
