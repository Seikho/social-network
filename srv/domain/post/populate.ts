import { domain } from './domain'
import { MemoryBookmark } from 'evtstore'
import { PostModel, Aggregate } from './types'
import { profiles, Schema } from '../profile'
import { BaseAggregate } from 'evtstore/src/types'
import { Paging } from 'svcready'

export const populator = domain.handler(MemoryBookmark)

const allPosts: PostModel[] = []

populator.handle('PostCreated', async (id, ev, meta) => {
  const profile = await profiles.store.getProfile(ev.userId)
  const post: PostModel = {
    id,
    name: profile?.nickname || ev.userId,
    content: ev.content,
    attachments: ev.attachments,
    visible: !ev.schedule,
    userId: ev.userId,
    created: meta.timestamp,
  }
  allPosts.unshift(post)
})

populator.handle('PostHidden', async id => {
  for (const post of allPosts) {
    if (post.id !== id) continue
    post.visible = false
    return
  }
})

populator.handle('PostShown', async id => {
  for (const post of allPosts) {
    if (post.id !== id) continue
    post.visible = true
    return
  }
})

export async function getPost(id: string) {
  for (const post of allPosts) {
    if (post.id !== id) continue
    return post
  }
  return
}

type GetOptions = Paging & {
  all?: boolean
}

export async function getPostsBy(user: string, opts: GetOptions) {
  const all = opts.all ?? false
  const usersPosts = allPosts.filter(post => post.userId === user && (post.visible || all))
  const page = opts.page - 1
  const start = page * 20
  return usersPosts.slice(start, opts.size ?? 20)
}

export async function findPosts(search: string, opts: Paging) {
  const posts = allPosts.filter(post => post.content.includes(search))
  const page = opts.page - 1
  const start = page * 20
  return posts.slice(start, opts.size)
}

export function toModel(agg: Aggregate & BaseAggregate, profile?: Schema.Profile): PostModel {
  const name = profile?.nickname || agg.userId
  return {
    id: agg.aggregateId,
    attachments: agg.attachments,
    content: agg.content,
    created: agg.created,
    name,
    userId: agg.userId,
    visible: agg.isVisible,
  }
}
