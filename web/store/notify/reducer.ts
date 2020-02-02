import { createReducer } from '../store'
import { Action, NotifyKind } from './action'

export type State = {
  notifications: Notification[]
}

type Notification = { id: number; kind: NotifyKind; text: string }

const init: State = { notifications: [] }

export const reducer = createReducer<Action, 'notify'>('notify', init)

reducer('NOTIFY_RAISE', (state, action) => {
  const next = state.notifications.concat({ id: action.id, kind: action.kind, text: action.text })
  return { notifications: next }
})

reducer('NOTIFY_REMOVE', (state, action) => {
  return {
    notifications: state.notifications.filter(notify => notify.id !== action.id),
  }
})
