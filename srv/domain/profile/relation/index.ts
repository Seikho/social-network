import { manager } from './manager'
import { populator, getUserFollows } from './populate'
import { relation } from './domain'

export { FollowModel } from './populate'

export const relations = {
  cmd: relation.command,
  manager,
  populator,
  store: { getUserFollows },
}
