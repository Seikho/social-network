import { createDomain, CommandError, MemoryBookmark } from 'evtstore'
import { getProvider } from '../provider'

export type FollowModel = {
  userId: string
  followers: string[]
  following: string[]
}

type UserId = string

const model = new Map<UserId, FollowModel>()

type Command =
  | { type: 'FollowUser'; fromUserId: string; toUserId: string }
  | { type: 'UnfollowUser'; fromUserId: string; toUserId: string }

type Event =
  | { type: 'FollowedUser'; fromUserId: string; toUserId: string }
  | { type: 'UnfollowedUser'; fromUserId: string; toUserId: string }

type Aggregate = {
  following: boolean
}

const { command, handler } = createDomain<Event, Aggregate, Command>(
  {
    stream: 'profile-follow',
    provider: getProvider('profile_events'),
    fold: ev => {
      switch (ev.type) {
        case 'FollowedUser':
          return { following: true }

        case 'UnfollowedUser':
          return { following: false }
      }
    },
    aggregate: () => ({ following: false }),
  },
  {
    async FollowUser(cmd, agg) {
      if (agg.following) throw new CommandError('Already following user')
      return { type: 'FollowedUser', toUserId: cmd.toUserId, fromUserId: cmd.fromUserId }
    },
    async UnfollowUser(cmd, agg) {
      if (!agg.following) throw new CommandError('Not following user')

      return { type: 'UnfollowedUser', toUserId: cmd.toUserId, fromUserId: cmd.fromUserId }
    },
  }
)

const populator = handler(MemoryBookmark)

populator.handle('FollowedUser', async (_, ev) => {
  await followUser(ev.fromUserId, ev.toUserId)
})

populator.handle('UnfollowedUser', async (_, ev) => {
  await unfollowUser(ev.fromUserId, ev.toUserId)
})

async function getUserFollows(userId: string): Promise<FollowModel> {
  const existing = model.get(userId)
  if (existing) return existing

  return {
    userId,
    followers: [],
    following: [],
  }
}

async function followUser(fromUser: string, toUser: string) {
  const source = await getUserFollows(fromUser)
  const dest = await getUserFollows(toUser)

  source.following.push(toUser)
  dest.followers.push(fromUser)

  model.set(fromUser, source)
  model.set(toUser, dest)
}

async function unfollowUser(fromUser: string, toUser: string) {
  const source = await getUserFollows(fromUser)
  const dest = await getUserFollows(toUser)

  source.following = source.followers.filter(id => id !== toUser)
  dest.followers = dest.followers.filter(id => id !== fromUser)

  model.set(fromUser, source)
  model.set(toUser, dest)
}

export const follow = {
  cmd: command,
  populator,
  getUserFollows,
}
