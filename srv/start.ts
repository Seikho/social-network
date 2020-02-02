import './env'
import { migrate } from './db'
import { start as startApi } from './api'
import { logger } from 'svcready'
import { profiles } from './domain/profile'
import { posts } from './domain/post'

export async function start() {
  try {
    await migrate()
    await startApi()
    startPopulators()
    logger.info('service ready')
  } catch (ex) {
    logger.error({ ex }, `failed to start service`)
  }
}

function startPopulators() {
  profiles.populators.profile.start()
  profiles.populators.update.start()
  posts.populator.start()
}
