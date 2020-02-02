import { API } from './profile/types'
import { PostModel } from './post'

export type SearchResult = {
  profiles: API.ProfileList[]
  posts: PostModel[]
}
