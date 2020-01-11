import * as dotenv from 'dotenv'

dotenv.config({})

export const env = {
  database: process.env.DB_DATABASE || 'beam.db',
  secret: process.env.APP_SECRET || 'beam-secret',
}
