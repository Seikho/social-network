import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../../provider'
import { Schema } from '../types'

/**
 * - follow
 * - unfollow
 * - "friending"/"relating"
 * - unfriending/unrelating
 * - chat requests
 */

type Event = { type: 'RelationAccepted'; left: Relate; right: Relate } | { type: '' }

type Aggregate = {
  active: boolean
  left: Relate
  right: Relate
}

type Relate = {
  userId: string
  relation: Schema.Relation
}

type Command =
  /**
   * user-a    <----> user-b
   * [brother] <----> [sister]
   * [friend] <----> [friend]
   * [sibling] <----> [sibling]
   */
  | {
      type: 'RequestRelation'
      left: Relate
      right: Relate
    }
  | { type: 'RejectRelation' }
  | { type: 'AcceptRelation'; relation: Schema.Relation }
  | { type: 'RemoveRelation' }
  | {
      type: 'UpdateRelation'
      left?: Relate
      right?: Relate
    }

export const relation = createDomain<Event, Aggregate, Command>(
  {
    stream: 'profile-relation',
    provider: getProvider('profile_events'),
    aggregate: () => ({
      active: false,
      left: { userId: '', relation: Schema.Relation.NotSet },
      right: { userId: '', relation: Schema.Relation.NotSet },
    }),
    fold: () => ({}),
  },
  {
    // aggregate = left-id--right-id
    async RequestRelation(cmd, agg) {
      if (agg.version !== 0) throw new Error()
    },
    async AcceptRelation(cmd) {},
    async RejectRelation(cmd) {},
    async RemoveRelation(cmd) {},
    async UpdateRelation(cmd) {},
  }
)

type AggId = string

const state = new Map<AggId, { id: string; left: Relate; right: Relate }>()
