import { relation } from './domain'
import { MemoryBookmark } from 'evtstore'

export type FollowModel = {
  userId: string
  followers: string[]
  following: string[]
}

type UserId = string

const model = new Map<UserId, FollowModel>()

export const populator = relation.handler(MemoryBookmark)

populator.handle('FollowedUser', async (_, ev) => {
  await followUser(ev.fromUserId, ev.toUserId)
})

populator.handle('UnfollowedUser', async (_, ev) => {
  await unfollowUser(ev.fromUserId, ev.toUserId)
})

export async function getUserFollows(userId: string): Promise<FollowModel> {
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
