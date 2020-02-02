import { createReducer, clearToken } from '../store'
import { Action } from './action'

export type State = {
  isLoggedIn: boolean
  userId?: string
  error?: string
}

const reducer = createReducer<Action, 'user'>('user', { isLoggedIn: false })

reducer('USER_RECEIVE_LOGIN', (_, action) => {
  if (action.error) {
    return
  }

  return {
    isLoggedIn: true,
    userId: action.userId,
    error: action.error,
  }
})

reducer('USER_REQUEST_LOGOUT', () => {
  clearToken()
  return { isLoggedIn: false, userId: '', error: '' }
})
