import './user-posts.scss'
import * as React from 'react'
import { withState } from '/store'
import { Posts } from '/app/components/post-list'

export const PostsPage = withState<void, { match: any }>(
  () => {},
  ({ dispatch, match }) => {
    const userId = match?.params?.id
    const [load, setLoad] = React.useState(false)
    React.useEffect(() => {
      if (load) return
      setLoad(true)
      dispatch({ type: 'POST_REQUEST_POSTS', userId, clear: true })
    })

    return (
      <div className="user-posts">
        <Posts />
      </div>
    )
  }
)
