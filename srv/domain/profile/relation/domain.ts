import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../../provider'
import { getUserState } from './state'

/**
 * - follow
 * - unfollow
 * - "friending"/"relating"
 * - unfriending/unrelating
 * - chat requests
 */

type Event =
  | { type: 'FollowedUser'; fromUserId: string; toUserId: string }
  | { type: 'UnfollowedUser'; fromUserId: string; toUserId: string }

type Aggregate = {}

type Command =
  | { type: 'FollowUser'; fromUserId: string; toUserId: string }
  | { type: 'UnfollowUser'; fromUserId: string; toUserId: string }

export const relation = createDomain<Event, Aggregate, Command>(
  {
    stream: 'profile-relation',
    provider: getProvider('profile_events'),
    aggregate: () => ({}),
    fold: () => ({}),
  },
  {
    async FollowUser(cmd) {
      const user = await getUserState(cmd.fromUserId)

      const isFollowing = user.following.includes(cmd.toUserId)
      if (isFollowing) throw new CommandError('Already following user')

      return { type: 'FollowedUser', toUserId: cmd.toUserId, fromUserId: cmd.fromUserId }
    },
    async UnfollowUser(cmd) {
      const user = await getUserState(cmd.fromUserId)

      const isFollowing = user.following.includes(cmd.toUserId)
      if (!isFollowing) throw new CommandError('Not following user')

      return { type: 'UnfollowedUser', toUserId: cmd.toUserId, fromUserId: cmd.fromUserId }
    },
  }
)
