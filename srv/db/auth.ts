import { users, tokens } from './client'
import { AuthConfig } from 'svcready'
import { env } from '../env'

export const auth: AuthConfig = {
  secret: env.secret,
  async getToken(token: string) {
    const row = await tokens()
      .select()
      .where({ token })
      .first()

    if (!row) return

    return {
      userId: row.user_id,
      token: row.token,
    }
  },
  async saveToken(userId: string, token: string) {
    return tokens().insert({ user_id: userId, token })
  },
  async getUser(userId) {
    const row = await users()
      .select()
      .where({ userId })
      .first()

    if (!row) return

    return {
      userId: row.user_id,
      hash: row.hash,
    }
  },
  async saveUser(userId, hash) {
    const existing = await users()
      .select()
      .where({ userId })
      .first()
    if (!existing) {
      await users().insert({ user_id: userId, hash })
    } else {
      await users()
        .update({ hash })
        .where({ userId })
    }
  },
}
