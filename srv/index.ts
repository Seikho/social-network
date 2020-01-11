import './env'
import { migrate } from './db'
import { start } from './api'
import { logger } from 'svcready'

async function init() {
  try {
    await migrate()
    await start()
    logger.info('service ready')
  } catch (ex) {
    logger.error({ ex }, `failed to start service`)
  }
}

init()
