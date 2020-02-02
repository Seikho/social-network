import { relation } from './domain'
import { followUser, unfollowUser } from './state'
import { MemoryBookmark } from 'evtstore'

export const manager = relation.handler(MemoryBookmark)

manager.handle('FollowedUser', async (_, ev) => {
  await followUser(ev.fromUserId, ev.toUserId)
})

manager.handle('UnfollowedUser', async (_, ev) => {
  await unfollowUser(ev.fromUserId, ev.toUserId)
})
