import './search.scss'
import * as React from 'react'
import { withState } from '/store'
import { SearchResult } from 'srv/domain/types'
import { Link } from 'react-router-dom'
import { Profile } from '/store/profile'

type State = {
  result?: SearchResult
  loading: boolean
  self?: Profile
}

type Props = {
  match?: {
    params?: { search?: string }
  }
}

type Follow = (type: 'follow' | 'unfollow', userId: string) => void

export const SearchPage = withState<State, Props>(
  ({ search }) => ({ result: search.result, loading: search.loading }),
  ({ result, loading, dispatch, match }) => {
    const param = match?.params?.search ?? ''

    const [loaded, setLoaded] = React.useState(false)
    const [last, setLast] = React.useState(param)

    React.useEffect(() => {
      if (loaded && last === param) return
      setLast(param)
      setLoaded(true)
      dispatch({ type: 'SEARCH_REQUEST_SEARCH', search: param })
    }, [match])

    if (loading) {
      return <div className="search-page">Loading...</div>
    }

    return (
      <div className="search-page">
        <div className="search-page__body">
          <Results search={result} />
        </div>
      </div>
    )
  }
)

type ResultProps = { search?: SearchResult }

const Results = ({ search }: ResultProps) => {
  if (!search) {
    return <div>No results found</div>
  }

  return (
    <>
      <div className="search-page__ribbon">Profiles</div>
      <Profiles profiles={search.profiles} />
      <div className="search-page__ribbon">Posts</div>
      <Posts posts={search.posts} />
    </>
  )
}

type ProfileProps = {
  profiles: SearchResult['profiles']
}

const Profiles = ({ profiles }: ProfileProps) => {
  if (!profiles.length) {
    return <div className="search-page__profiles">No profiles found</div>
  }

  return (
    <div className="search-page__profiles">
      {profiles.map(profile => (
        <div className="search-page__profile" key={profile.id}>
          <div className="search-page__head">
            <Link to={`/posts/${profile.id}`}>@{profile.nickname || profile.id}</Link>
          </div>
          <div className="search-page__body">{profile.description ?? 'No description'}</div>
          <div className="search-page__footer">
            <Follow userId={profile.id} />
          </div>
        </div>
      ))}
    </div>
  )
}

type PostsProps = { posts: SearchResult['posts'] }

const Posts = ({ posts }: PostsProps) => {
  if (!posts.length) {
    return <div className="search-page__posts">No posts found</div>
  }

  return (
    <div className="search-page__posts">
      {posts.map(post => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  )
}

type PostProps = { post: SearchResult['posts'][0] }

const Post = ({ post }: PostProps) => {
  return (
    <div className="search-page__post">
      <div className="search-page__head">
        <div>
          <Link to={`/posts/${post.userId}`}>@{post.name}</Link>
        </div>
        <div>{new Date(post.created).toLocaleString()}</div>
      </div>

      <div className="search-page__body">{post.content}</div>
      <div className="search-page__footer">
        <Follow userId={post.userId} />
      </div>
    </div>
  )
}

type FollowState = {
  selfId?: string
  following: string[]
}

type FollowProps = {
  userId: string
}

const Follow = withState<FollowState, FollowProps>(
  ({ profile }) => ({ selfId: profile.user?.id, following: profile.user?.following ?? [] }),
  ({ selfId, dispatch, following, userId }) => {
    const isFollowing = following.includes(userId)
    const isSelf = userId === selfId

    const follow: Follow = (type, userId) => {
      if (type === 'follow') dispatch({ type: 'PROFILE_REQUEST_FOLLOW', userId })
      if (type === 'unfollow') dispatch({ type: 'PROFILE_REQUEST_UNFOLLOW', userId })
    }

    if (isSelf) return null

    if (isFollowing) {
      return (
        <button className="button light small" onClick={() => follow('unfollow', userId)}>
          Unfollow
        </button>
      )
    }

    return (
      <button className="button light small" onClick={() => follow('follow', userId)}>
        Follow
      </button>
    )
  }
)
