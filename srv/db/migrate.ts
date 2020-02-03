import * as path from 'path'
import { db } from './client'
import { logger } from 'svcready'
import { migrate as evtMigrate } from 'evtstore/provider/knex'
import { createUsers } from '../api/user/register'

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
    client: db,
  })

  for (const table of eventTables) {
    await evtMigrate({
      client: db,
      events: table,
    })
  }

  logger.info(`successfully ensured event store schema`)

  await createUsers()
}

const eventTables = ['events', 'profile_events', 'post_events']
