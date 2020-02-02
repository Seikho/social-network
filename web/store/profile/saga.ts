import { saga, get, post } from '../store'
import { Profile } from './reducer'

saga('PROFILE_REQUEST_PROFILE', async ({ id }, dispatch) => {
  const requestId = id ? `/${id}` : ''
  const res = await get<{ profile: Profile }>(`/profile${requestId}`)

  if (res.status !== 200) {
    dispatch({ type: 'PROFILE_RECEIVE_PROFILE', error: res.statusText })
    return
  }

  dispatch({ type: 'PROFILE_RECEIVE_PROFILE', profile: res.data.profile })
})

saga('PROFILE_REQUEST_UPDATE', async ({ changes }, dispatch) => {
  const res = await post<{ message: string }>('/profile', changes)
  if (res.status > 200) {
    dispatch({ type: 'PROFILE_RECEIVE_UPDATE', error: res.data.message || res.statusText })
    return
  }

  dispatch({ type: 'PROFILE_RECEIVE_UPDATE' })
})

saga('USER_RECEIVE_LOGIN', async (_, dispatch) => {
  dispatch({ type: 'PROFILE_REQUEST_PROFILE' })
})
