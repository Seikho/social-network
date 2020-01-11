import * as path from 'path'
import { db } from './client'
import { logger } from 'svcready'
import { migrate as evtMigrate } from 'evtstore/provider/knex'

export async function migrate() {
  const config = {
    directory: path.resolve(__dirname, 'migrations'),
  }

  const current = await db.migrate.currentVersion(config)
  logger.info(config, `current version: ${current}`)
  await db.migrate.latest(config)
  const next = await db.migrate.currentVersion(config)
  logger.info(`successfully migrated to: ${next}`)

  await evtMigrate({
    bookmarks: 'bookmarks',
    events: 'events',
    client: db,
  })

  logger.info(`successfully ensured event store schema`)
}
