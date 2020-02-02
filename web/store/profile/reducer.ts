import { createReducer } from '../store'
import { Action } from './action'
import { API } from '../../../srv/domain/profile/types'

export type State = {
  user?: Profile
  view: {
    profile?: Profile
    loading: boolean
    error?: string
  }
  update: {
    loading: boolean
    error?: string
  }
}

export type Profile = API.Profile

export const reducer = createReducer<Action, 'profile'>('profile', {
  view: { loading: false },
  update: { loading: false },
})

reducer('PROFILE_REQUEST_PROFILE', { view: { loading: true, error: undefined } })

reducer('PROFILE_RECEIVE_PROFILE', (_, action) => {
  return {
    view: {
      loading: false,
      profile: action.profile,
      error: action.error,
    },
  }
})

reducer('PROFILE_REQUEST_UPDATE', { update: { loading: true } })

reducer('PROFILE_RECEIVE_UPDATE', (_, action) => {
  return {
    update: {
      loading: false,
      error: action.error,
    },
  }
})

reducer('PROFILE_RECEIVE_SELF', (_, action) => {
  return {
    user: action.profile,
  }
})

reducer('PROFILE_RECEIVE_FOLLOW', ({ user }, { userId, error }) => {
  if (error) return
  if (!user) return

  return {
    user: {
      ...user,
      following: user.following.concat(userId),
    },
  }
})

reducer('PROFILE_RECEIVE_UNFOLLOW', ({ user }, { userId, error }) => {
  if (error) return
  if (!user) return

  return {
    user: {
      ...user,
      following: user.following.filter(id => id !== userId),
    },
  }
})
