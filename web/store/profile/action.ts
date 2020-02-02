import { Profile } from './reducer'

export type Action =
  | RequestProfile
  | ReceiveProfile
  | RequestUpdate
  | ReceiveUpdate
  | RequestSelf
  | ReceiveSelf
  | RequestFollow
  | RequestUnfollow
  | ReceiveFollow
  | ReceiveUnfollow

type RequestProfile = {
  type: 'PROFILE_REQUEST_PROFILE'
  id?: string
}

type ReceiveProfile = {
  type: 'PROFILE_RECEIVE_PROFILE'
  profile?: Profile
  error?: string
}

type RequestUpdate = {
  type: 'PROFILE_REQUEST_UPDATE'
  changes: { nickname?: string; role?: string; description?: string }
}

type ReceiveUpdate = {
  type: 'PROFILE_RECEIVE_UPDATE'
  error?: string
}

type RequestSelf = {
  type: 'PROFILE_REQUEST_SELF'
}

type ReceiveSelf = {
  type: 'PROFILE_RECEIVE_SELF'
  profile?: Profile
  error?: string
}

type RequestFollow = {
  type: 'PROFILE_REQUEST_FOLLOW'
  userId: string
}

type RequestUnfollow = {
  type: 'PROFILE_REQUEST_UNFOLLOW'
  userId: string
}

type ReceiveFollow = {
  type: 'PROFILE_RECEIVE_FOLLOW'
  userId: string
  error?: string
}

type ReceiveUnfollow = {
  type: 'PROFILE_RECEIVE_UNFOLLOW'
  userId: string
  error?: string
}
