import '../env'
import * as knex from 'knex'
import { env } from '../env'

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

  export interface Token {
    user_id: string
    token: string
  }
}

export const users = <T = Schema.User>() => db.table<Schema.User, T>('users')
export const tokens = <T = Schema.Token>() => db.table<Schema.Token, T>('tokens')
