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
  }

  export enum Relation {
    Friend = 'friend',
    Partner = 'partner',
    Sibling = 'sibling',
    Parent = 'parent',
    Child = 'child',
    Brother = 'brother',
    Sister = 'sister',
    Father = 'father',
    Mother = 'mother',
  }
}

export namespace Domain {
  export type Command = { type: 'Create' } | SingleUpdate

  export type Event =
    | { type: 'ProfileCreated'; userId: string }
    | { type: 'NicknameUpdated'; name: string }
    | { type: 'ProfileVerified'; verify: boolean }
    | { type: 'DescriptionUpdated'; description: string }

  export type Aggregate = {
    userId: string
    nickname: string
    verified: boolean
    description: string
  }

  export type SingleUpdate =
    | { type: 'UpdateNickname'; name: string }
    | { type: 'VerifyProfile'; verify: boolean }
    | { type: 'UpdateDescription'; description: string }
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
