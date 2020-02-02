import { Profile } from './reducer'

export type Action = RequestProfile | ReceiveProfile | RequestUpdate | ReceiveUpdate

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
