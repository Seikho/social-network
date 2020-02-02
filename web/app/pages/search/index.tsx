import './search.scss'
import * as React from 'react'
import { withState } from '/store'
import { SearchResult } from 'srv/domain/types'
import { Link } from 'react-router-dom'

type State = {
  result?: SearchResult
  loading: boolean
}

type Props = {
  match?: {
    params?: { search?: string }
  }
}

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

type ProfileProps = { profiles: SearchResult['profiles'] }

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
          <div className="search-page__body">profile description</div>
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
    </div>
  )
}
