import { Act } from '../util'

export namespace Schema {
  export interface Profile {
    id: string
    created: Date
    seen: Date
    nickname: string
    description?: string

    enabled: boolean
    status: string
    verified: boolean

    settings: Settings
  }

  export interface Settings {
    visibility: 'online' | 'offline'
    role: Role
  }

  export enum Role {
    SampleRole = 'sample',
    AnotherRole = 'another',
    NotSet = 'notset',
  }
}

export namespace Domain {
  export type ProfileCmd = {
    type: 'Create'
  }

  export type UpdateCmd = SingleUpdate

  export type ProfileEvent = {
    type: 'ProfileCreated'
    userId: string
  }

  export type UpdateEvent =
    | Act<'NicknameUpdated', { name: string }>
    | Act<'ProfileVerified', { verify: boolean }>
    | Act<'RoleUpdated', { role: Schema.Role }>
    | Act<'DescriptionUpdated', { description: string }>

  export type ProfileAgg = {
    userId: string
  }

  export type UpdateAgg = {
    userId: string
  }

  export type SingleUpdate =
    | Act<'UpdateNickname', { name: string }>
    | Act<'VerifyProfile', { verify: boolean }>
    | Act<'UpdateRole', { role: Schema.Role }>
    | Act<'UpdateDescription', { description: string }>
}

export namespace API {
  export type Profile = {
    id: string
    nickname: string
    created: Date
    seen: Date
    status: string
    description?: string
    followers: string[]
    following: string[]

    settings?: Schema.Settings
  }

  export type ProfileList = {
    id: string
    nickname?: string
    description?: string
  }
}
