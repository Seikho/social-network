import { create } from 'svcready'
import { auth } from '../db'

const { app, start } = create({
  port: 3000,
  auth,
})

export { app, start }
