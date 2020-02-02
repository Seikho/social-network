import { handle, StatusError } from 'svcready'
import { posts } from '../../domain/post'

export const show = handle(async (req, res) => {
  const id = req.params.id
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)
  await posts.cmd.ShowPost(id, { userId })
  res.json({ message: 'ok' })
})

export const hide = handle(async (req, res) => {
  const id = req.params.id
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)
  await posts.cmd.HidePost(id, { userId })
  res.json({ message: 'ok' })
})
