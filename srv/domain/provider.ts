import { createProvider } from 'evtstore/provider/knex'
import { db } from '../db'
import { logger } from 'svcready'

export function getProvider<T extends { type: string }>(table: string = 'events') {
  return createProvider<T>({
    bookmarks: () => db.table<any, any>('bookmarks'),
    events: () => db.table<any, any>(table),
    onError: (err, stream, bookmark) =>
      logger.error({ err, stream }, `Unhandled exception in event handler "${bookmark}"`),
  })
}
