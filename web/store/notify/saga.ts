import { saga } from '../store'
import { NotifyKind } from './action'

let notifyId = 0
const defaultKind: NotifyKind = 'info'

saga('NOTIFY_REQUEST', (action, dispatch) => {
  const id = ++notifyId
  dispatch({ type: 'NOTIFY_RAISE', id, kind: action.kind || defaultKind, text: action.text })
  setTimeout(() => dispatch({ type: 'NOTIFY_REMOVE', id }), 8000)
})
