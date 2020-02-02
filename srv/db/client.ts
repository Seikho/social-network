import '../env'
import * as knex from 'knex'
import { env } from '../env'
import { Schema as Profile } from '../domain/profile'

export type Client = knex

export const db = knex({
  client: 'sqlite3',
  connection: env.database,
  useNullAsDefault: true,
})

export namespace Schema {
  export interface User {
    user_id: string
    hash: string
  }
}

export const tables = {
  profile: 'profile',
  users: 'users',
}

export const table = {
  raw: db.raw.bind(db),
  users: <T = Schema.User>() => db.table<Schema.User, T>(tables.users),
  profile: <T = Profile.Profile>() => db.table<Profile.Profile, T>(tables.profile),
}
