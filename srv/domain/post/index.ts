import { domain } from './domain'
import { populator, getPost, getPostsBy, toModel, findPosts } from './populate'

export * from './types'

export const posts = {
  cmd: domain.command,
  handler: domain.handler,
  get: domain.getAggregate,
  populator,
  getPost,
  getPostsBy,
  toModel,
  findPosts,
}
