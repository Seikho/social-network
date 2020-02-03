import { createReducer, saga, upload, get, post } from '../store'
import { PostModel } from 'srv/domain/post/types'
import { Profile } from '../profile'

export type State = {
  modal: {
    open: boolean
  }
  single: {
    loading: boolean
    post?: PostModel
    error?: string
  }
  list: {
    loading: boolean
    error?: string
    posts: PostModel[]
  }
}

export type Action =
  | { type: 'POST_OPEN_MODAL' }
  | {
      type: 'POST_REQUEST_CREATE'
      content: string
      attachments: File[]
    }
  | { type: 'POST_RECEIVE_CREATE'; error?: string }
  | { type: 'POST_CLOSE_MODAL' }
  | { type: 'POST_REQUEST_POSTS'; page?: number; userId?: string; clear?: boolean }
  | { type: 'POST_RECEIVE_POSTS'; error?: string; posts?: PostModel[]; profile?: Profile }
  | { type: 'POST_REQUEST_POST'; id: string }
  | { type: 'POST_RECEIVE_POST'; error?: string; post?: PostModel }
  | { type: 'POST_REQUEST_HIDE'; id: string }
  | { type: 'POST_REQUEST_SHOW'; id: string }
  | { type: 'POST_RECEIVE_HIDE'; id: string; error?: string }
  | { type: 'POST_RECEIVE_SHOW'; id: string; error?: string }

const init: State = {
  modal: {
    open: false,
  },
  single: { loading: false },
  list: { loading: false, posts: [] },
}

export const reducer = createReducer<Action, 'post'>('post', init)

reducer('POST_OPEN_MODAL', {
  modal: { open: true },
})

reducer('POST_CLOSE_MODAL', {
  modal: { open: false },
})

reducer('POST_RECEIVE_POSTS', ({ list }, action) => {
  const newPosts = action.posts ?? []
  const ids = list.posts.map(post => post.id)
  const nextPosts = list.posts.slice()

  for (const post of newPosts) {
    if (ids.includes(post.id)) {
      continue
    }
    nextPosts.push(post)
  }

  nextPosts.sort(byCreated)
  return { list: { loading: false, error: action.error, posts: nextPosts } }
})

reducer('POST_RECEIVE_POST', (_, action) => {
  return { single: { error: action.error, post: action.post, loading: false } }
})

reducer('POST_REQUEST_POST', () => {
  return { single: { loading: true, error: '' } }
})

reducer('POST_REQUEST_POSTS', ({ list }, { clear }) => {
  const nextPosts = clear ? [] : list.posts.slice()
  return { list: { loading: true, posts: nextPosts, error: '' } }
})

reducer('POST_RECEIVE_HIDE', ({ list }, { id }) => {
  const next = list.posts.slice()
  for (const post of next) {
    if (post.id === id) {
      post.visible = false
    }
  }
  return {
    list: {
      ...list,
      posts: next,
    },
  }
})

reducer('POST_RECEIVE_SHOW', ({ list }, { id }) => {
  const next = list.posts.slice()
  for (const post of next) {
    if (post.id === id) {
      post.visible = true
    }
  }
  return {
    list: {
      ...list,
      posts: next,
    },
  }
})

saga('POST_REQUEST_CREATE', async (action, dispatch) => {
  const form = new FormData()
  form.append('content', action.content)
  for (const file of action.attachments) {
    form.append('file', file)
  }
  try {
    const res = await upload('/post', form)
    if (res.status > 200) {
      throw res.data.message || res.statusText
    }

    dispatch({ type: 'POST_RECEIVE_CREATE' })
    dispatch({ type: 'POST_CLOSE_MODAL' })
    dispatch({ type: 'NOTIFY_REQUEST', kind: 'success', text: 'Successfully created post!' })
    dispatch({ type: 'POST_RECEIVE_POSTS', posts: [res.data] })
  } catch (ex) {
    dispatch({
      type: 'NOTIFY_REQUEST',
      kind: 'error',
      text: `Failed to create post: ${ex.message || ex}`,
    })
  }
})

saga('POST_REQUEST_POST', async (action, dispatch) => {
  const res = await get(`/post/${action.id}`)
  if (res.status > 200) {
    dispatch({ type: 'POST_RECEIVE_POST', error: res.data.message })
    return
  }
  dispatch({ type: 'POST_RECEIVE_POST', post: res.data.post })
})

saga('POST_REQUEST_POSTS', async ({ userId }, dispatch, { user }) => {
  if (!user.userId) {
    dispatch({ type: 'NOTIFY_REQUEST', kind: 'error', text: 'Not logged in' })
    return
  }

  const id = userId ?? user.userId
  const res = await get(`/post/${id}/posts`)
  if (res.status > 200) {
    dispatch({ type: 'POST_RECEIVE_POSTS', error: res.data.message })
    return
  }
  dispatch({ type: 'POST_RECEIVE_POSTS', posts: res.data.posts, profile: res.data.profile })
})

saga('POST_REQUEST_HIDE', async (action, dispatch) => {
  const res = await post(`/post/${action.id}/hide`)
  const error = res.status > 200 ? res.data.message ?? res.statusText : ''
  if (error) {
    dispatch({ type: 'NOTIFY_REQUEST', text: `Failed to hide post: ${error}`, kind: 'error' })
  }

  dispatch({ type: 'POST_RECEIVE_HIDE', id: action.id, error })
})

saga('POST_REQUEST_SHOW', async (action, dispatch) => {
  const res = await post(`/post/${action.id}/show`)
  const error = res.status > 200 ? res.data.message ?? res.statusText : ''
  if (error) {
    dispatch({ type: 'NOTIFY_REQUEST', text: `Failed to show post: ${error}`, kind: 'error' })
  }

  dispatch({ type: 'POST_RECEIVE_SHOW', id: action.id, error })
})

function byCreated(left: PostModel, right: PostModel) {
  const l = left.created.valueOf()
  const r = right.created.valueOf()
  return l > r ? -1 : l === r ? 0 : 1
}
