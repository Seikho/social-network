import { createReducer } from '../store'
import { Action } from './action'

export type State = {
  client?: WebSocket
}

const init: State = {}

const handle = createReducer<Action, 'socket'>('socket', init)

handle('SOCKET_RECEIVE_CONNECT', (_, action) => {
  return {
    client: action.client,
  }
})
