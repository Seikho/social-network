import { v4 } from 'uuid'
import { handle, StatusError } from 'svcready'
import { profiles } from '../../domain/profile'

export const follow = handle(async (req, res) => {
  const fromUserId = req.session.userId
  if (!fromUserId) throw new StatusError('Unauthorized', 401)

  const toUserId = req.params.id
  if (!toUserId) throw new StatusError('No follow id provided', 400)

  await profiles.relations.cmd.FollowUser(v4(), { fromUserId, toUserId })
  res.json({ message: 'ok' })
})

export const unfollow = handle(async (req, res) => {
  const fromUserId = req.session.userId
  if (!fromUserId) throw new StatusError('Unauthorized', 401)

  const toUserId = req.params.id
  if (!toUserId) throw new StatusError('No unfollow id provided', 400)

  await profiles.relations.cmd.UnfollowUser(v4(), { fromUserId, toUserId })
  res.json({ message: 'ok' })
})
