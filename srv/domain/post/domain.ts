import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../provider'
import { Event, Aggregate, Command } from './types'

const ONE_DAY_MS = 86400000

export const domain = createDomain<Event, Aggregate, Command>(
  {
    provider: getProvider('post_events'),
    stream: 'post-events',
    aggregate: () => ({
      userId: '',
      content: '',
      isVisible: false,
      created: new Date(0),
      attachments: [],
    }),
    fold: (ev, _, meta) => {
      switch (ev.type) {
        case 'PostCreated':
          return {
            created: meta.timestamp,
            userId: ev.userId,
            content: ev.content,
            isVisible: !ev.schedule,
            attachments: ev.attachments,
          }

        case 'PostEdited':
          return { content: ev.content, attachments: ev.attachments }

        case 'PostHidden':
          return { isVisible: false }

        case 'PostShown': {
          return { isVisible: true }
        }
      }
    },
  },
  {
    async CreatePost({ userId, content, attachments = [], schedule }, agg) {
      if (agg.version !== 0) throw new CommandError('Invalid post id: Post exists', 'INVALID_ID')
      return { type: 'PostCreated', schedule, userId, content, attachments }
    },
    async EditPost({ userId, content, attachments = [] }, agg) {
      if (agg.version === 0) throw new CommandError('Post does not exist', 'NOT_FOUND')
      if (userId !== agg.userId) throw new CommandError('Unauthorized', 'UNAUTHORIZED')

      const diff = new Date(Date.now()).valueOf() - agg.created.valueOf()
      if (diff > ONE_DAY_MS) throw new CommandError('Post cannot be edited: Post over 24 hours old')

      return { type: 'PostEdited', content, attachments }
    },
    async HidePost(cmd, agg) {
      if (agg.version === 0) throw new CommandError('Post does not exist', 'NOT_FOUND')
      if (cmd.userId !== agg.userId) throw new CommandError('Unauthorized', 'UNAUTHORIZED')
      return { type: 'PostHidden' }
    },
    async ShowPost(cmd, agg) {
      if (agg.version === 0) throw new CommandError('Post does not exist', 'NOT_FOUND')
      if (cmd.userId !== agg.userId) throw new CommandError('Unauthorized', 'UNAUTHORIZED')
      return { type: 'PostShown' }
    },
  }
)
