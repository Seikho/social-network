import './post-list.scss'
import * as React from 'react'
import { PostModel, Attachment } from 'srv/domain/post'
import { Link } from 'react-router-dom'
import { withState } from '/store'
import { config } from '/store/config'

export const Posts = withState(
  ({ post, user }) => ({ posts: post.list.posts, userId: user.userId }),
  ({ posts, dispatch, userId }) => {
    const onHide = (id: string) => dispatch({ type: 'POST_REQUEST_HIDE', id })
    const onShow = (id: string) => dispatch({ type: 'POST_REQUEST_SHOW', id })

    return (
      <div className="post-list">
        {posts.map(post => (
          <Post
            post={post}
            key={post.id}
            isOwner={userId === post.userId}
            onShow={onShow}
            onHide={onHide}
          />
        ))}
      </div>
    )
  }
)

type PostProps = {
  post: PostModel
  isOwner: boolean
  onHide: (id: string) => void
  onShow: (id: string) => void
}

const Post = ({ post, isOwner, onHide, onShow }: PostProps) => {
  const mod = post.visible ? '' : 'post-list__post--hidden'
  return (
    <div className={`post-list__post ${mod}`}>
      <div className="post-list__posthead">
        <div>
          <Link to={`/posts/${post.userId}`}>@{post.name}</Link>
        </div>
        <div>{new Date(post.created).toLocaleString()}</div>
      </div>
      <div className="post-list__postbody">{post.content}</div>
      <Assets assets={post.attachments} />
      <div className="post-list__buttons">
        <button className="button light small">Like</button>
        {!isOwner && <button className="button light small">Repost</button>}
        {isOwner && post.visible && (
          <button className="button light small" onClick={() => onHide(post.id)}>
            Hide
          </button>
        )}
        {isOwner && !post.visible && (
          <button className="button light small" onClick={() => onShow(post.id)}>
            Show
          </button>
        )}
      </div>
    </div>
  )
}

type AssetProps = {
  assets: Attachment[]
}

const Assets = ({ assets }: AssetProps) => {
  if (!assets.length) return <></>
  const [first, ...last] = assets
  if (!last.length) {
    return (
      <div className="post-list__postassets">
        <div className="post-list__postasset">
          <img src={toSrc(first.filename)} />
        </div>
      </div>
    )
  }

  const [main, setMain] = React.useState(first)

  const thumbs = assets.map((file, i) => (
    <div className="post-list__thumb" key={i} onClick={() => setMain(file)}>
      <img src={toSrc(file.filename)} />
    </div>
  ))
  return (
    <div className="post-list__postassets">
      <div className="post-list__postasset">
        <img src={toSrc(main.filename)} />
      </div>
      <div className="post-list__thumbs">{thumbs}</div>
    </div>
  )
}

function toSrc(filename: string) {
  return `${config.assetUrl}/${filename}`
}
