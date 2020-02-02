import { table } from './client'
import { AuthConfig } from 'svcready'
import { env } from '../env'

export const auth: AuthConfig = {
  secret: env.secret,
  getUser,
}

export async function getUser(userId: string) {
  const row = await table
    .users()
    .select()
    .where({ user_id: userId })
    .first()

  if (!row) return

  return {
    userId: row.user_id,
    hash: row.hash,
  }
}
