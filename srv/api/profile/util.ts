import { Schema } from '../../domain/profile'
import { API } from '../../domain/profile/types'
import { FollowModel } from '../../domain/profile/relation/follow'
import { Relation } from '../../domain/profile/relation/types'
import { RelateModel } from 'srv/domain/profile/relation'

export function toDto(schema: Schema.Profile, follows?: FollowModel): API.Profile {
  return {
    id: schema.id,
    nickname: schema.nickname ?? '',
    created: new Date(schema.created),
    seen: new Date(schema.seen),
    status: schema.status ?? '',
    description: schema.description,
    settings: JSON.parse(schema.settings as any),
    following: follows?.following ?? [],
    followers: follows?.followers ?? [],
  }
}

export function toPostProfile(schema: Schema.Profile, relate: RelateModel): API.PostProfile {
  const result: API.PostProfile = {
    id: schema.id,
    nickname: schema.nickname ?? '',
    created: new Date(schema.created),
    seen: new Date(schema.seen),
    status: schema.status ?? '',
    description: schema.description,
    followedBy: relate.followedBy,
    following: relate.following,
  }

  if (!relate.related) return result
  result.relate = {
    from: relate.from,
    to: relate.to,
  }
  return result
}

export function toShallowDto(schema: Schema.Profile): API.ProfileList {
  return {
    id: schema.id,
    nickname: schema.nickname,
    description: schema.description,
  }
}

const relations: string[] = Object.entries(Relation).map(entry => entry[1])

export function isRelation(role: string): asserts role is Relation {
  const isValid = relations.includes(role)
  if (!isValid) throw new Error(`Role "${role}" is not valid`)
}
