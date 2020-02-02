import { handle, StatusError } from 'svcready'
import { table } from '../../db/client'
import { Schema } from 'srv/domain/profile'
import { SearchResult } from '../..//domain/types'
import { API } from '../../domain/profile/types'
import { posts } from '../../domain/post'

export default handle(async (req, res) => {
  if (!req.session.userId) throw new StatusError('Unauthorized', 401)

  const search = req.params.search
  if (!req.params.search) throw new StatusError('No search provided', 400)

  // can i inject here?

  const [profiles, searchPosts] = await Promise.all([
    table
      .profile<Schema.Profile[]>()
      .where('id', 'like', `%${search}%`)
      .andWhere('enabled', true)
      .limit(req.paging.size),
    posts.findPosts(search, req.paging),
  ])

  const result: SearchResult = {
    profiles: profiles.map(toProfileDTO),
    posts: searchPosts,
  }
  res.json({ result })
})

function toProfileDTO(schema: Schema.Profile): API.ProfileList {
  return {
    id: schema.id,
    nickname: schema.nickname,
  }
}
