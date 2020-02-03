import { RelationEvent } from './domain'
import { MemoryBookmark, createHandler } from 'evtstore'
import { Relation } from './types'
import { getProvider } from '../../provider'
import { FollowEvent } from './follow'

// export const populator = relation.handler(MemoryBookmark)

type Event = RelationEvent | FollowEvent

export const populator = createHandler(MemoryBookmark, [], getProvider<Event>('profile_events'))

export type RelateModel = {
  userId: string
  toUserId: string
  following: boolean
  followedBy: boolean
  related: boolean
  from: Relation
  to: Relation
  pending?: { from: Relation; to: Relation }
}

/** {userId}-{toUserId} */
type Key = string

const records = new Map<Key, RelateModel>()

populator.handle('RelationRequested', async (_, ev) => {
  await updateRelation(ev.left.userId, ev.right.userId, {
    pending: { from: ev.left.relation, to: ev.right.relation },
  })

  await updateRelation(ev.right.userId, ev.left.userId, {
    pending: { from: ev.right.relation, to: ev.left.relation },
  })
})

populator.handle('RelationRejected', async (_, ev) => {
  await removeUserRelation(ev.leftId, ev.rightId)
})

populator.handle('RelationAccepted', async (_, ev) => {
  await updateRelation(ev.left.userId, ev.right.userId, {
    related: true,
    pending: undefined,
    from: ev.left.relation,
    to: ev.right.relation,
  })
  await updateRelation(ev.right.userId, ev.left.userId, {
    related: true,
    pending: undefined,
    from: ev.right.relation,
    to: ev.left.relation,
  })
})

populator.handle('RelationRemoved', async (_, ev) => {
  await removeUserRelation(ev.leftId, ev.rightId)
  await removeUserRelation(ev.rightId, ev.leftId)
})

populator.handle('FollowedUser', async (_, ev) => {
  await updateRelation(ev.fromUserId, ev.toUserId, { following: true })
  await updateRelation(ev.toUserId, ev.fromUserId, { followedBy: true })
})

populator.handle('UnfollowedUser', async (_, ev) => {
  await updateRelation(ev.fromUserId, ev.toUserId, { following: false })
  await updateRelation(ev.toUserId, ev.fromUserId, { followedBy: false })
})

export async function getUserRelation(userId: string, toUserId: string) {
  const key = toKey(userId, toUserId)
  const existing = records.get(key)
  if (existing) return existing

  const newRelation = toNewRelation(userId, toUserId)
  records.set(key, newRelation)
  return newRelation
}

async function removeUserRelation(userId: string, toUserId: string) {
  await updateRelation(userId, toUserId, {
    related: false,
    from: Relation.NotSet,
    to: Relation.NotSet,
  })
}

async function updateRelation(userId: string, toUserId: string, relate: Partial<RelateModel>) {
  const key = toKey(userId, toUserId)
  const existing = await getUserRelation(userId, toUserId)

  const nextRelate: RelateModel = {
    ...existing,
    ...relate,
    userId: toUserId,
  }

  records.set(key, nextRelate)
}

function toNewRelation(userId: string, toUserId: string) {
  const newRelation: RelateModel = {
    userId,
    toUserId,
    following: false,
    followedBy: false,
    related: false,
    to: Relation.NotSet,
    from: Relation.NotSet,
  }
  return newRelation
}

function toKey(userId: string, toUserId: string) {
  return `${userId}-${toUserId}`
}
