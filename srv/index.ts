import { start } from './start'

start()

process.on('unhandledRejection', err => console.error(err))
