import { table } from '../../db/client'
import { Schema } from './types'

export async function createProfile(id: string) {
  await table.profile().insert({
    id,
    created: new Date(),
    seen: new Date(),
    enabled: true,
    verified: false,
    nickname: '',
    status: '',
    settings: JSON.stringify({
      visibility: 'online',
      role: Schema.Role.NotSet,
    }) as any,
  })
}

export async function updateProfile<T extends keyof Schema.Profile>(
  id: string,
  key: T,
  value: Schema.Profile[T]
) {
  await table
    .profile()
    .update(key, value)
    .where('id', id)
}

export async function getProfile(id: string) {
  const profile = await table
    .profile()
    .select()
    .where('id', id)
    .orWhere('nickname', id)
    .first()
  return profile
}
