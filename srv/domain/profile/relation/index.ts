import { populator, getUserRelation } from './populate'
import { relation } from './domain'

export { RelateModel } from './populate'

export const relations = {
  cmd: relation.command,
  populator,
  getUserRelation,
}
