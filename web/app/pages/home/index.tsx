import './home.scss'
import * as React from 'react'
import { withState } from '/store'
import { Posts } from '/app/components/post-list'

export const Home = withState(
  () => {},
  ({ dispatch }) => {
    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
      if (loaded) return
      setLoaded(true)
      dispatch({ type: 'POST_REQUEST_POSTS' })
    })

    const onCreate = () => dispatch({ type: 'POST_OPEN_MODAL' })

    return (
      <div className="home">
        <div className="home__body">
          <button className="button light" onClick={onCreate}>
            Create Post
          </button>

          <div className="home__posts">
            <Posts />
          </div>
        </div>
      </div>
    )
  }
)
