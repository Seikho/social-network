import { handle, StatusError } from 'svcready'
import { posts } from '../../domain/post'

export default handle(async (req, res) => {
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)

  const id = req.params.id
  if (!id) {
    const result = await posts.getPostsBy(userId, req.paging)
    res.json({ posts: result })
    return
  }

  const result = await posts.getPost(id)
  if (!res) throw new StatusError('Not found', 404)
  res.json({ post: result })
})

export const getUserPosts = handle(async (req, res) => {
  const id = req.params.id
  const result = await posts.getPostsBy(id, req.paging)
  if (!res) throw new StatusError('Not found', 404)
  res.json({ posts: result })
})
