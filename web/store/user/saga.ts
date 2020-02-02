import { saga, post, clearToken, setToken, getToken } from '../store'
import { decode } from 'jsonwebtoken'
import { Token } from 'svcready'

saga('INIT', (_, dispatch) => {
  function checkToken() {
    // Check this every 5 seconds
    // TODO: Re-auth on expiry instead of insta-logout
    setTimeout(checkToken, 5000)

    const token = getToken()
    if (!token) return

    const payload = decode(token) as Token

    const isExpired = payload.exp * 1000 < Date.now()
    if (isExpired) {
      clearToken()
    }

    return payload
  }

  const payload = checkToken()
  if (!payload) return

  dispatch({ type: 'USER_RECEIVE_LOGIN', userId: payload.userId })
})

saga('USER_REQUEST_LOGIN', async ({ username, password }, dispatch) => {
  const result = await post<{ token: string }>('/login', {
    username,
    password,
  })

  if (result.status <= 200) {
    dispatch({ type: 'USER_RECEIVE_LOGIN', userId: username })
    setToken(result.data.token)
    return
  }

  dispatch({ type: 'NOTIFY_REQUEST', text: 'Failed to login', kind: 'error' })
  dispatch({ type: 'USER_RECEIVE_LOGIN', error: result.statusText })
})

saga('USER_REQUEST_REGISTER', async ({ username, password }, dispatch) => {
  const result = await post<{ token: string }>('/user/register', { username, password })
  if (result.status > 200) {
    // Error
    return
  }

  setToken(result.data.token)
  dispatch({ type: 'USER_RECEIVE_LOGIN', userId: username })
})

saga('USER_REQUEST_REGISTER', (_, dispatch) => {
  dispatch({ type: 'SOCKET_REQUEST_RECONNECT' })
})
