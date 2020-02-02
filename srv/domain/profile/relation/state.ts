type UserId = string

type RelationState = {
  userId: string
  followers: UserId[]
  following: UserId[]
}

const state = new Map<UserId, RelationState>()

export async function getUserState(userId: string): Promise<RelationState> {
  const existing = state.get(userId)
  if (existing) return existing

  return {
    userId,
    followers: [],
    following: [],
  }
}

export async function followUser(fromUser: string, toUser: string) {
  const source = await getUserState(fromUser)
  const dest = await getUserState(toUser)

  source.following.push(toUser)
  dest.followers.push(fromUser)

  state.set(fromUser, source)
  state.set(toUser, dest)
}

export async function unfollowUser(fromUser: string, toUser: string) {
  const source = await getUserState(fromUser)
  const dest = await getUserState(toUser)

  source.following = source.followers.filter(id => id !== toUser)
  dest.followers = dest.followers.filter(id => id !== fromUser)

  state.set(fromUser, source)
  state.set(toUser, dest)
}
