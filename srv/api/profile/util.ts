import { Schema } from '../../domain/profile'
import { API } from '../../domain/profile/types'

export function toDto(schema: Schema.Profile): API.Profile {
  return {
    id: schema.id,
    nickname: schema.nickname ?? '',
    created: new Date(schema.created),
    seen: new Date(schema.seen),
    status: schema.status ?? '',
    description: schema.description,
    settings: JSON.parse(schema.settings as any),
  }
}

export function toShallowDto(schema: Schema.Profile): API.ProfileList {
  return {
    id: schema.id,
    nickname: schema.nickname,
  }
}
