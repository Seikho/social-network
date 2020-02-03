import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../../provider'
import { profile } from '../profile'
import { Relation } from './types'

/**
 * - follow
 * - unfollow
 * - "friending"/"relating"
 * - unfriending/unrelating
 * - chat requests
 */

export type RelationEvent =
  | { type: 'RelationRequested'; left: Relate; right: Relate }
  | { type: 'RelationAccepted'; left: Relate; right: Relate }
  | { type: 'RelationRemoved'; leftId: string; rightId: string }
  | { type: 'RelationRejected'; leftId: string; rightId: string }
  | { type: 'UpdateRequested'; left: Relate; right: Relate }
  | { type: 'UpdatedAccepted'; left: Relate; right: Relate }
  | { type: 'UpdateRejected'; leftId: string; rightId: string }

type Aggregate = {
  active: boolean
  left: Relate
  right: Relate
  pending: { left: Relate; right: Relate } | false
}

type Relate = {
  userId: string
  relation: Relation
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
  | { type: 'RejectRelation'; leftId: string; rightId: string }
  | { type: 'AcceptRelation'; leftId: string; rightId: string }
  | { type: 'RemoveRelation'; leftId: string; rightId: string }
  | { type: 'RequestUpdate'; left: Relate; right: Relate }
  | { type: 'RejectUpdate'; leftId: string; rightId: string }
  | { type: 'AcceptUpdate'; leftId: string; rightId: string }

export const relation = createDomain<RelationEvent, Aggregate, Command>(
  {
    stream: 'profile-relation',
    provider: getProvider('profile_events'),
    aggregate: () => ({
      active: false,
      pending: false,
      left: { userId: '', relation: Relation.NotSet },
      right: { userId: '', relation: Relation.NotSet },
    }),
    fold: ev => {
      switch (ev.type) {
        case 'RelationRequested':
          return { pending: { left: ev.left, right: ev.right } }

        case 'RelationAccepted':
          return { active: true, pending: false, left: ev.left, right: ev.right }

        case 'RelationRejected':
          return { active: false, pending: false }

        case 'RelationRemoved':
          return { active: false, pending: false }

        case 'UpdateRequested':
          return { pending: { left: ev.left, right: ev.right } }

        case 'UpdateRejected':
          return { pending: false }

        case 'UpdatedAccepted':
          return { left: ev.left, right: ev.right, pending: false }
      }
    },
  },
  {
    // aggregate = left-id--right-id
    async RequestRelation(cmd, agg) {
      if (agg.active === true) throw new CommandError('Relationship already established')
      if (agg.pending) throw new CommandError('Relationship already requested')

      const target = await profile.getAggregate(cmd.right.userId)
      if (target.aggregate.version === 0)
        throw new CommandError(`User "${cmd.right.userId}" does not exist`)

      // TODO: Validate left and right
      return { type: 'RelationRequested', left: cmd.left, right: cmd.right }
    },
    async RemoveRelation(cmd, agg) {
      if (agg.active === false) throw new CommandError('Relationship is not established')
      return { type: 'RelationRemoved', leftId: cmd.leftId, rightId: cmd.rightId }
    },
    async AcceptRelation(_, agg) {
      if (!agg.pending) throw new CommandError('Relationship is not pending')
      return { type: 'RelationAccepted', left: agg.pending.left, right: agg.pending.right }
    },
    async RejectRelation(cmd, agg) {
      if (!agg.pending) throw new CommandError('Relationship is not pending')
      return { type: 'RelationRejected', leftId: cmd.leftId, rightId: cmd.rightId }
    },
    async RequestUpdate(cmd, agg) {
      if (!agg.active) throw new CommandError('Relationship is not established')
      if (agg.pending) throw new CommandError('Relationship is already pending')

      return { type: 'RelationRequested', left: cmd.left, right: cmd.right }
    },
    async RejectUpdate(cmd, agg) {
      if (!agg.pending) throw new CommandError('Relationship is not pending')
      return { type: 'UpdateRejected', leftId: cmd.leftId, rightId: cmd.rightId }
    },
    async AcceptUpdate(_, agg) {
      if (!agg.pending) throw new CommandError('Relationship is not pending')
      return { type: 'UpdatedAccepted', left: agg.pending.left, right: agg.pending.right }
    },
  }
)
