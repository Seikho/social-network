import * as User from './user'
import * as Socket from './socket'
import * as Profile from './profile'
import * as Notify from './notify'
import * as Post from './post'
import * as Search from './search'

export type RootAction =
  | User.Action
  | Socket.Action
  | Profile.Action
  | Notify.Action
  | Post.Action
  | Search.Action
  | Init
  | Navigate

export type RootState = {
  user: User.State
  socket: Socket.State
  profile: Profile.State
  notify: Notify.State
  post: Post.State
  search: Search.State
}

type Init = { type: 'INIT' }
type Navigate = { type: 'NAVIGATE'; to: string }
