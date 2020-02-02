import { Act } from '../util'

export type PostModel = {
  id: string
  name: string
  userId: string
  content: string
  attachments: Attachment[]
  visible: boolean
  created: Date
}

export type Attachment = {
  original: string
  filename: string
  type: string
}

export type Event =
  | Act<'PostCreated', { content: string; attachments: Attachment[]; schedule?: Date }>
  | { type: 'PostEdited'; content: string; attachments: Attachment[] }
  | { type: 'PostShown' }
  | { type: 'PostHidden' }

export type Command =
  | Act<'CreatePost', { content: string; attachments?: Attachment[]; schedule?: Date }>
  | Act<'EditPost', { content: string; attachments?: Attachment[] }>
  | Act<'ShowPost'>
  | Act<'HidePost'>

export type Aggregate = {
  content: string
  userId: string
  attachments: Attachment[]
  isVisible: boolean
  created: Date
}
