import { handle, StatusError } from 'svcready'
import { profiles } from '../../domain/profile'

export const follow = handle(async (req, res) => {
  const fromUserId = req.session.userId
  if (!fromUserId) throw new StatusError('Unauthorized', 401)

  const toUserId = req.params.id
  if (!toUserId) throw new StatusError('No follow id provided', 400)

  const id = `${fromUserId}--${toUserId}`

  await profiles.follow.cmd.FollowUser(id, { fromUserId, toUserId })
  res.json({ message: 'ok' })
})

export const unfollow = handle(async (req, res) => {
  const fromUserId = req.session.userId
  if (!fromUserId) throw new StatusError('Unauthorized', 401)

  const toUserId = req.params.id
  if (!toUserId) throw new StatusError('No unfollow id provided', 400)

  const id = `${fromUserId}--${toUserId}`

  await profiles.follow.cmd.UnfollowUser(id, { fromUserId, toUserId })
  res.json({ message: 'ok' })
})
