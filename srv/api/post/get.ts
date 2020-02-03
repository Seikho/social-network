import { handle, StatusError } from 'svcready'
import { posts } from '../../domain/post'
import { profiles } from '../../domain/profile'
import { toPostProfile } from '../profile/util'

export const getPost = handle(async (req, res) => {
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)

  const id = req.params.id
  if (!id) throw new StatusError('No id provided', 400)

  const result = await posts.getPost(id)
  if (!res) throw new StatusError('Not found', 404)
  res.json({ post: result })
})

export const getUserPosts = handle(async (req, res) => {
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)

  const id = req.params.id
  const profile = await profiles.store.getProfile(id)
  if (!profile) throw new StatusError(`Profile not found`, 404)

  const relate = await profiles.relations.getUserRelation(userId, id)

  const userPosts = await posts.getPostsBy(id, req.paging)
  if (!userPosts) throw new StatusError('Not found', 404)

  const dto = toPostProfile(profile, relate)

  res.json({ posts: userPosts, profile: dto })
})
